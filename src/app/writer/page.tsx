import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import { getCurrentUser } from '@/lib/supabase-server-auth'
import { logout } from '@/app/login/actions'

export const dynamic = 'force-dynamic'

const STATUS_STYLES: Record<string, { bg: string; color: string; dot: string; label: string }> = {
  not_started: { bg: '#f3f4f6', color: '#374151', dot: '#9ca3af', label: 'Not started' },
  in_progress: { bg: '#fefce8', color: '#854d0e', dot: '#eab308', label: 'In progress' },
  done:        { bg: '#eff6ff', color: '#1d4ed8', dot: '#3b82f6', label: 'Done ✓' },
  published:   { bg: '#f0fdf4', color: '#166534', dot: '#22c55e', label: 'Published ✓' },
}

export default async function WriterDashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const sb = createServerSupabase()

  const { data: pages } = await sb
    .from('seo_pages')
    .select('*')
    .order('week', { ascending: true })

  const name = user.user_metadata?.name ?? user.email ?? 'Writer'
  const assignedPages = pages ?? []

  const stats = {
    total: assignedPages.length,
    done: assignedPages.filter(p => p.status === 'done' || p.status === 'published').length,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Header */}
      <header style={{
        background: '#fff', borderBottom: '1px solid #e5e7eb',
        padding: '0 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 56,
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: '#111' }}>
          PolicyScanner <span style={{ color: '#6b7280', fontWeight: 400 }}>Content Portal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#6b7280' }}>{user.email}</span>
          <form action={logout}>
            <button type="submit" style={{
              background: 'none', border: '1px solid #e5e7eb',
              borderRadius: 6, padding: '5px 12px',
              fontSize: 13, cursor: 'pointer', color: '#374151',
            }}>
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>

        {/* Welcome */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#111' }}>
            Hi {name.split(' ')[0]} 👋
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 15, color: '#6b7280' }}>
            {stats.total === 0
              ? 'No pages yet — ask admin to seed the database.'
              : `${stats.total} page${stats.total !== 1 ? 's' : ''} to write. ${stats.done} completed.`}
          </p>
        </div>

        {/* Progress bar */}
        {stats.total > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Overall progress</span>
              <span style={{ fontSize: 13, color: '#6b7280' }}>{stats.done} / {stats.total}</span>
            </div>
            <div style={{ height: 8, background: '#e5e7eb', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 99, background: '#1d4ed8',
                width: `${stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0}%`,
                transition: 'width 0.3s',
              }} />
            </div>
          </div>
        )}

        {/* No pages state */}
        {assignedPages.length === 0 && (
          <div style={{
            background: '#fff', border: '1px dashed #d1d5db',
            borderRadius: 12, padding: 48, textAlign: 'center', color: '#9ca3af',
          }}>
            <p style={{ margin: 0, fontSize: 15 }}>
              No pages yet — the admin needs to seed the database first.
            </p>
          </div>
        )}

        {/* Pages list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {assignedPages.map(page => {
            const s = STATUS_STYLES[page.status] ?? STATUS_STYLES.not_started
            return (
              <div key={page.slug} style={{
                background: '#fff', border: '1px solid #e5e7eb',
                borderRadius: 12, padding: '16px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 16,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: s.dot, flexShrink: 0,
                    }} />
                    <span style={{ fontWeight: 600, fontSize: 15, color: '#111' }}>
                      {page.title}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#6b7280', paddingLeft: 18 }}>
                    <span>{page.url}</span>
                    <span>·</span>
                    <span>Target: {page.target_words} words</span>
                    <span>·</span>
                    <span>Week {page.week}</span>
                  </div>
                  {page.admin_notes && (
                    <div style={{
                      marginTop: 8, paddingLeft: 18, fontSize: 13,
                      color: '#374151', background: '#fffbeb',
                      borderLeft: '3px solid #fbbf24',
                      padding: '6px 10px 6px 12px',
                      borderRadius: '0 6px 6px 0',
                      marginLeft: 0,
                    }}>
                      <strong>Note from admin:</strong> {page.admin_notes}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: 99, fontSize: 12,
                    fontWeight: 600, background: s.bg, color: s.color,
                  }}>
                    {s.label}
                  </span>
                  <a
                    href={`/writer/brief/${page.slug}`}
                    style={{
                      padding: '8px 18px', background: '#1d4ed8', color: '#fff',
                      borderRadius: 8, fontSize: 14, fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    View Brief →
                  </a>
                </div>
              </div>
            )
          })}
        </div>

      </main>
    </div>
  )
}
