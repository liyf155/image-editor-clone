import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.user) {
      // Give new users 4 free credits on first sign-in
      const { data: existingCredits } = await supabase
        .from('user_credits')
        .select('balance')
        .eq('user_id', data.user.id)
        .single()

      if (!existingCredits) {
        // User doesn't have credits yet, give them 4 free credits
        const { error: creditError } = await supabase.rpc('add_credits', {
          user_uuid: data.user.id,
          amount: 4,
          trans_type: 'registration_bonus',
          descr: 'Free credits for signing up'
        })

        if (creditError) {
          console.error('Error adding registration credits:', creditError)
        } else {
          console.log('✅ Added 4 free credits to new user:', data.user.id)
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
