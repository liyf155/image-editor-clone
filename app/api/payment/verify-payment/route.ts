import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from '@/lib/creem/signature'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // 提取所有参数
    const params: Record<string, string> = {}
    for (const [key, value] of searchParams.entries()) {
      if (key !== 'signature') {
        params[key] = value
      }
    }

    const signature = searchParams.get('signature')

    if (!signature) {
      return NextResponse.json(
        { valid: false, error: 'Missing signature' },
        { status: 400 }
      )
    }

    const CREEM_API_KEY = process.env.CREEM_API_KEY
    if (!CREEM_API_KEY) {
      return NextResponse.json(
        { valid: false, error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // 验证签名
    const isValid = verifySignature(params, signature, CREEM_API_KEY)

    return NextResponse.json({
      valid: isValid,
      params, // 返回验证后的参数供前端使用
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { valid: false, error: 'Verification failed' },
      { status: 500 }
    )
  }
}
