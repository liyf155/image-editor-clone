import { NextRequest, NextResponse } from 'next/server'
import { createCheckout } from '@/lib/creem/checkout'
import { createClient } from '@/lib/supabase/server'

interface PlanConfig {
  name: string
  productId: string
}

// 方案映射：使用 product_id 而不是 price_id
const PLAN_MAPPING: Record<string, PlanConfig> = {
  Basic: {
    name: 'Basic',
    productId: process.env.CREEM_PRODUCT_ID_BASIC || 'prod_basic_monthly',
  },
  Pro: {
    name: 'Pro',
    productId: process.env.CREEM_PRODUCT_ID_PRO || 'prod_pro_monthly',
  },
  Max: {
    name: 'Max',
    productId: process.env.CREEM_PRODUCT_ID_MAX || 'prod_max_monthly',
  },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planName, billingCycle = 'monthly' } = body

    // Get user from session
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // 验证方案
    const plan = PLAN_MAPPING[planName]
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      )
    }

    // 生成唯一的 request_id
    const requestId = `${Date.now()}-${Math.random().toString(36).substring(7)}`

    // Save checkout mapping for webhook (if table exists)
    try {
      const { error: mappingError } = await supabase
        .from('checkout_mappings')
        .insert({
          request_id: requestId,
          user_id: user.id,
        })

      if (mappingError) {
        console.warn('Warning: Could not save checkout mapping (table may not exist):', mappingError.message)
        // Continue anyway - the payment will still work, just webhook won't be able to find user
      }
    } catch (err) {
      console.warn('Warning: Error saving checkout mapping:', err)
      // Continue anyway
    }

    // 构建成功 URL（不要添加查询参数，Creem 会自动添加）
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const successUrl = `${baseUrl}/payment/success`

    // 调用 Creem API 创建结账会话
    const checkoutResponse = await createCheckout({
      productId: plan.productId,
      requestId,
      successUrl,
    })

    return NextResponse.json({
      success: true,
      checkout_url: checkoutResponse.checkout_url,
    })
  } catch (error) {
    console.error('Payment API error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create checkout session'
      },
      { status: 500 }
    )
  }
}
