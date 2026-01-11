import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const signature = request.headers.get('x-creem-signature')

    console.log('Webhook received:', { type: body.type, data: body.data })

    // Optional: Verify webhook signature if CREEM_WEBHOOK_SECRET is set
    const CREEM_WEBHOOK_SECRET = process.env.CREEM_WEBHOOK_SECRET

    if (CREEM_WEBHOOK_SECRET && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', CREEM_WEBHOOK_SECRET)
        .update(JSON.stringify(body))
        .digest('hex')

      if (signature !== expectedSignature) {
        console.error('Invalid webhook signature')
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }

    const supabase = await createClient()

    // Handle different webhook events
    const eventType = body.type

    if (eventType === 'payment.succeeded' || eventType === 'checkout.completed' || eventType === 'subscription.created') {
      const { product_id, order_id, request_id, checkout_id, customer_id } = body.data

      console.log('Processing payment:', { product_id, order_id, request_id })

      // Extract user_id from request_id mapping
      let userId = body.data.metadata?.user_id

      if (!userId) {
        // Try to get user_id from checkout_mappings table
        const { data: mapping, error: mappingError } = await supabase
          .from('checkout_mappings')
          .select('user_id')
          .eq('request_id', request_id)
          .single()

        if (mappingError) {
          console.error('Error fetching checkout mapping:', mappingError)
        } else {
          userId = mapping?.user_id
        }
      }

      if (!userId) {
        console.error('No user_id found for payment. Data:', {
          order_id,
          request_id,
          customer_id,
          metadata: body.data.metadata
        })
        // Don't fail the webhook, just log the error
        return NextResponse.json({ received: true, warning: 'No user_id found' })
      }

      // Determine plan from product_id
      const planMap: Record<string, string> = {
        [process.env.CREEM_PRODUCT_ID_BASIC || 'basic_prod']: 'Basic',
        [process.env.CREEM_PRODUCT_ID_PRO || 'pro_prod']: 'Pro',
        [process.env.CREEM_PRODUCT_ID_MAX || 'max_prod']: 'Max',
      }

      const planName = planMap[product_id] || 'Basic'

      // Calculate expiration date (1 year from now)
      const expiresAt = new Date()
      expiresAt.setFullYear(expiresAt.getFullYear() + 1)

      // Insert or update subscription
      const subscriptionData = {
        user_id: userId,
        plan: planName,
        status: 'active',
        product_id: product_id,
        order_id: order_id,
        checkout_id: checkout_id,
        started_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      }

      console.log('Saving subscription:', subscriptionData)

      const { error: subError } = await supabase
        .from('subscriptions')
        .upsert(subscriptionData, {
          onConflict: 'user_id'
        })

      if (subError) {
        console.error('Error saving subscription:', subError)
        return NextResponse.json(
          { error: 'Failed to save subscription', details: subError.message },
          { status: 500 }
        )
      }

      console.log('✅ Subscription saved successfully for user:', userId, 'Plan:', planName)
    }

    return NextResponse.json({ received: true, success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
