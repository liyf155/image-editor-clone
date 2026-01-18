"use client"

import { Check, ChevronRight, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { AuthButton } from "@/components/auth-button"
import { AuthModal } from "@/components/auth-modal"

export default function PricingPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSubscribe = async (planName: string) => {
    // Check if user is logged in
    if (!user) {
      setShowAuthModal(true)
      return
    }

    setLoadingPlan(planName)

    try {
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planName,
          billingCycle: 'monthly',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Creem checkout
      if (data.checkout_url) {
        window.location.href = data.checkout_url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Subscription error:', error)
      alert(error instanceof Error ? error.message : 'Failed to initiate checkout')
    } finally {
      setLoadingPlan(null)
    }
  }

  const plans = [
    {
      name: "Basic",
      description: "Perfect for individuals and light users",
      price: { monthly: 12, yearly: 144 },
      credits: "1800 credits/year",
      features: [
        "75 high-quality images/month",
        "All style templates included",
        "Standard generation speed",
        "Basic customer support",
        "JPG/PNG format downloads",
        "Commercial Use License",
      ],
      popular: false,
    },
    {
      name: "Pro",
      description: "For professional creators and teams",
      price: { monthly: 19.5, yearly: 234 },
      credits: "9600 credits/year",
      features: [
        "400 high-quality images/month",
        "Support advanced AI models",
        "All style templates included",
        "Priority generation queue",
        "Priority customer support",
        "JPG/PNG/WebP format downloads",
        "Batch generation feature",
        "Image editing tools",
        "Commercial Use License",
      ],
      popular: true,
    },
    {
      name: "Max",
      description: "Designed for large enterprises and professional studios",
      price: { monthly: 80, yearly: 960 },
      credits: "55200 credits/year",
      features: [
        "2300 high-quality images/month",
        "Support advanced AI models",
        "All style templates included",
        "Fastest generation speed",
        "Dedicated account manager",
        "All format downloads",
        "Batch generation feature",
        "Professional editing suite",
        "Commercial Use License",
      ],
      popular: false,
    },
  ]

  const faqs = [
    {
      question: "What are credits and how do they work?",
      answer: "2 credits generate 1 high-quality image. Credits are automatically refilled at the start of each billing cycle - monthly for monthly plans, all at once for yearly plans.",
    },
    {
      question: "Can I change my plan anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.",
    },
    {
      question: "Do unused credits roll over?",
      answer: "Monthly plan credits do not roll over to the next month. Yearly plan credits are valid for the entire subscription period. We recommend choosing a plan based on your actual usage needs.",
    },
    {
      question: "What payment methods are supported?",
      answer: "We support credit cards, debit cards, and various other payment methods through Creem's secure payment platform. All payments are processed securely.",
    },
    {
      question: "Is there a free trial?",
      answer: "Contact our sales team to learn about trial options for enterprise plans. We want to make sure you find the perfect plan for your needs.",
    },
  ]

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
            <a href="/" className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity">
              <span className="text-3xl">🍌</span>
              <span className="text-foreground">Nano Banana</span>
            </a>
            <div className="flex items-center gap-6">
              <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </a>
              <a href="/#editor" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Editor
              </a>
              <a href="/pricing" className="text-sm font-medium text-primary">
                Pricing
              </a>
              <a href="/#showcase" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Showcase
              </a>
              <a href="/#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </a>
              <AuthButton onSignInClick={() => setShowAuthModal(true)} />
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-accent/50 text-accent-foreground px-4 py-2 rounded-full text-sm mb-6 border border-border">
          <span className="text-xl">🍌</span>
          <span>Limited Time: Save 20% with Annual Billing</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">Choose Your Perfect Plan</h1>

        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 text-pretty">
          Unlimited creativity starts here
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`p-8 bg-card border-border relative ${
                plan.popular ? "border-primary shadow-lg scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                <div className="mb-2">
                  <span className="text-4xl font-bold">${plan.price.monthly}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>

                <div className="text-sm text-muted-foreground">
                  ${plan.price.yearly}/year
                  <span className="text-primary font-semibold ml-1">SAVE 20%</span>
                </div>

                <div className="mt-4 text-sm font-medium text-accent-foreground">
                  {plan.credits}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-[#FFC107] text-black hover:bg-[#FFB300] shadow-md"
                    : "bg-[#FFC107] text-black hover:bg-[#FFB300] shadow-md"
                }`}
                variant="default"
                size="lg"
                onClick={() => handleSubscribe(plan.name)}
                disabled={loadingPlan === plan.name}
              >
                {loadingPlan === plan.name ? (
                  "Processing..."
                ) : (
                  <>
                    Get Started
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20 bg-accent/20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about our pricing
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Have more questions?</h2>
        <p className="text-muted-foreground text-lg mb-8">
          We're here to help you find the perfect plan for your needs
        </p>
        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
          Contact Support
        </Button>
      </section>

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

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}

