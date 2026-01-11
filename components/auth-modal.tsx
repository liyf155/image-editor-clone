"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const supabase = createClient()

  if (!isOpen) return null

  const handleSignIn = async () => {
    onClose()
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: 'consent',
          access_type: 'offline',
        },
      },
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 relative animate-in fade-in-0 zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold mb-3">Sign In Required</h3>

          <p className="text-muted-foreground mb-6">
            Please sign in to access Nano Banana's AI image editing features and start creating stunning images.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              size="lg"
              className="bg-[#FFC107] text-black hover:bg-[#FFB300] rounded-full px-8 shadow-md"
              onClick={handleSignIn}
            >
              Sign In with Google
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            Start with a free account • No credit card required for signup
          </p>
        </div>
      </Card>
    </div>
  )
}
