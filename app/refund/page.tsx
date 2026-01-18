"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Banana decorations on edges */}
      <div className="fixed left-4 top-1/4 text-6xl opacity-10 pointer-events-none">🍌</div>
      <div className="fixed left-4 top-1/3 text-5xl opacity-10 pointer-events-none">🍌</div>
      <div className="fixed left-4 top-1/2 text-6xl opacity-10 pointer-events-none">🍌</div>
      <div className="fixed right-4 top-1/4 text-6xl opacity-10 pointer-events-none">🍌</div>
      <div className="fixed right-4 top-1/3 text-5xl opacity-10 pointer-events-none">🍌</div>
      <div className="fixed right-4 top-1/2 text-6xl opacity-10 pointer-events-none">🍌</div>

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
        <p className="text-muted-foreground mb-8">
          Our refund policy ensures fair treatment for all customers while protecting the integrity of our AI-powered image editing service.
        </p>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-600 dark:text-blue-500">
            <strong>Last modified:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Overview</h2>
            <p>
              Thank you for choosing Nano Banana. We want you to be completely satisfied with our AI-powered image editing service. This Refund Policy outlines the circumstances under which refunds may be issued and the process for requesting a refund.
            </p>
            <p>
              By subscribing to Nano Banana, you acknowledge that you have read, understood, and agree to this Refund Policy.
            </p>
          </section>

          {/* Refund Eligibility */}
          <section>
            <h2 className="text-2xl font-bold mb-4">2. Refund Eligibility</h2>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Time Frame</h3>
            <p>Refund requests must be made within <strong>14 days</strong> of your initial purchase or subscription renewal date. Requests made after this period will not be eligible for a refund.</p>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Usage Limits</h3>
            <p>To be eligible for a refund, your usage must meet the following criteria:</p>
            <ul>
              <li><strong>New Subscribers:</strong> If you have generated fewer than 20 images, you are eligible for a full refund within 14 days</li>
              <li><strong>Existing Subscribers:</strong> Refunds are evaluated on a case-by-case basis for renewal periods</li>
              <li><strong>Technical Issues:</strong> If technical problems prevented you from using the service, you may be eligible for a refund regardless of usage</li>
            </ul>
          </section>

          {/* Non-Refundable Situations */}
          <section>
            <h2 className="text-2xl font-bold mb-4">3. Non-Refundable Situations</h2>
            <p>Refunds will NOT be issued in the following situations:</p>
            <ul>
              <li><strong>Usage Exceeded:</strong> If you have generated 20 or more images during your subscription period</li>
              <li><strong>After 14 Days:</strong> Requests made more than 14 days after purchase or renewal</li>
              <li><strong>Partial Months:</strong> We do not offer prorated refunds for partial months of service</li>
              <li><strong>Change of Mind:</strong> Simply deciding you no longer want to use the service (without technical issues)</li>
              <li><strong>Account Suspension:</strong> If your account was suspended due to violations of our Terms of Service</li>
              <li><strong>Expired Subscriptions:</strong> Subscriptions that have already expired or been cancelled before the refund request</li>
            </ul>

            <Card className="p-4 mt-4 bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-600 dark:text-red-500">
                <strong>Important:</strong> Generated images and AI model usage incur real costs on our end. Once credits are used, we cannot recover those costs, which is why we have these usage limits in place.
              </p>
            </Card>
          </section>

          {/* How to Request a Refund */}
          <section>
            <h2 className="text-2xl font-bold mb-4">4. How to Request a Refund</h2>
            <p>To request a refund, please follow these steps:</p>
            <ol>
              <li><strong>Contact Us:</strong> Send an email to <a href="mailto:liyf155@gmail.com" className="text-primary hover:underline">liyf155@gmail.com</a></li>
              <li><strong>Provide Information:</strong> Include your account email, transaction ID, and reason for the refund request</li>
              <li><strong>Wait for Response:</strong> We will review your request and respond within 3-5 business days</li>
              <li><strong>Processing:</strong> If approved, refunds will be processed within 5-10 business days</li>
            </ol>

            <h3 className="text-xl font-semibold mb-3 mt-6">Required Information</h3>
            <p>Your refund request must include:</p>
            <ul>
              <li>Account email address</li>
              <li>Transaction ID or receipt number</li>
              <li>Date of purchase</li>
              <li>Plan name (Basic, Pro, or Max)</li>
              <li>Detailed reason for refund request</li>
              <li>Description of any technical issues (if applicable)</li>
            </ul>
          </section>

          {/* Refund Process */}
          <section>
            <h2 className="text-2xl font-bold mb-4">5. Refund Process</h2>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Review Period</h3>
            <p>Our team will review your refund request within 3-5 business days. During this time, we may:</p>
            <ul>
              <li>Verify your account details and usage history</li>
              <li>Investigate any reported technical issues</li>
              <li>Contact you for additional information if needed</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Approval and Processing</h3>
            <p>If your refund is approved:</p>
            <ul>
              <li>You will receive a confirmation email with refund details</li>
              <li>The refund will be credited to your original payment method</li>
              <li>Processing time is typically 5-10 business days, depending on your payment provider</li>
              <li>Your account will be downgraded or cancelled accordingly</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.3 Partial Refunds</h3>
            <p>In certain circumstances, we may offer partial refunds:</p>
            <ul>
              <li>If usage slightly exceeds limits but technical issues were significant</li>
              <li>For annual subscribers who request cancellation after using a portion of service</li>
              <li>As a goodwill gesture for service disruptions beyond our control</li>
            </ul>
          </section>

          {/* Subscription Cancellations */}
          <section>
            <h2 className="text-2xl font-bold mb-4">6. Subscription Cancellations</h2>
            <p>You can cancel your subscription at any time. Here's what you need to know:</p>

            <h3 className="text-xl font-semibold mb-3 mt-6">6.1 How to Cancel</h3>
            <ul>
              <li>Log in to your Nano Banana account</li>
              <li>Go to Settings → Subscription</li>
              <li>Click "Cancel Subscription"</li>
              <li>Follow the confirmation steps</li>
            </ul>
            <p className="mt-4">Alternatively, contact support at <a href="mailto:liyf155@gmail.com" className="text-primary hover:underline">liyf155@gmail.com</a> for assistance.</p>

            <h3 className="text-xl font-semibold mb-3 mt-6">6.2 Cancellation Effects</h3>
            <ul>
              <li><strong>Access Until Period End:</strong> You will retain access to all features until the end of your current billing period</li>
              <li><strong>No Automatic Renewal:</strong> You will not be charged for the next billing cycle</li>
              <li><strong>Data Retention:</strong> Your generated images will be retained according to our data retention policy</li>
              <li><strong>Reactivation:</strong> You can reactivate your subscription at any time</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">6.3 No Refund for Cancellation</h3>
            <p>
              Cancelling your subscription does not entitle you to a refund for the current billing period. You will continue to have access to the service until the end of the paid period.
            </p>
          </section>

          {/* Chargebacks */}
          <section>
            <h2 className="text-2xl font-bold mb-4">7. Chargebacks</h2>
            <p>
              If you initiate a chargeback with your payment provider without first contacting us, your account will be immediately suspended. To resolve the situation:
            </p>
            <ul>
              <li>Contact us first to resolve any issues amicably</li>
              <li>We will work with you to find a fair solution</li>
              <li>If you proceed with a chargeback after receiving service, we may dispute it and your account will remain suspended</li>
            </ul>

            <Card className="p-4 mt-4 bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-sm text-yellow-600 dark:text-yellow-500">
                <strong>Recommendation:</strong> Please contact our support team before initiating a chargeback. We are committed to resolving any issues fairly and efficiently.
              </p>
            </Card>
          </section>

          {/* Exceptions */}
          <section>
            <h2 className="text-2xl font-bold mb-4">8. Exceptions</h2>
            <p>We may make exceptions to this policy in the following cases:</p>
            <ul>
              <li><strong>Service Outages:</strong> Extended service interruptions affecting your ability to use features</li>
              <li><strong>Billing Errors:</strong> Duplicate or incorrect charges</li>
              <li><strong>Technical Issues:</strong> Persistent bugs preventing normal use (when reported during the subscription period)</li>
              <li><strong>Special Circumstances:</strong> On a case-by-case basis at our discretion</li>
            </ul>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
            <p>If you have any questions about this Refund Policy or need to request a refund, please contact us:</p>

            <Card className="p-6 mt-4">
              <div className="space-y-2">
                <p><strong>Email:</strong> <a href="mailto:liyf155@gmail.com" className="text-primary hover:underline">liyf155@gmail.com</a></p>
                <p><strong>Website:</strong> <a href="https://imgedtor.online" className="text-primary hover:underline">https://imgedtor.online</a></p>
                <p><strong>Response Time:</strong> We typically respond within 1-2 business days</p>
                <p className="mt-4 text-sm text-muted-foreground">
                  For the fastest response, please include all required information listed in Section 4.
                </p>
              </div>
            </Card>
          </section>

          {/* Policy Changes */}
          <section>
            <h2 className="text-2xl font-bold mb-4">10. Changes to This Policy</h2>
            <p>
              We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting on this page. We will notify active subscribers of any material changes via email.
            </p>
            <p className="mt-4">
              Your continued use of the service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold mb-4">11. Governing Law</h2>
            <p>
              This Refund Policy is governed by and construed in accordance with the laws of the jurisdiction in which our company is established. Any disputes relating to this policy shall be subject to the exclusive jurisdiction of the courts of that jurisdiction.
            </p>
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
