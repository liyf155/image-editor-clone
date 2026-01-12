"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">
          Learn how Nano Banana protects your privacy and handles your data. We are committed to keeping your information secure.
        </p>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-8">
          <p className="text-sm text-yellow-600 dark:text-yellow-500">
            <strong>Last modified:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p>
              Thank you for using Nano Banana ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered image editing service. By accessing or using Nano Banana, you agree to this Privacy Policy.
            </p>
            <p>
              Nano Banana is an AI-powered image editing service that allows users to transform images using natural language prompts. We provide access to advanced AI models through our custom interface.
            </p>
            <p>
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access our Service.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold mb-3">2.1 Personal Data</h3>
            <p>We may collect personally identifiable information that can be used to contact or identify you ("Personal Data"), including:</p>
            <ul>
              <li>Email address (for authentication and account management)</li>
              <li>Name and profile information (from Google OAuth)</li>
              <li>Account credentials (stored securely by our authentication provider)</li>
              <li>Payment information (processed securely by Creem)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Usage Data</h3>
            <p>We automatically collect information about your use of our Service:</p>
            <ul>
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Page visit information (pages viewed, time spent, referral source)</li>
              <li>Image generation requests and prompts</li>
              <li>Subscription and payment history</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Cookies and Tracking Technologies</h3>
            <p>We use cookies and similar tracking technologies:</p>
            <ul>
              <li><strong>Session Cookies:</strong> To authenticate you and maintain your session</li>
              <li><strong>Preference Cookies:</strong> To remember your settings and preferences</li>
              <li><strong>Security Cookies:</strong> To enhance security and prevent fraud</li>
              <li><strong>Analytics Cookies:</strong> To understand how you use our Service</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p>We use the collected information for various purposes:</p>
            <ul>
              <li><strong>To provide and maintain our Service:</strong> Process your image generation requests, manage your account, and deliver the features you request</li>
              <li><strong>To process payments:</strong> Handle subscription payments and billing through Creem</li>
              <li><strong>To communicate with you:</strong> Send you updates, security alerts, and support messages</li>
              <li><strong>To improve our Service:</strong> Analyze usage patterns and optimize performance</li>
              <li><strong>To ensure security:</strong> Detect, prevent, and address technical issues and fraudulent activity</li>
              <li><strong>To comply with legal obligations:</strong> Meet regulatory requirements and protect our rights</li>
            </ul>
          </section>

          {/* Data Sharing and Disclosure */}
          <section>
            <h2 className="text-2xl font-bold mb-4">4. Data Sharing and Disclosure</h2>

            <h3 className="text-xl font-semibold mb-3">4.1 Third-Party Service Providers</h3>
            <p>We may share your data with trusted third parties who assist us in operating our Service:</p>

            <Card className="p-4 mt-4 bg-muted/50">
              <ul className="space-y-2">
                <li><strong>Supabase:</strong> Database and authentication services</li>
                <li><strong>Google:</strong> OAuth authentication provider</li>
                <li><strong>Creem:</strong> Payment processing services</li>
                <li><strong>OpenRouter:</strong> AI model API gateway</li>
              </ul>
            </Card>

            <h3 className="text-xl font-semibold mb-3 mt-6">4.2 When We Disclose Information</h3>
            <p>We may disclose your information:</p>
            <ul>
              <li>When required by law or in response to valid legal requests</li>
              <li>To protect our rights, privacy, safety, or property</li>
              <li>In connection with a merger, acquisition, or sale of assets</li>
              <li>With your consent for any other purpose</li>
            </ul>

            <p className="mt-4"><strong>We do not sell your personal data to third parties.</strong></p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
            <p>We implement appropriate security measures to protect your Personal Data:</p>
            <ul>
              <li>HTTPS encryption for all data transmission</li>
              <li>Secure authentication with OAuth 2.0</li>
              <li>Encrypted database storage with Supabase</li>
              <li>PCI-DSS compliant payment processing via Creem</li>
              <li>Regular security assessments and updates</li>
              <li>Employee access controls and training</li>
            </ul>
            <p className="mt-4">
              However, no method of transmission over the Internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold mb-4">6. Data Retention</h2>
            <p>We retain your Personal Data only for as long as necessary for the purposes outlined in this Privacy Policy:</p>
            <ul>
              <li><strong>Account Data:</strong> Retained while your account is active</li>
              <li><strong>Usage Data:</strong> Typically retained for up to 2 years for analytics</li>
              <li><strong>Payment Data:</strong> Retained as required by law and for transaction history</li>
              <li><strong>Generated Images:</strong> Stored according to your subscription plan</li>
            </ul>
            <p className="mt-4">
              Upon account deletion, your Personal Data will be securely deleted within 30 days, except where we are required by law to retain it longer.
            </p>
          </section>

          {/* Your Privacy Rights */}
          <section>
            <h2 className="text-2xl font-bold mb-4">7. Your Privacy Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your Personal Data:</p>

            <h3 className="text-xl font-semibold mb-3 mt-6">7.1 GDPR Rights (EU/EEA)</h3>
            <ul>
              <li><strong>Right to Access:</strong> Request a copy of your Personal Data</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your Personal Data</li>
              <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Right to Withdraw Consent:</strong> Revoke consent at any time</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">7.2 California Privacy Rights (CCPA)</h3>
            <ul>
              <li><strong>Right to Know:</strong> Information about the categories of personal data we collect</li>
              <li><strong>Right to Delete:</strong> Request deletion of your personal information</li>
              <li><strong>Right to Opt-Out:</strong> Opt-out of the sale of personal data (we do not sell data)</li>
            </ul>

            <p className="mt-4">
              To exercise these rights, please contact us at the information provided below.
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-bold mb-4">8. Third-Party Links and Services</h2>
            <p>Our Service may contain links to third-party websites. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party sites you visit.</p>

            <h3 className="text-xl font-semibold mb-3 mt-6">Third-Party Services We Use</h3>
            <Card className="p-4 mt-4 bg-muted/50">
              <ul className="space-y-2">
                <li><strong>Google OAuth:</strong> {"Google's Privacy Policy"} - https://policies.google.com/privacy</li>
                <li><strong>Supabase:</strong> {"Supabase's Privacy Policy"} - https://supabase.com/privacy</li>
                <li><strong>Creem:</strong> {"Creem's Privacy Policy"} - https://creem.io/privacy</li>
                <li><strong>OpenRouter:</strong> {"OpenRouter's Privacy Policy"} - https://openrouter.ai/privacy</li>
              </ul>
            </Card>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold mb-4">9. Children's Privacy</h2>
            <p>Our Service is not intended for children under the age of 16. We do not knowingly collect Personal Data from children under 16. If you are a parent or guardian and believe your child has provided us with Personal Data, please contact us.</p>
          </section>

          {/* International Data Transfers */}
          <section>
            <h2 className="text-2xl font-bold mb-4">10. International Data Transfers</h2>
            <p>Your information may be transferred to and processed in countries other than your country of residence. We ensure that your data is protected in accordance with this Privacy Policy and applicable laws, including using appropriate safeguards such as:</p>
            <ul>
              <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
              <li>Adequacy determinations where applicable</li>
              <li>Other legally accepted mechanisms</li>
            </ul>
          </section>

          {/* Changes to This Policy */}
          <section>
            <h2 className="text-2xl font-bold mb-4">11. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by:</p>
            <ul>
              <li>Posting the new Privacy Policy on this page</li>
              <li>Updating the "Last modified" date</li>
              <li>Sending you an email notification for significant changes</li>
            </ul>
            <p className="mt-4">
              You are advised to review this Privacy Policy periodically. Changes are effective when posted on this page.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>

            <Card className="p-6 mt-4">
              <div className="space-y-2">
                <p><strong>Email:</strong> <a href="mailto:support@nanobanana.com" className="text-primary hover:underline">support@nanobanana.com</a></p>
                <p><strong>Website:</strong> <a href="https://imgedtor.online" className="text-primary hover:underline">https://imgedtor.online</a></p>
                <p className="mt-4 text-sm text-muted-foreground">
                  We will respond to your inquiries within 30 days of receipt.
                </p>
              </div>
            </Card>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold mb-4">13. Governing Law</h2>
            <p>
              This Privacy Policy is governed by and construed in accordance with the laws of the jurisdiction in which our company is established. Any disputes relating to this Privacy Policy shall be subject to the exclusive jurisdiction of the courts of that jurisdiction.
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
              <a href="/refund" className="text-muted-foreground hover:text-foreground transition-colors">
                Refund Policy
              </a>
              <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </a>
              <a href="mailto:support@nanobanana.com" className="text-muted-foreground hover:text-foreground transition-colors">
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
