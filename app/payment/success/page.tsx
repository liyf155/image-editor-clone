"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [params, setParams] = useState<any>(null)

  useEffect(() => {
    async function verifyPayment() {
      // 构建查询字符串
      const queryString = searchParams.toString()

      if (!queryString) {
        setIsValid(false)
        setIsLoading(false)
        return
      }

      try {
        // 调用验证 API
        const response = await fetch(`/api/payment/verify-payment?${queryString}`)
        const data = await response.json()

        setIsValid(data.valid)
        setParams(data.params)
      } catch (error) {
        console.error('Verification error:', error)
        setIsValid(false)
      } finally {
        setIsLoading(false)
      }
    }

    verifyPayment()
  }, [searchParams])

  // 加载中
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="text-center space-y-6">
            <Loader2 className="w-20 h-20 text-primary mx-auto animate-spin" />
            <div>
              <h1 className="text-2xl font-bold mb-2">Verifying Payment...</h1>
              <p className="text-muted-foreground">
                Please wait while we verify your payment.
              </p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // 验证失败
  if (!isValid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="text-center space-y-6">
            <XCircle className="w-20 h-20 text-red-500 mx-auto" />
            <div>
              <h1 className="text-2xl font-bold mb-2">Invalid Payment</h1>
              <p className="text-muted-foreground">
                We could not verify your payment. Please contact support if you believe this is an error.
              </p>
            </div>
            <Button asChild>
              <Link href="/pricing">View Pricing Plans</Link>
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // 验证成功 - 显示支付详情
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="p-8 max-w-lg w-full">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Thank you for your payment! Your subscription is now active.
            </p>
          </div>

          <div className="bg-accent/50 rounded-lg p-4 text-left space-y-2">
            <p className="text-sm font-medium">Payment Details:</p>
            {params?.order_id && (
              <p className="text-sm text-muted-foreground">
                Order ID: <span className="font-mono">{params.order_id}</span>
              </p>
            )}
            {params?.checkout_id && (
              <p className="text-sm text-muted-foreground">
                Checkout ID: <span className="font-mono">{params.checkout_id}</span>
              </p>
            )}
            {params?.request_id && (
              <p className="text-sm text-muted-foreground">
                Request ID: <span className="font-mono">{params.request_id}</span>
              </p>
            )}
            {params?.product_id && (
              <p className="text-sm text-muted-foreground">
                Product ID: <span className="font-mono">{params.product_id}</span>
              </p>
            )}
            {params?.customer_id && (
              <p className="text-sm text-muted-foreground">
                Customer ID: <span className="font-mono">{params.customer_id}</span>
              </p>
            )}
          </div>

          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">Start Editing</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">View Plans</Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </Card>
    </div>
  )
}
