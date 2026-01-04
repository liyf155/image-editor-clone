import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { image, prompt, model } = await req.json()

    if (!image || !prompt) {
      return NextResponse.json(
        { error: "Image and prompt are required" },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENROUTER_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      )
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": typeof window !== "undefined" ? window.location.href : "",
      },
      body: JSON.stringify({
        model: model || "google/gemini-2.5-flash-image-preview",
        modalities: ["image", "text"],
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()

    const images = data.choices?.[0]?.message?.images
    const messageContent = data.choices?.[0]?.message?.content

    let content = ""
    let imageUrl = null

    if (images && Array.isArray(images) && images.length > 0) {
      const firstImage = images[0]

      if (firstImage?.image_url?.url) {
        imageUrl = firstImage.image_url.url
      } else if (typeof firstImage === 'string') {
        imageUrl = firstImage
      }
    } else if (messageContent) {
      if (Array.isArray(messageContent)) {
        for (const item of messageContent) {
          if (item.type === "text") {
            content += item.text || ""
          } else if (item.type === "image") {
            if (item.source?.type === "url") {
              imageUrl = item.source.url
            }
          }
        }
      } else if (typeof messageContent === "string") {
        content = messageContent
        try {
          const parsed = JSON.parse(messageContent)
          if (parsed.type === "image" && parsed.source?.url) {
            imageUrl = parsed.source.url
          }
        } catch (e) {
          const imageMatch = content.match(/!\[.*?\]\((.*?)\)/)
          if (imageMatch && imageMatch[1]) {
            imageUrl = imageMatch[1]
          }
        }
      }
    }

    return NextResponse.json({
      content,
      imageUrl,
      rawResponse: data
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate image", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
