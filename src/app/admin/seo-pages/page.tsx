import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import { getCurrentUser } from '@/lib/supabase-server-auth'
import { logout } from '@/app/login/actions'
import SeoPagesClient from './SeoPagesClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'SEO Pages | Admin | PolicyScanner',
  robots: 'noindex, nofollow',
}

export interface DbPage {
  id: number
  slug: string
  title: string
  url: string
  target_words: string
  week: number
  level: number
  type: string
  keyword: string
  seed_file: string
  assigned_to: string | null
  status: 'not_started' | 'in_progress' | 'done' | 'published'
  admin_notes: string | null
  sanity_pushed: boolean
}

export interface WriterUser {
  id: string
  email: string
  name: string
}

export default async function AdminSeoPagesPage() {
  // Auth disabled for preview — remove these lines to re-enable login
  // const user = await getCurrentUser()
  // if (!user || user.user_metadata?.role !== 'admin') {
  //   redirect('/login')
  // }

  const sb = createServerSupabase()

  // Fetch DB pages (may be empty if not seeded yet)
  const { data: dbPages } = await sb
    .from('seo_pages')
    .select('*')
    .order('week', { ascending: true })

  return (
    <SeoPagesClient
      initialPages={(dbPages ?? []) as DbPage[]}
      currentUserEmail="admin@example.local"
      logoutAction={logout}
    />
  )
}
