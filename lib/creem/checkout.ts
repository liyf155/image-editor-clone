/**
 * Creem Checkout Service
 * 处理 Creem 支付结账会话创建
 */

export interface CreateCheckoutParams {
  productId: string
  requestId?: string
  successUrl?: string
}

export interface CreateCheckoutResponse {
  checkout_url: string
  [key: string]: any
}

/**
 * 创建 Creem 结账会话
 * @param params 结账参数
 * @returns 包含结账URL的响应
 */
export async function createCheckout(
  params: CreateCheckoutParams
): Promise<CreateCheckoutResponse> {
  const API_URL = process.env.CREEM_API_URL || 'https://test-api.creem.io'
  const API_KEY = process.env.CREEM_API_KEY

  if (!API_KEY) {
    throw new Error('CREEM_API_KEY is not configured')
  }

  // 调试日志
  console.log('=== Creem Checkout Debug ===')
  console.log('API_URL:', API_URL)
  console.log('Product ID:', params.productId)
  console.log('Request ID:', params.requestId)
  console.log('Success URL:', params.successUrl)

  try {
    // 获取格式化的API基础URL（确保没有尾部斜杠）
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL
    const apiUrl = `${baseUrl}/v1/checkouts`

    console.log('API Endpoint:', apiUrl)

    const requestBody = {
      product_id: params.productId,
      request_id: params.requestId,
      success_url: params.successUrl,
    }

    console.log('Request Body:', JSON.stringify(requestBody, null, 2))

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify(requestBody),
    })

    console.log('Response Status:', response.status)
    console.log('Response OK:', response.ok)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Error Response:', JSON.stringify(errorData, null, 2))
      throw new Error(
        `Creem API error: ${response.status} ${JSON.stringify(errorData)}`
      )
    }

    const data = await response.json()
    console.log('Success Response:', JSON.stringify(data, null, 2))

    if (!data.checkout_url) {
      throw new Error('API response does not contain checkout_url')
    }

    console.log('Checkout URL:', data.checkout_url)
    console.log('=== End Debug ===')

    return data
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}
