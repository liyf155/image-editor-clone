import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json(
        { hasSubscription: false, error: 'Missing user_id' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if user has an active subscription
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (error) {
      // Log error for debugging
      console.error('Subscription check error:', error)

      // If table doesn't exist, return helpful message
      if (error.code === '42P01') {
        console.error('Subscriptions table does not exist. Please run the database migration.')
        return NextResponse.json({
          hasSubscription: false,
          error: 'Database not configured'
        })
      }

      // For other errors, return false
      return NextResponse.json({ hasSubscription: false })
    }

    const hasActiveSubscription = !!subscription

    console.log(`Subscription check for user ${userId}: ${hasActiveSubscription}`)

    return NextResponse.json({
      hasSubscription: hasActiveSubscription,
      subscription: hasActiveSubscription ? subscription : null
    })
  } catch (error) {
    console.error('Subscription verification error:', error)
    return NextResponse.json(
      { hasSubscription: false, error: 'Verification failed' },
      { status: 500 }
    )
  }
}
