import { createClient } from '@/lib/supabase/server'
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

// Helper to create a service role client for admin operations
async function createServiceRoleClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore
          }
        },
      },
    }
  )
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.user) {
      // Give new users 4 free credits on first sign-in
      // Use service role client for admin operations
      const serviceSupabase = await createServiceRoleClient()

      const { data: existingCredits } = await serviceSupabase
        .from('user_credits')
        .select('balance')
        .eq('user_id', data.user.id)
        .single()

      // Grant 4 free credits if user has no credits or balance is 0
      if (!existingCredits || existingCredits.balance === 0) {
        const creditsToGrant = !existingCredits ? 4 : (4 - existingCredits.balance)

        const { error: creditError } = await serviceSupabase.rpc('add_credits', {
          user_uuid: data.user.id,
          amount: creditsToGrant,
          trans_type: 'registration_bonus',
          descr: 'Free credits for signing up'
        })

        if (creditError) {
          console.error('Error adding registration credits:', creditError)
        } else {
          console.log(`✅ Added ${creditsToGrant} free credits to user:`, data.user.id)
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
