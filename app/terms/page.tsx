import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity">
              <span className="text-3xl">🍌</span>
              <span className="text-foreground">Nano Banana</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="p-8 md:p-12 bg-card border-border">
          <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 18, 2026</p>

          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Welcome to Nano Banana ("we," "our," or "us"). By accessing or using our AI image generation service,
              you agree to be bound by these Terms of Service ("Terms"). Please read them carefully.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              If you do not agree to these Terms, you may not use our Service.
            </p>
          </section>

          {/* Description of Service */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nano Banana provides an AI-powered image generation and editing service that allows users to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Upload images for AI-powered editing</li>
              <li>Generate new images based on text prompts</li>
              <li>Use credits to pay for image generation</li>
              <li>Access premium features through subscription plans</li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. User Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              As a user of our Service, you agree to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Only upload images you have the right to use</li>
              <li>Not use the Service for any illegal or unauthorized purpose</li>
              <li>Not generate content that violates laws or regulations</li>
              <li>Not attempt to circumvent usage limits or credit systems</li>
              <li>Not use automated tools to abuse the Service</li>
            </ul>
          </section>

          {/* Prohibited Uses */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Prohibited Uses</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You may not use the Service to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Generate violent, hateful, or explicit content</li>
              <li>Create deepfakes or misleading content</li>
              <li>Infringe on intellectual property rights</li>
              <li>Harass, harm, or exploit others</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We reserve the right to terminate accounts that violate these prohibitions.
            </p>
          </section>

          {/* Credits and Payments */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Credits and Payments</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our Service operates on a credit-based system:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Credits are purchased through our payment provider (Creem)</li>
              <li>Nano Banana model: 2 credits per image</li>
              <li>Nano Banana Pro model: 6 credits per image</li>
              <li>Credits are non-refundable except as required by law</li>
              <li>We reserve the right to modify credit pricing</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              For refund requests, please refer to our <Link href="/refund" className="text-primary hover:underline">Refund Policy</Link>.
            </p>
          </section>

          {/* Subscription Plans */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Subscription Plans</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We offer subscription plans with recurring billing:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>You may cancel at any time through your account settings</li>
              <li>Cancellation takes effect at the end of the current billing period</li>
              <li>No partial refunds for unused portions of a billing period</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Regarding intellectual property:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>You retain ownership of images you upload</li>
              <li>You own the generated images (subject to these Terms)</li>
              <li>We do not claim ownership of your content</li>
              <li>You grant us a license to process and store your content</li>
            </ul>
          </section>

          {/* Account Termination */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Account Termination</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We reserve the right to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Suspend or terminate accounts that violate these Terms</li>
              <li>Terminate accounts inactive for more than 12 months</li>
              <li>Refuse service to anyone at our sole discretion</li>
            </ul>
          </section>

          {/* Disclaimers */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Disclaimers</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Uninterrupted or error-free service</li>
              <li>That defects will be corrected</li>
              <li>The accuracy or quality of generated content</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, Nano Banana shall not be liable for any indirect, incidental,
              special, or consequential damages arising from your use of the Service.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may modify these Terms at any time. Changes will be effective immediately upon posting.
              Continued use of the Service constitutes acceptance of the updated Terms.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have questions about these Terms, please contact us:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm"><strong>Email:</strong> <a href="mailto:liyf155@gmail.com" className="text-primary hover:underline">liyf155@gmail.com</a></p>
            </div>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            By using Nano Banana, you acknowledge that you have read and understood these Terms of Service.
          </p>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
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
