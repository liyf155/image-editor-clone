import crypto from 'crypto'

/**
 * 生成Creem签名
 * @param params 参数对象
 * @param apiKey API密钥
 * @returns 生成的签名
 */
export function generateSignature(params: Record<string, any>, apiKey: string): string {
  // 创建格式为 "key1=value1|key2=value2|...|salt=apiKey" 的数据字符串
  // 重要：不要对键进行排序 - 按照提供的顺序使用
  const data = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .concat(`salt=${apiKey}`)
    .join('|')

  // 使用SHA-256哈希算法生成签名
  const hash = crypto.createHash('sha256').update(data).digest('hex')
  return hash
}

/**
 * 验证Creem签名
 * @param params 重定向参数
 * @param signature 要验证的签名
 * @param apiKey API密钥
 * @returns 签名是否有效
 */
export function verifySignature(
  params: Record<string, any>,
  signature: string,
  apiKey: string
): boolean {
  try {
    // 过滤掉null/undefined值，并移除signature参数
    const filteredParams: Record<string, any> = {}
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && key !== 'signature') {
        filteredParams[key] = value
      }
    })

    // 生成签名并比较
    const computedSignature = generateSignature(filteredParams, apiKey)
    return computedSignature === signature
  } catch (error) {
    console.error('Error verifying signature:', error)
    return false
  }
}
