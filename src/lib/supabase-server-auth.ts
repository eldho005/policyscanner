import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Auth-aware Supabase client for Server Components and Server Actions.
 * Reads/writes session cookies so auth state persists across requests.
 */
export async function createAuthServerClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
            // Called from a Server Component — cookies are read-only.
            // The middleware will handle refreshing the session.
          }
        },
      },
    }
  )
}

/**
 * Get the current logged-in user (safe — uses getUser() not getSession()).
 * Returns null if not logged in.
 */
export async function getCurrentUser() {
  const supabase = await createAuthServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Get the current user's role from their metadata.
 */
export async function getCurrentRole(): Promise<'admin' | 'writer' | null> {
  const user = await getCurrentUser()
  if (!user) return null
  return (user.user_metadata?.role as 'admin' | 'writer') ?? 'writer'
}
