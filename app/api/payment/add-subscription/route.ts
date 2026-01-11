import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planName = 'Basic' } = body

    // Get user from session
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Calculate expiration date (1 year from now)
    const expiresAt = new Date()
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)

    const subscriptionData = {
      user_id: user.id,
      plan: planName,
      status: 'active',
      product_id: 'manual_add',
      order_id: `manual_${Date.now()}`,
      checkout_id: `manual_${Date.now()}`,
      started_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log('Manually adding subscription:', subscriptionData)

    // Insert or update subscription
    const { error: subError } = await supabase
      .from('subscriptions')
      .upsert(subscriptionData, {
        onConflict: 'user_id'
      })

    if (subError) {
      console.error('Error adding subscription:', subError)
      return NextResponse.json(
        { error: 'Failed to add subscription', details: subError.message },
        { status: 500 }
      )
    }

    console.log('✅ Subscription added successfully for user:', user.id, 'Plan:', planName)

    return NextResponse.json({
      success: true,
      subscription: subscriptionData
    })
  } catch (error) {
    console.error('Add subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to add subscription', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
