import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Login disabled for preview — restore auth checks below to re-enable

  // Allow all access for now
  return NextResponse.next()

  /* Restore full auth for production:
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — must call getUser() not getSession()
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const role = user?.user_metadata?.role as string | undefined

  // ── /admin/* — require admin role ─────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (role !== 'admin') {
      // Logged-in writer tried to access admin → send to their dashboard
      return NextResponse.redirect(new URL('/writer', request.url))
    }
  }

  // ── /writer/* — require any login ─────────────────────────────────────────
  if (pathname.startsWith('/writer')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // ── /login — already logged in, redirect to correct dashboard ─────────────
  if (pathname === '/login' && user) {
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin/seo-pages', request.url))
    }
    return NextResponse.redirect(new URL('/writer', request.url))
  }

  return supabaseResponse
  */
}

export const config = {
  matcher: ['/admin/:path*', '/writer/:path*', '/login'],
}
