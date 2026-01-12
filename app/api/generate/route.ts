import { NextRequest, NextResponse } from "next/server"
import { createClient } from '@/lib/supabase/server'

const CREDITS_PER_IMAGE = 2

export async function POST(req: NextRequest) {
  try {
    const { image, prompt, model, userId } = await req.json()

    if (!image || !prompt) {
      return NextResponse.json(
        { error: "Image and prompt are required" },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required. Please sign in." },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Check if user has enough credits
    const { data: currentBalance, error: balanceError } = await supabase.rpc('get_credit_balance', {
      user_uuid: userId
    })

    if (balanceError) {
      console.error('Error checking credit balance:', balanceError)
      return NextResponse.json(
        { error: "Failed to check credit balance" },
        { status: 500 }
      )
    }

    if ((currentBalance || 0) < CREDITS_PER_IMAGE) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          details: `You need ${CREDITS_PER_IMAGE} credits to generate an image. Current balance: ${currentBalance || 0}`
        },
        { status: 402 }
      )
    }

    // Deduct credits
    const { error: deductError } = await supabase.rpc('add_credits', {
      user_uuid: userId,
      amount: -CREDITS_PER_IMAGE,
      trans_type: 'image_generation',
      descr: `Generated image with prompt: ${prompt.substring(0, 50)}...`
    })

    if (deductError) {
      console.error('Error deducting credits:', deductError)
      return NextResponse.json(
        { error: "Failed to deduct credits" },
        { status: 500 }
      )
    }

    console.log(`✅ Deducted ${CREDITS_PER_IMAGE} credits from user:`, userId)

    // Call OpenRouter API
    const apiKey = process.env.OPENROUTER_API_KEY

    if (!apiKey) {
      // Refund credits if API key is missing
      await supabase.rpc('add_credits', {
        user_uuid: userId,
        amount: CREDITS_PER_IMAGE,
        trans_type: 'refund',
        descr: 'Refund: API key not configured'
      })

      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      )
    }

    let response
    try {
      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
    } catch (fetchError) {
      // Refund credits on network error
      await supabase.rpc('add_credits', {
        user_uuid: userId,
        amount: CREDITS_PER_IMAGE,
        trans_type: 'refund',
        descr: 'Refund: Network error'
      })
      throw fetchError
    }

    if (!response.ok) {
      // Refund credits on API error
      await supabase.rpc('add_credits', {
        user_uuid: userId,
        amount: CREDITS_PER_IMAGE,
        trans_type: 'refund',
        descr: `Refund: API error ${response.status}`
      })

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

    // Get new balance after deduction
    const { data: newBalance } = await supabase.rpc('get_credit_balance', {
      user_uuid: userId
    })

    return NextResponse.json({
      content,
      imageUrl,
      rawResponse: data,
      creditsUsed: CREDITS_PER_IMAGE,
      remainingCredits: newBalance || 0
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate image", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
