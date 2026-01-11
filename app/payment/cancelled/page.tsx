import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PaymentCancelledPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          <XCircle className="w-20 h-20 text-muted-foreground" />
        </div>

        <h1 className="text-4xl font-bold">Payment Cancelled</h1>

        <p className="text-muted-foreground text-lg max-w-md">
          No worries! You can always come back and subscribe later when you're ready.
        </p>

        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/pricing">Try Again</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
