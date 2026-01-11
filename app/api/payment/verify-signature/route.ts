import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from '@/lib/creem/signature'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { params } = body

    if (!params || typeof params !== 'object') {
      return NextResponse.json(
        { error: 'Missing params' },
        { status: 400 }
      )
    }

    const signature = params.signature
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    const CREEM_API_KEY = process.env.CREEM_API_KEY
    if (!CREEM_API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // 验证签名
    const isValid = verifySignature(params, signature, CREEM_API_KEY)

    return NextResponse.json({
      valid: isValid,
    })
  } catch (error) {
    console.error('Signature verification error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}
