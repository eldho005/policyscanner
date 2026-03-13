import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import { getCurrentUser } from '@/lib/supabase-server-auth'
import { logout } from '@/app/login/actions'
import WritersClient from './WritersClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Writers | Admin | PolicyScanner',
  robots: 'noindex, nofollow',
}

export default async function AdminWritersPage() {
  const user = await getCurrentUser()
  if (!user || user.user_metadata?.role !== 'admin') {
    redirect('/login')
  }

  const sb = createServerSupabase()

  // Fetch all auth users and filter writers
  const { data: { users: allUsers } } = await sb.auth.admin.listUsers()
  const writers = allUsers
    .filter(u => u.user_metadata?.role === 'writer')
    .map(u => ({
      id: u.id,
      email: u.email ?? '',
      name: u.user_metadata?.name ?? 'Writer',
      createdAt: u.created_at,
      lastSignIn: u.last_sign_in_at ?? null,
    }))

  // Count assigned pages per writer
  const { data: pageAssignments } = await sb
    .from('seo_pages')
    .select('assigned_to, status')
    .not('assigned_to', 'is', null)

  const assignmentCounts: Record<string, { total: number; done: number }> = {}
  ;(pageAssignments ?? []).forEach(p => {
    if (!p.assigned_to) return
    if (!assignmentCounts[p.assigned_to]) assignmentCounts[p.assigned_to] = { total: 0, done: 0 }
    assignmentCounts[p.assigned_to].total++
    if (p.status === 'done' || p.status === 'published') assignmentCounts[p.assigned_to].done++
  })

  const writersWithCounts = writers.map(w => ({
    ...w,
    assignedPages: assignmentCounts[w.id]?.total ?? 0,
    donePages: assignmentCounts[w.id]?.done ?? 0,
  }))

  return (
    <WritersClient
      writers={writersWithCounts}
      currentUserEmail={user.email ?? ''}
      logoutAction={logout}
    />
  )
}
