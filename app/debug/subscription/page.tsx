"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useEffect } from "react"

export default function DebugSubscriptionPage() {
  const [user, setUser] = useState<any>(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // Check if user is admin (you can add your own admin check logic here)
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email) {
        // TODO: Add proper admin check
        // For now, only allow access in development or with specific email
        const isAdmin = process.env.NODE_ENV === 'development' ||
                        session.user.email === 'your-admin@example.com'
        setIsAuthorized(isAdmin)
      }
    }
    checkAuth()
  }, [supabase])

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <Card className="p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Access Denied</h1>
          <p className="text-center text-muted-foreground">
            This page is only accessible in development mode or by authorized administrators.
          </p>
        </Card>
      </div>
    )
  }

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user ?? null)
    setMessage(`User: ${session?.user?.email || 'Not logged in'}`)
  }

  const checkSubscription = async () => {
    if (!user) {
      setMessage("Please check user first")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/payment/check-subscription?user_id=${user.id}`)
      const data = await response.json()
      setSubscriptionStatus(data)
      setMessage(JSON.stringify(data, null, 2))
    } catch (error) {
      setMessage(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const addSubscription = async (planName: string) => {
    if (!user) {
      setMessage("Please check user first")
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/payment/add-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planName })
      })
      const data = await response.json()
      setMessage(JSON.stringify(data, null, 2))
      checkSubscription()
    } catch (error) {
      setMessage(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <p className="text-sm text-yellow-600 dark:text-yellow-500">
            ⚠️ <strong>Development Mode Only:</strong> This page should not be accessible in production.
          </p>
        </div>

        <h1 className="text-3xl font-bold">Subscription Debug Tool</h1>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">1. Check User</h2>
          <Button onClick={checkUser} disabled={loading}>
            Check Current User
          </Button>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">2. Check Subscription</h2>
          <Button onClick={checkSubscription} disabled={loading || !user}>
            Check Subscription Status
          </Button>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">3. Manually Add Subscription</h2>
          <p className="text-sm text-muted-foreground">
            Use this if webhook didn't work or for testing purposes
          </p>
          <div className="flex gap-4 flex-wrap">
            <Button
              onClick={() => addSubscription('Basic')}
              disabled={loading || !user}
              variant="outline"
            >
              Add Basic Plan
            </Button>
            <Button
              onClick={() => addSubscription('Pro')}
              disabled={loading || !user}
              variant="outline"
            >
              Add Pro Plan
            </Button>
            <Button
              onClick={() => addSubscription('Max')}
              disabled={loading || !user}
              variant="outline"
            >
              Add Max Plan
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Output</h2>
          <pre className="bg-muted p-4 rounded text-sm overflow-auto max-h-96">
            {message || 'No output yet'}
          </pre>
        </Card>

        {subscriptionStatus && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Subscription Details</h2>
            <pre className="bg-muted p-4 rounded text-sm overflow-auto">
              {JSON.stringify(subscriptionStatus, null, 2)}
            </pre>
          </Card>
        )}
      </div>
    </div>
  )
}
