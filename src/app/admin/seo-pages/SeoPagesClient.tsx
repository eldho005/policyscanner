'use client'

import { useState, useTransition, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { SEO_PAGES } from '@/data/seo-page-plan'
import { updatePageStatus, markSanityPushed } from './actions'
import type { DbPage } from './page'

// ─── Constants ───────────────────────────────────────────────────────────────

const SANITY_STUDIO_BASE = `/studio/structure/insurancePage;insurancePage`

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  not_started: { bg: '#f3f4f6', color: '#6b7280', label: 'Not started' },
  in_progress: { bg: '#fef9c3', color: '#854d0e', label: 'In progress' },
  done:        { bg: '#dbeafe', color: '#1d4ed8', label: 'Done' },
  published:   { bg: '#dcfce7', color: '#166534', label: 'Published' },
}

const TYPE_COLORS: Record<string, string> = {
  hub:         '#7c3aed',
  product:     '#1d4ed8',
  comparison:  '#0369a1',
  demographic: '#0f766e',
  tool:        '#b45309',
  money:       '#be185d',
}

// ─── Admin Nav Shell ─────────────────────────────────────────────────────────

function AdminShell({ currentUserEmail, logoutAction, children }: {
  currentUserEmail: string
  logoutAction: () => Promise<void>
  children: React.ReactNode
}) {
  const pathname = usePathname()
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#111' }}>
            PolicyScanner <span style={{ color: '#6b7280', fontWeight: 400 }}>Admin</span>
          </span>
          <nav style={{ display: 'flex', gap: 4 }}>
            {[
              { href: '/admin/seo-pages', label: 'SEO Pages' },
              { href: '/admin/leads', label: 'Leads' },
            ].map(({ href, label }) => (
              <a key={href} href={href} style={{
                padding: '4px 12px',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 500,
                color: '#374151',
                textDecoration: 'none',
                background: pathname === href ? '#f3f4f6' : 'transparent',
              }}>
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#6b7280' }}>{currentUserEmail}</span>
          <form action={logoutAction}>
            <button type="submit" style={{
              background: 'none',
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              padding: '5px 12px',
              fontSize: 13,
              cursor: 'pointer',
              color: '#374151',
            }}>
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main style={{ padding: '24px' }}>{children}</main>
    </div>
  )
}

// ─── Badge ───────────────────────────────────────────────────────────────────

function Badge({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 99,
      fontSize: 12,
      fontWeight: 600,
      background: bg,
      color,
    }}>
      {label}
    </span>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  initialPages: DbPage[]
  currentUserEmail: string
  logoutAction: () => Promise<void>
}

export default function SeoPagesClient({ initialPages, currentUserEmail, logoutAction }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [pages, setPages] = useState<DbPage[]>(initialPages)
  const [seedingDb, setSeedingDb] = useState(false)
  const [seedDbResult, setSeedDbResult] = useState<string | null>(null)
  const [pushingSlug, setPushingSlug] = useState<string | null>(null)

  const dbSeeded = pages.length > 0

  // ── Seed DB ──────────────────────────────────────────────────────────────
  const seedDb = async () => {
    setSeedingDb(true)
    setSeedDbResult(null)
    try {
      const res = await fetch('/api/admin/seed-pages-db', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setSeedDbResult(`✓ ${data.seeded} pages seeded.`)
        router.refresh()
      } else {
        setSeedDbResult(`Error: ${data.error}`)
      }
    } finally {
      setSeedingDb(false)
    }
  }

  // ── Seed page to Sanity ──────────────────────────────────────────────────
  const pushToSanity = useCallback(async (slug: string) => {
    setPushingSlug(slug)
    try {
      const res = await fetch('/api/admin/seed-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      const data = await res.json()
      if (data.success) {
        startTransition(async () => {
          await markSanityPushed(slug)
          setPages(prev => prev.map(p => p.slug === slug ? { ...p, sanity_pushed: true } : p))
        })
      }
    } finally {
      setPushingSlug(null)
    }
  }, [])

  // ── Update status ────────────────────────────────────────────────────────
  const handleStatus = (slug: string, status: string) => {
    setPages(prev => prev.map(p => p.slug === slug
      ? { ...p, status: status as DbPage['status'] } : p))
    startTransition(() => updatePageStatus(slug, status))
  }

  // ── Compute stats ─────────────────────────────────────────────────────────
  const stats = {
    total: pages.length,
    not_started: pages.filter(p => p.status === 'not_started').length,
    in_progress: pages.filter(p => p.status === 'in_progress').length,
    done: pages.filter(p => p.status === 'done').length,
    published: pages.filter(p => p.status === 'published').length,
    sanity: pages.filter(p => p.sanity_pushed).length,
  }

  // ── Group by week ─────────────────────────────────────────────────────────
  const weeks: Record<number, (DbPage & { planMeta: typeof SEO_PAGES[0] })[]> = {}
  pages.forEach(dbPage => {
    const plan = SEO_PAGES.find(p => p.slug === dbPage.slug)
    if (!plan) return
    const w = dbPage.week
    weeks[w] = weeks[w] ?? []
    weeks[w].push({ ...dbPage, planMeta: plan })
  })

  const th: React.CSSProperties = {
    textAlign: 'left', padding: '8px 12px', fontSize: 12, fontWeight: 600,
    color: '#6b7280', whiteSpace: 'nowrap', background: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
  }
  const td: React.CSSProperties = {
    padding: '10px 12px', fontSize: 13, color: '#111',
    borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle',
  }

  return (
    <AdminShell currentUserEmail={currentUserEmail} logoutAction={logoutAction}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 700, fontSize: 22, color: '#111' }}>SEO Pages</h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>
            20-page hub strategy — brief, assign, push to Sanity
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {!dbSeeded && (
            <button onClick={seedDb} disabled={seedingDb} style={{
              padding: '8px 16px', background: '#1d4ed8', color: '#fff',
              border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
              cursor: seedingDb ? 'not-allowed' : 'pointer',
            }}>
              {seedingDb ? 'Seeding…' : 'Seed DB (first time setup)'}
            </button>
          )}
          {seedDbResult && (
            <span style={{ fontSize: 13, color: seedDbResult.startsWith('✓') ? '#166534' : '#dc2626' }}>
              {seedDbResult}
            </span>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap',
      }}>
        {[
          { label: 'Total', value: stats.total, color: '#111' },
          { label: 'Not started', value: stats.not_started, color: '#6b7280' },
          { label: 'In progress', value: stats.in_progress, color: '#854d0e' },
          { label: 'Done', value: stats.done, color: '#1d4ed8' },
          { label: 'Published', value: stats.published, color: '#166534' },
          { label: 'In Sanity', value: stats.sanity, color: '#6d28d9' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
            padding: '12px 18px', minWidth: 100, textAlign: 'center',
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Not seeded yet state */}
      {!dbSeeded && (
        <div style={{
          background: '#fff', border: '1px dashed #d1d5db', borderRadius: 12,
          padding: 48, textAlign: 'center', color: '#6b7280',
        }}>
          <p style={{ fontSize: 16, margin: 0 }}>
            No pages in database yet. Click <strong>Seed DB</strong> to populate from the 20-page plan.
          </p>
        </div>
      )}

      {/* Pages table grouped by week */}
      {dbSeeded && Object.keys(weeks).sort((a, b) => +a - +b).map(weekNum => {
        const weekPages = weeks[+weekNum]
        return (
          <div key={weekNum} style={{ marginBottom: 32 }}>
            <h2 style={{
              fontSize: 14, fontWeight: 700, color: '#374151',
              margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              Week {weekNum}
            </h2>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={th}>Page</th>
                    <th style={th}>Keyword</th>
                    <th style={th}>Words</th>
                    <th style={th}>Status</th>
                    <th style={th}>Sanity</th>
                    <th style={th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {weekPages.map(page => {
                    const statusStyle = STATUS_STYLES[page.status]
                    const typeColor = TYPE_COLORS[page.planMeta.type] ?? '#6b7280'

                    return (
                      <tr key={page.slug}>
                        {/* Page */}
                        <td style={td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{
                              width: 6, height: 6, borderRadius: '50%',
                              background: typeColor, flexShrink: 0,
                            }} />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 13 }}>{page.title}</div>
                              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>{page.url}</div>
                            </div>
                          </div>
                        </td>

                        {/* Keyword */}
                        <td style={{ ...td, color: '#6b7280', maxWidth: 180 }}>
                          <span style={{ fontSize: 12 }}>{page.keyword}</span>
                        </td>

                        {/* Words */}
                        <td style={{ ...td, whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: 12, color: '#6b7280' }}>{page.target_words}</span>
                        </td>

                        {/* Status dropdown */}
                        <td style={td}>
                          <select
                            value={page.status}
                            onChange={e => handleStatus(page.slug, e.target.value)}
                            disabled={isPending}
                            style={{
                              padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                              background: statusStyle.bg, color: statusStyle.color,
                              border: `1px solid ${statusStyle.color}30`,
                              cursor: 'pointer',
                            }}
                          >
                            {Object.entries(STATUS_STYLES).map(([val, s]) => (
                              <option key={val} value={val}>{s.label}</option>
                            ))}
                          </select>
                        </td>

                        {/* Sanity status */}
                        <td style={td}>
                          <Badge
                            label={page.sanity_pushed ? '✓ In Sanity' : 'Not seeded'}
                            bg={page.sanity_pushed ? '#dcfce7' : '#f3f4f6'}
                            color={page.sanity_pushed ? '#166534' : '#6b7280'}
                          />
                        </td>

                        {/* Actions */}
                        <td style={{ ...td, whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            {/* View brief */}
                            <a
                              href={`/writer/brief/${page.slug}`}
                              style={{
                                padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                                background: '#f3f4f6', color: '#374151', textDecoration: 'none',
                                border: '1px solid #e5e7eb',
                              }}
                            >
                              Brief
                            </a>

                            {/* Push to Sanity */}
                            <button
                              onClick={() => pushToSanity(page.slug)}
                              disabled={pushingSlug === page.slug}
                              style={{
                                padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                                background: pushingSlug === page.slug ? '#e0e7ff' : '#ede9fe',
                                color: '#6d28d9', border: 'none', cursor: 'pointer',
                              }}
                            >
                              {pushingSlug === page.slug ? 'Pushing…' : page.sanity_pushed ? 'Re-push' : 'Push'}
                            </button>

                            {/* Open in Sanity Studio */}
                            <a
                              href={`${SANITY_STUDIO_BASE}-${page.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                                background: '#fef9c3', color: '#854d0e', textDecoration: 'none',
                                border: '1px solid #fde68a',
                              }}
                            >
                              Studio ↗
                            </a>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </AdminShell>
  )
}
