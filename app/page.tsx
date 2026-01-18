"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Upload, Sparkles, Zap, Users, ImageIcon, Layers, Download, ArrowRight, Bug, PenTool, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AuthButton } from "@/components/auth-button"
import { AuthModal } from "@/components/auth-modal"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

// Credit costs per model
const MODEL_CREDITS: Record<string, number> = {
  "google/gemini-2.5-flash-image": 2,  // Nano Banana
  "google/gemini-3-pro-image-preview": 6,  // Nano Banana Pro
}

function getCreditsForModel(model: string): number {
  return MODEL_CREDITS[model] || 2  // Default to 2 credits
}

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [hasSubscription, setHasSubscription] = useState(false)
  const [credits, setCredits] = useState(0)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedModel, setSelectedModel] = useState("google/gemini-2.5-flash-image")
  const [rawApiResponse, setRawApiResponse] = useState<any>(null)
  const [showDebug, setShowDebug] = useState(false)
  const [showAccessModal, setShowAccessModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const supabase = createClient()

  // Calculate required credits based on selected model
  const requiredCredits = useMemo(() => getCreditsForModel(selectedModel), [selectedModel])

  useEffect(() => {
    // Check user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        // Check subscription status
        checkSubscription(session.user.id)
        // Check credits
        fetchCredits(session.user.id)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        checkSubscription(session.user.id)
        fetchCredits(session.user.id)
      } else {
        setHasSubscription(false)
        setCredits(0)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const checkSubscription = async (userId: string) => {
    try {
      const response = await fetch(`/api/payment/check-subscription?user_id=${userId}`)
      const data = await response.json()
      setHasSubscription(data.hasSubscription || false)
    } catch (error) {
      console.error('Error checking subscription:', error)
      setHasSubscription(false)
    }
  }

  const fetchCredits = async (userId: string) => {
    try {
      const response = await fetch('/api/credits')
      const data = await response.json()
      setCredits(data.balance || 0)
    } catch (error) {
      console.error('Error fetching credits:', error)
      setCredits(0)
    }
  }

  const handleDownloadImage = () => {
    if (!generatedImageUrl) return

    const link = document.createElement('a')
    link.href = generatedImageUrl
    link.download = `nano-banana-generated-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!uploadedImage || !prompt) {
      return
    }

    // Check if user is authenticated
    if (!user) {
      setShowAccessModal(true)
      return
    }

    // Check if user has enough credits
    if (credits < requiredCredits) {
      alert(`You need at least ${requiredCredits} credits to generate an image. Please subscribe to get more credits.`)
      setShowAccessModal(true)
      return
    }

    setIsGenerating(true)
    setGeneratedContent("")
    setGeneratedImageUrl(null)
    setRawApiResponse(null)

    const enhancedPrompt = prompt

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image: uploadedImage,
          prompt: enhancedPrompt,
          model: selectedModel,
          userId: user.id
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || `Failed to generate (${response.status})`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setRawApiResponse(data.rawResponse)

      const content = data.content || ""
      const imageUrl = data.imageUrl || null

      setGeneratedContent(content)

      if (imageUrl && typeof imageUrl === 'string') {
        setGeneratedImageUrl(imageUrl)
      }

      // Update credits balance
      if (data.remainingCredits !== undefined) {
        setCredits(data.remainingCredits)
      }
    } catch (error) {
      console.error("Error generating:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setGeneratedContent(`Error: ${errorMessage}`)
      setGeneratedImageUrl(null)

      // Refresh credits on error in case they were refunded
      if (user) {
        fetchCredits(user.id)
      }
    } finally {
      setIsGenerating(false)
    }
  }

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
              <a href="#editor" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Editor
              </a>
              <a href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="#showcase" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Showcase
              </a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </a>
              {user && (
                <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  <span className="text-xl">🍌</span>
                  <span>{credits} Credits</span>
                </div>
              )}
              <AuthButton onSignInClick={() => setShowAuthModal(true)} />
            </div>
          </nav>
        </div>
      </header>

      {/* Announcement Banner */}
      <div className="bg-primary/10 border-b border-primary/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="text-xl">🍌</span>
            <span className="font-medium text-foreground">Nano Banana Pro is now live</span>
            <a
              href="/pricing"
              className="text-primary hover:underline font-medium inline-flex items-center gap-1"
            >
              Try it now
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section with Gradient Background */}
      <section className="relative hero-gradient min-h-[600px] flex items-center justify-center">
        <div className="geometric-pattern"></div>
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white text-balance">
            Transform Your Images with <span className="text-primary">AI-Powered Editing</span>
          </h1>

          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 text-pretty">
            Experience the future of image editing with Nano Banana's advanced AI technology. Edit photos using natural language and achieve stunning results in seconds.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 btn-primary-orange rounded-full px-8"
              asChild
            >
              <a href="#editor">Get Started</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 backdrop-blur-sm rounded-full px-8"
              asChild
            >
              <a href="#showcase">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
                View Examples
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Image Editor Section */}
      <section id="editor" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Try The <span className="text-primary">AI Editor</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-4">
            Experience the power of Nano Banana's natural language image editing
          </p>
          {user && (
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <span className="text-xl">🍌</span>
              <span>{credits} Credits Available • 2 Credits per Image</span>
            </div>
          )}
        </div>

        <Card className="p-8 max-w-5xl mx-auto bg-card border-border shadow-lg">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Upload Image</h3>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer bg-accent/20">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {uploadedImage ? (
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Uploaded"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <Upload className="w-12 h-12 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Click to upload image</p>
                        <p className="text-sm text-muted-foreground mt-1">Max 10MB</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              <div className="mt-6">
                <label className="text-sm font-medium mb-2 block">AI Model Selection</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="google/gemini-2.5-flash-image">Nano Banana</option>
                  <option value="google/gemini-3-pro-image-preview">Nano Banana Pro</option>
                </select>
              </div>
            </div>

            {/* Prompt Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Transform Image</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Enter Your Prompt</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe how you want to transform the image..."
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground min-h-32 resize-none"
                  />
                </div>

                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 btn-primary-orange"
                  size="lg"
                  onClick={handleGenerate}
                  disabled={!uploadedImage || !prompt || isGenerating}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGenerating ? "Generating..." : `Generate Now (${requiredCredits} Credit${requiredCredits > 1 ? 's' : ''})`}
                </Button>

                {/* Debug Panel */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDebug(!showDebug)}
                  className="w-full"
                >
                  <Bug className="w-4 h-4 mr-2" />
                  {showDebug ? "Hide Debug Info" : "Show Debug Info"}
                </Button>

                {showDebug && rawApiResponse && (
                  <div className="bg-black/50 border border-border rounded-lg p-4">
                    <div className="text-xs text-green-400 font-mono mb-2">Raw API Response:</div>
                    <pre className="text-xs text-green-300 font-mono overflow-x-auto max-h-60 overflow-y-auto">
                      {JSON.stringify(rawApiResponse, null, 2)}
                    </pre>
                  </div>
                )}

                <div className="bg-accent/30 border border-border rounded-lg p-6">
                  {generatedImageUrl ? (
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-2 text-sm text-primary">
                        <Sparkles className="w-4 h-4" />
                        <span>Image generated successfully! See comparison below.</span>
                      </div>
                      {generatedContent && (
                        <div className="text-sm text-foreground whitespace-pre-wrap max-h-40 overflow-y-auto bg-background p-2 rounded">
                          {generatedContent}
                        </div>
                      )}
                    </div>
                  ) : generatedContent ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-primary font-medium">
                        <Sparkles className="w-4 h-4" />
                        <span>AI Response</span>
                      </div>
                      <div className="text-sm text-foreground whitespace-pre-wrap max-h-40 overflow-y-auto bg-background p-2 rounded">
                        {generatedContent}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Generated images will appear below in the comparison section</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Image Comparison Section */}
        {generatedImageUrl && uploadedImage && (
          <Card className="p-8 max-w-5xl mx-auto mt-8 bg-card border-border shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-center">Image Comparison</h3>
              <Button onClick={handleDownloadImage} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Original Image</div>
                <img
                  src={uploadedImage}
                  alt="Original"
                  className="w-full rounded-lg border border-border"
                />
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-primary">Generated Image</div>
                <img
                  src={generatedImageUrl}
                  alt="Generated by AI"
                  className="w-full rounded-lg border border-border"
                />
              </div>
            </div>
          </Card>
        )}
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Why Choose <span className="text-primary">Nano Banana</span>?
          </h2>
          <p className="text-muted-foreground text-lg">Powerful features for AI-powered image editing</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="p-6 bg-card border-border card-hover">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Natural Language Editing</h3>
            <p className="text-muted-foreground text-sm">
              Edit images using simple text prompts. Nano Banana AI understands complex instructions like GPT for images
            </p>
          </Card>

          <Card className="p-6 bg-card border-border card-hover">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Character Consistency</h3>
            <p className="text-muted-foreground text-sm">
              Maintain perfect character details across edits. This model excels at preserving faces and identities
            </p>
          </Card>

          <Card className="p-6 bg-card border-border card-hover">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Layers className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Scene Preservation</h3>
            <p className="text-muted-foreground text-sm">
              Seamlessly blend edits with original backgrounds. Superior scene fusion compared to competitors
            </p>
          </Card>

          <Card className="p-6 bg-card border-border card-hover">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">One-Shot Editing</h3>
            <p className="text-muted-foreground text-sm">
              Perfect results in a single attempt. Nano Banana solves one-shot image editing challenges effortlessly
            </p>
          </Card>

          <Card className="p-6 bg-card border-border card-hover">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <ImageIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multi-Image Context</h3>
            <p className="text-muted-foreground text-sm">
              Process multiple images simultaneously. Support for advanced multi-image editing workflows
            </p>
          </Card>

          <Card className="p-6 bg-card border-border card-hover">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-2xl">🍌</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI UGC Creation</h3>
            <p className="text-muted-foreground text-sm">
              Create consistent AI influencers and UGC content. Perfect for social media and marketing campaigns
            </p>
          </Card>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="container mx-auto px-4 py-20 bg-accent/20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Lightning-Fast <span className="text-primary">AI Creations</span>
          </h2>
          <p className="text-muted-foreground text-lg">See what Nano Banana generates in milliseconds</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="overflow-hidden bg-card border-border card-hover">
            <img src="/dramatic-mountain-landscape.png" alt="AI Generated Mountain" className="w-full h-64 object-cover" />
            <div className="p-6">
              <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-3">
                ⚡ Nano Banana Speed
              </div>
              <h3 className="text-xl font-semibold mb-2">Ultra-Fast Mountain Generation</h3>
              <p className="text-sm text-muted-foreground">
                Created in 0.8 seconds with Nano Banana's optimized neural engine
              </p>
            </div>
          </Card>

          <Card className="overflow-hidden bg-card border-border card-hover">
            <img src="/beautiful-garden-with-flowers.jpg" alt="AI Generated Garden" className="w-full h-64 object-cover" />
            <div className="p-6">
              <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-3">
                ⚡ Nano Banana Speed
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Garden Creation</h3>
              <p className="text-sm text-muted-foreground">
                Complex scene rendered in milliseconds using Nano Banana technology
              </p>
            </div>
          </Card>

          <Card className="overflow-hidden bg-card border-border card-hover">
            <img src="/tropical-beach-sunset.png" alt="AI Generated Beach" className="w-full h-64 object-cover" />
            <div className="p-6">
              <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-3">
                ⚡ Nano Banana Speed
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Beach Synthesis</h3>
              <p className="text-sm text-muted-foreground">
                Nano Banana delivers photorealistic results at lightning speed
              </p>
            </div>
          </Card>

          <Card className="overflow-hidden bg-card border-border card-hover">
            <img src="/images/northern-lights.png" alt="AI Generated Aurora" className="w-full h-64 object-cover" />
            <div className="p-6">
              <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-3">
                ⚡ Nano Banana Speed
              </div>
              <h3 className="text-xl font-semibold mb-2">Rapid Aurora Generation</h3>
              <p className="text-sm text-muted-foreground">Advanced effects processed instantly with Nano Banana AI</p>
            </div>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="btn-secondary-outline rounded-full px-8">
            Try Nano Banana Generator
          </Button>
        </div>
      </section>


      {/* FAQ Section */}
      <section id="faq" className="container mx-auto px-4 py-20 bg-accent/20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-muted-foreground text-lg">Everything you need to know</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                What is Nano Banana?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                It's a revolutionary AI image editing model that transforms photos using natural language prompts. This is currently the most powerful image editing model available, with exceptional consistency. It offers superior performance compared to other models for consistent character editing and scene preservation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                How does it work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Simply upload an image and describe your desired edits in natural language. The AI understands complex instructions like "place the creature in a snowy mountain" or "imagine the whole face and create it". It processes your text prompt and generates perfectly edited images.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                How is it better than competitors?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                This model excels in character consistency, scene blending, and one-shot editing. Users report it outperforms competitors in preserving facial features and seamlessly integrating edits with backgrounds. It also supports multi-image context, making it ideal for creating consistent AI influencers.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Can I use it for commercial projects?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! It's perfect for creating AI UGC content, social media campaigns, and marketing materials. Many users leverage it for creating consistent AI influencers and product photography. The high-quality outputs are suitable for professional use.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                What types of edits can it handle?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                The editor handles complex edits including face completion, background changes, object placement, style transfers, and character modifications. It excels at understanding contextual instructions like "place in a blizzard" or "create the whole face" while maintaining photorealistic quality.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
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
              <a href="/refund" className="text-muted-foreground hover:text-foreground transition-colors">
                Refund Policy
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

      {/* Access Restriction Modal */}
      {showAccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 relative animate-in fade-in-0 zoom-in-95 duration-200">
            <button
              onClick={() => setShowAccessModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold mb-3">Unlock AI Image Generation</h3>

              <p className="text-muted-foreground mb-6">
                {!user
                  ? "Sign in to access Nano Banana's powerful AI image editing capabilities and transform your photos with natural language."
                  : "Upgrade to a subscription plan to start generating stunning AI-edited images with our advanced technology."}
              </p>

              <div className="flex items-center justify-center gap-4 flex-wrap">
                {!user ? (
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8"
                    onClick={async () => {
                      setShowAccessModal(false)
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
                    }}
                  >
                    Sign In with Google
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8"
                    onClick={() => {
                      setShowAccessModal(false)
                      router.push('/pricing')
                    }}
                  >
                    View Pricing Plans
                  </Button>
                )}

                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8"
                  onClick={() => {
                    setShowAccessModal(false)
                    router.push('/pricing')
                  }}
                >
                  {!user ? 'View Pricing' : 'Learn More'}
                </Button>
              </div>

              {!user && (
                <p className="text-xs text-muted-foreground mt-6">
                  Start with a free account • No credit card required for signup
                </p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
