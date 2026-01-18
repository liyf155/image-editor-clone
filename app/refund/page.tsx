import Link from "next/link"
import { Card } from "@/components/ui/card"

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity">
              <span className="text-3xl">🍌</span>
              <span className="text-foreground">Nano Banana</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Refund Policy</h1>
        <p className="text-muted-foreground mb-12">
          Last updated: January 18, 2026
        </p>

        <div className="space-y-10">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              We want you to be completely satisfied with our service. If you're not happy with your purchase,
              we offer a straightforward refund policy to ensure your peace of mind.
            </p>
          </section>

          {/* Eligibility for Refunds */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Eligibility for Refunds</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Refund requests must be made within <strong>7 days</strong> of purchase</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Less than <strong>50% of purchased credits</strong> must have been used</span>
              </li>
            </ul>
          </section>

          {/* How to Request a Refund */}
          <section>
            <h2 className="text-2xl font-bold mb-4">How to Request a Refund</h2>
            <ol className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">1.</span>
                <span>Contact our support team via email at <a href="mailto:liyf155@gmail.com" className="text-primary hover:underline">liyf155@gmail.com</a></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">2.</span>
                <span>Provide your order number and reason for the refund request</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">3.</span>
                <span>Our team will review your request and respond within <strong>2-3 business days</strong></span>
              </li>
            </ol>
          </section>

          {/* Processing Time */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Processing Time</h2>
            <p className="text-muted-foreground leading-relaxed">
              Once approved, refunds will be processed within <strong>5-7 business days</strong> and
              credited back to your original payment method.
            </p>
          </section>

          {/* Non-Refundable Items */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Non-Refundable Situations</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Refunds will NOT be issued in the following situations:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>More than 50% of purchased credits have been used</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Refund request is made more than 7 days after purchase</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Account was suspended due to violation of Terms of Service</span>
              </li>
            </ul>
          </section>

          {/* Chargebacks */}
          <section>
            <Card className="p-6 bg-yellow-500/10 border border-yellow-500/20">
              <h2 className="text-xl font-bold mb-3 text-yellow-600 dark:text-yellow-500">Important Notice About Chargebacks</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you initiate a chargeback with your payment provider without first contacting us,
                your account will be immediately suspended. Please contact our support team before
                initiating a chargeback. We are committed to resolving any issues fairly and efficiently.
              </p>
            </Card>
          </section>

          {/* Policy Changes */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Policy Changes</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify this refund policy at any time. Changes will be effective
              immediately upon posting to our website.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <Card className="p-6">
              <p className="text-muted-foreground">
                If you have any questions about this Refund Policy or need to request a refund,
                please contact us at:
              </p>
              <p className="mt-4">
                <a href="mailto:liyf155@gmail.com" className="text-primary hover:underline font-medium">
                  liyf155@gmail.com
                </a>
              </p>
            </Card>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-lg font-bold">
              <span className="text-2xl">🍌</span>
              <span>Nano Banana</span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="/refund" className="text-muted-foreground hover:text-foreground transition-colors">
                Refund Policy
              </a>
              <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </a>
              <a href="mailto:liyf155@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>

            <p className="text-sm text-muted-foreground">
              © 2026 Nano Banana. Transform images with AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
