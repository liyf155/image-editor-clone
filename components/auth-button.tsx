"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function AuthButton({ onSignInClick }: { onSignInClick?: () => void }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignIn = async () => {
    if (onSignInClick) {
      onSignInClick()
    } else {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: 'consent', // Force showing consent screen every time
            access_type: 'offline', // Get refresh token
          },
        },
      })
    }
  }

  const handleSignOut = async () => {
    await fetch("/auth/signout", { method: "POST" })
    setUser(null)
  }

  if (loading) {
    return <div className="h-9" />
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground hidden sm:inline">
          {user.email}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={handleSignOut}
          className="gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <Button
      size="sm"
      onClick={handleSignIn}
      className="bg-primary text-primary-foreground hover:bg-primary/90"
    >
      Sign In with Google
    </Button>
  )
}
