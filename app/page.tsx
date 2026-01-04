"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Sparkles, Zap, Users, ImageIcon, Layers, Bug, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HomePage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedModel, setSelectedModel] = useState("google/gemini-2.5-flash-image")
  const [rawApiResponse, setRawApiResponse] = useState<any>(null)
  const [showDebug, setShowDebug] = useState(false)

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

    setIsGenerating(true)
    setGeneratedContent("")
    setGeneratedImageUrl(null)
    setRawApiResponse(null)

    // Use user's prompt directly - the model will generate an image based on the input
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
          model: selectedModel
        })
      })

      if (!response.ok) {
        throw new Error("Failed to generate")
      }

      const data = await response.json()

      // Save raw response for debugging
      setRawApiResponse(data.rawResponse)

      const content = data.content || ""
      const imageUrl = data.imageUrl || null

      setGeneratedContent(content)

      // Use the image URL directly from backend
      if (imageUrl && typeof imageUrl === 'string') {
        setGeneratedImageUrl(imageUrl)
      }
    } catch (error) {
      setGeneratedContent("Error: Failed to generate response. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Banana decorations */}
      <div className="fixed top-10 right-10 text-6xl opacity-20 pointer-events-none animate-float">🍌</div>
      <div className="fixed top-40 left-20 text-4xl opacity-15 pointer-events-none animate-float-delayed">🍌</div>
      <div className="fixed bottom-20 right-32 text-5xl opacity-10 pointer-events-none animate-float">🍌</div>

      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xl font-bold">
              <span className="text-3xl">🍌</span>
              <span className="text-foreground">Nano Banana</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#editor" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Editor
              </a>
              <a href="#showcase" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Showcase
              </a>
              <a href="#reviews" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Reviews
              </a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </a>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Try Now
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-accent/50 text-accent-foreground px-4 py-2 rounded-full text-sm mb-6 border border-border">
          <span className="text-xl">🍌</span>
          <span>The AI model that outperforms competitors</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">Nano Banana</h1>

        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 text-pretty">
          Transform any image with simple text prompts. Nano Banana's advanced model delivers consistent character
          editing and scene preservation. Experience the future of AI image editing.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <span className="mr-2">Start Editing</span>
            <span>🍌</span>
          </Button>
          <Button size="lg" variant="outline">
            View Examples
          </Button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground flex-wrap">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span>One-shot editing</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <span>Multi-image support</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Natural language</span>
          </div>
        </div>
      </section>

      {/* Image Editor Section */}
      <section id="editor" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Try The AI Editor</h2>
          <p className="text-muted-foreground text-lg">
            Experience the power of Nano Banana's natural language image editing
          </p>
        </div>

        <Card className="p-8 max-w-5xl mx-auto bg-card border-border">
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
                  <option value="google/gemini-2.5-flash-image-preview">Gemini 2.5 Flash Image (Preview)</option>
                  <option value="google/gemini-3-pro-image-preview">Gemini 3 Pro Image (Preview)</option>
                  <option value="google/gemini-2.5-flash-image">Gemini 2.5 Flash Image</option>
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
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                  onClick={handleGenerate}
                  disabled={!uploadedImage || !prompt || isGenerating}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGenerating ? "Generating..." : "Generate Now"}
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
          <Card className="p-8 max-w-5xl mx-auto mt-8 bg-card border-border">
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
          <h2 className="text-4xl font-bold mb-4">Core Features</h2>
          <p className="text-muted-foreground text-lg">Why Choose Nano Banana?</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="p-6 bg-card border-border hover:border-primary transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Natural Language Editing</h3>
            <p className="text-muted-foreground text-sm">
              Edit images using simple text prompts. Nano Banana AI understands complex instructions like GPT for images
            </p>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Character Consistency</h3>
            <p className="text-muted-foreground text-sm">
              Maintain perfect character details across edits. This model excels at preserving faces and identities
            </p>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Layers className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Scene Preservation</h3>
            <p className="text-muted-foreground text-sm">
              Seamlessly blend edits with original backgrounds. Superior scene fusion compared to competitors
            </p>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">One-Shot Editing</h3>
            <p className="text-muted-foreground text-sm">
              Perfect results in a single attempt. Nano Banana solves one-shot image editing challenges effortlessly
            </p>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <ImageIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multi-Image Context</h3>
            <p className="text-muted-foreground text-sm">
              Process multiple images simultaneously. Support for advanced multi-image editing workflows
            </p>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary transition-colors">
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
          <h2 className="text-4xl font-bold mb-4">Showcase</h2>
          <p className="text-muted-foreground text-lg">Lightning-Fast AI Creations</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="overflow-hidden bg-card border-border">
            <img src="/dramatic-mountain-landscape.png" alt="AI Generated Mountain" className="w-full h-64 object-cover" />
            <div className="p-6">
              <div className="text-sm text-primary font-medium mb-2">Nano Banana Speed</div>
              <h3 className="text-xl font-semibold mb-2">Ultra-Fast Mountain Generation</h3>
              <p className="text-sm text-muted-foreground">
                Created in 0.8 seconds with Nano Banana's optimized neural engine
              </p>
            </div>
          </Card>

          <Card className="overflow-hidden bg-card border-border">
            <img src="/beautiful-garden-with-flowers.jpg" alt="AI Generated Garden" className="w-full h-64 object-cover" />
            <div className="p-6">
              <div className="text-sm text-primary font-medium mb-2">Nano Banana Speed</div>
              <h3 className="text-xl font-semibold mb-2">Instant Garden Creation</h3>
              <p className="text-sm text-muted-foreground">
                Complex scene rendered in milliseconds using Nano Banana technology
              </p>
            </div>
          </Card>

          <Card className="overflow-hidden bg-card border-border">
            <img src="/tropical-beach-sunset.png" alt="AI Generated Beach" className="w-full h-64 object-cover" />
            <div className="p-6">
              <div className="text-sm text-primary font-medium mb-2">Nano Banana Speed</div>
              <h3 className="text-xl font-semibold mb-2">Real-time Beach Synthesis</h3>
              <p className="text-sm text-muted-foreground">
                Nano Banana delivers photorealistic results at lightning speed
              </p>
            </div>
          </Card>

          <Card className="overflow-hidden bg-card border-border">
            <img src="/images/northern-lights.png" alt="AI Generated Aurora" className="w-full h-64 object-cover" />
            <div className="p-6">
              <div className="text-sm text-primary font-medium mb-2">Nano Banana Speed</div>
              <h3 className="text-xl font-semibold mb-2">Rapid Aurora Generation</h3>
              <p className="text-sm text-muted-foreground">Advanced effects processed instantly with Nano Banana AI</p>
            </div>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            Try Nano Banana Generator
          </Button>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">User Reviews</h2>
          <p className="text-muted-foreground text-lg">What creators are saying</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">👨‍🎨</div>
              <div>
                <div className="font-semibold">AIArtistPro</div>
                <div className="text-sm text-muted-foreground">Digital Creator</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              "This editor completely changed my workflow. The character consistency is incredible - miles ahead of
              competitors!"
            </p>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">👩‍💼</div>
              <div>
                <div className="font-semibold">ContentCreator</div>
                <div className="text-sm text-muted-foreground">UGC Specialist</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              "Creating consistent AI influencers has never been easier. It maintains perfect face details across
              edits!"
            </p>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">📸</div>
              <div>
                <div className="font-semibold">PhotoEditor</div>
                <div className="text-sm text-muted-foreground">Professional Editor</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              "One-shot editing is basically solved with this tool. The scene blending is so natural and realistic!"
            </p>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto px-4 py-20 bg-accent/20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">FAQs</h2>
          <p className="text-muted-foreground text-lg">Frequently Asked Questions</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                What is Nano Banana?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                It's a revolutionary AI image editing model that transforms photos using natural language prompts. This
                is currently the most powerful image editing model available, with exceptional consistency. It offers
                superior performance for consistent character editing and scene preservation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                How does it work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Simply upload an image and describe your desired edits in natural language. The AI understands complex
                instructions like &quot;place the creature in a snowy mountain&quot; or &quot;imagine the whole face and create it&quot;. It
                processes your text prompt and generates perfectly edited images.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                How is it better than competitors?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                This model excels in character consistency, scene blending, and one-shot editing. Users report it
                outperforms competitors in preserving facial features and seamlessly integrating edits with backgrounds.
                It also supports multi-image context, making it ideal for creating consistent AI influencers.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Can I use it for commercial projects?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! It's perfect for creating AI UGC content, social media campaigns, and marketing materials. Many
                users leverage it for creating consistent AI influencers and product photography. The high-quality
                outputs are suitable for professional use.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                What types of edits can it handle?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                The editor handles complex edits including face completion, background changes, object placement, style
                transfers, and character modifications. It excels at understanding contextual instructions like &quot;place
                in a blizzard&quot; or &quot;create the whole face&quot; while maintaining photorealistic quality.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-lg font-bold">
              <span className="text-2xl">🍌</span>
              <span>Nano Banana</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 Nano Banana. Transform images with AI.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
