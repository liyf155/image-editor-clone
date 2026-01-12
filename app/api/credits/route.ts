import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get user session
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get credit balance using the function
    const { data: balance, error: balanceError } = await supabase.rpc('get_credit_balance', {
      user_uuid: user.id
    })

    if (balanceError) {
      console.error('Error fetching credit balance:', balanceError)
      return NextResponse.json(
        { error: 'Failed to fetch credit balance' },
        { status: 500 }
      )
    }

    // Get recent transactions
    const { data: transactions, error: transactionsError } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (transactionsError) {
      console.error('Error fetching transactions:', transactionsError)
    }

    return NextResponse.json({
      balance: balance || 0,
      transactions: transactions || []
    })
  } catch (error) {
    console.error('Credits API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
