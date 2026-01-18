import { NextRequest, NextResponse } from "next/server"
import { createClient, createServiceRoleClient } from '@/lib/supabase/server'

// Credit costs per model
const MODEL_CREDITS: Record<string, number> = {
  "google/gemini-2.5-flash-image": 2,  // Nano Banana
  "google/gemini-3-pro-image-preview": 6,  // Nano Banana Pro
}

function getCreditsForModel(model: string): number {
  return MODEL_CREDITS[model] || 2  // Default to 2 credits
}

export async function POST(req: NextRequest) {
  try {
    const { image, prompt, model, userId } = await req.json()

    console.log('[DEBUG] Request received:', { hasImage: !!image, prompt, model, userId })

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

    // Get credit cost for the selected model
    const creditsRequired = getCreditsForModel(model || "google/gemini-2.5-flash-image")
    console.log('[DEBUG] Credits required:', creditsRequired, 'for model:', model)

    // Use service role client for credit operations
    const supabaseAdmin = createServiceRoleClient()
    console.log('[DEBUG] Service role client created')

    // Check if user has enough credits
    const { data: currentBalance, error: balanceError } = await supabaseAdmin.rpc('get_credit_balance', {
      user_uuid: userId
    })

    console.log('[DEBUG] Balance check:', { currentBalance, balanceError })

    if (balanceError) {
      console.error('[ERROR] Error checking credit balance:', balanceError)
      return NextResponse.json(
        { error: "Failed to check credit balance", details: balanceError.message },
        { status: 500 }
      )
    }

    if ((currentBalance || 0) < creditsRequired) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          details: `You need ${creditsRequired} credits to generate an image. Current balance: ${currentBalance || 0}`
        },
        { status: 402 }
      )
    }

    // Deduct credits
    console.log('[DEBUG] Deducting credits...')
    const { error: deductError } = await supabaseAdmin.rpc('add_credits', {
      user_uuid: userId,
      amount: -creditsRequired,
      trans_type: 'image_generation',
      descr: `Generated image with prompt: ${prompt.substring(0, 50)}...`
    })

    if (deductError) {
      console.error('[ERROR] Error deducting credits:', deductError)
      return NextResponse.json(
        { error: "Failed to deduct credits", details: deductError.message },
        { status: 500 }
      )
    }

    console.log(`✅ Deducted ${creditsRequired} credits from user:`, userId)

    // Call OpenRouter API
    const apiKey = process.env.OPENROUTER_API_KEY
    console.log('[DEBUG] API key exists:', !!apiKey)

    if (!apiKey) {
      // Refund credits if API key is missing
      await supabaseAdmin.rpc('add_credits', {
        user_uuid: userId,
        amount: creditsRequired,
        trans_type: 'refund',
        descr: 'Refund: API key not configured'
      })

      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      )
    }

    let response
    console.log('[DEBUG] Calling OpenRouter API...')
    try {
      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://nano.banana",
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
      console.log('[DEBUG] OpenRouter response status:', response.status)
    } catch (fetchError) {
      console.error('[ERROR] Fetch error:', fetchError)
      // Refund credits on network error
      await supabaseAdmin.rpc('add_credits', {
        user_uuid: userId,
        amount: creditsRequired,
        trans_type: 'refund',
        descr: 'Refund: Network error'
      })
      throw fetchError
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[ERROR] OpenRouter API error:', response.status, errorText)
      // Refund credits on API error
      await supabaseAdmin.rpc('add_credits', {
        user_uuid: userId,
        amount: creditsRequired,
        trans_type: 'refund',
        descr: `Refund: API error ${response.status}`
      })

      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('[DEBUG] OpenRouter response data keys:', Object.keys(data))

    const images = data.choices?.[0]?.message?.images
    const messageContent = data.choices?.[0]?.message?.content

    console.log('[DEBUG] Images:', images)
    console.log('[DEBUG] Message content type:', typeof messageContent)

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

    console.log('[DEBUG] Final imageUrl:', imageUrl)
    console.log('[DEBUG] Final content length:', content.length)

    // Get new balance after deduction
    const { data: newBalance } = await supabaseAdmin.rpc('get_credit_balance', {
      user_uuid: userId
    })

    return NextResponse.json({
      content,
      imageUrl,
      rawResponse: data,
      creditsUsed: creditsRequired,
      remainingCredits: newBalance || 0
    })
  } catch (error) {
    console.error('[ERROR] Uncaught error:', error)
    return NextResponse.json(
      { error: "Failed to generate image", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
