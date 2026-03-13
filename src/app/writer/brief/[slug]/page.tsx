import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/supabase-server-auth'
import { createServerSupabase } from '@/lib/supabase-server'
import { logout } from '@/app/login/actions'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const SANITY_STUDIO_BASE = `/studio/structure/insurancePage;insurancePage`

interface WriterNotes {
  target_words?: string
  focus?: string
  key_points?: string[]
  real_example?: string
  callout_after?: string
  structure?: string
}

interface SeedSection {
  component?: string
  heading?: string
  title?: string
  _writer_notes?: WriterNotes
  [key: string]: unknown
}

// ─── Snippet target guidance ──────────────────────────────────────────────────
function getSnippetHint(heading: string, component: string): { type: string; rule: string } | null {
  const h = (heading ?? '').toLowerCase()
  if (h.includes('what is') || h.includes('what are')) {
    return { type: 'Paragraph snippet', rule: 'First paragraph must be 40–60 words. Direct definition. Include key terms.' }
  }
  if (h.includes('how much') || h.includes('cost') || h.includes('price')) {
    return { type: 'Paragraph snippet', rule: 'Open with a concrete number or range. e.g. "$35–50/month for a healthy 35-year-old."' }
  }
  if (h.includes('how to') || h.includes('steps') || h.includes('process')) {
    return { type: 'Numbered list snippet', rule: 'Put a clean numbered list near the top (4–7 items). One action per item.' }
  }
  if (h.includes('faq') || h.includes('question')) {
    return { type: 'FAQ snippet', rule: 'Format as Q: ... / A: ... Use natural language questions. Answers 40–60 words max each.' }
  }
  if (h.includes('vs') || h.includes('compare') || h.includes('versus') || h.includes('difference')) {
    return { type: 'Table snippet', rule: 'Use a markdown table at the top of the comparison. 4–6 rows, clear headers.' }
  }
  if (component === 'faq_section') {
    return { type: 'FAQ snippet', rule: 'Natural Q: / A: format. Google may show these directly in search results.' }
  }
  return null
}

// ─── Section type badge ───────────────────────────────────────────────────────
function sectionLabel(component: string): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    hero_section:     { label: 'Hero', color: '#7c3aed' },
    content_block:    { label: 'Content', color: '#1d4ed8' },
    faq_section:      { label: 'FAQ', color: '#0369a1' },
    comparison_table: { label: 'Table', color: '#0f766e' },
    cta_section:      { label: 'CTA', color: '#be185d' },
    stats_bar:        { label: 'Stats', color: '#b45309' },
    trust_badges:     { label: 'Trust', color: '#6b7280' },
    quote_form:       { label: 'Form', color: '#166534' },
  }
  return map[component] ?? { label: component ?? 'Section', color: '#374151' }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function WriterBriefPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const user = await getCurrentUser()
  if (!user) redirect('/login')

  // Read the JSON seed file
  const jsonPath = path.join(process.cwd(), 'src', 'data', 'insurance', `${slug}.json`)
  if (!fs.existsSync(jsonPath)) {
    notFound()
  }
  const raw = fs.readFileSync(jsonPath, 'utf-8')
  const seedData = JSON.parse(raw)

  // Fetch DB page record
  const sb = createServerSupabase()
  const { data: dbPage } = await sb
    .from('seo_pages')
    .select('*')
    .eq('slug', slug)
    .single()

  const meta = seedData._meta ?? {}
  const pageData: SeedSection[] = (seedData.page_data ?? []) as SeedSection[]
  const keywords = meta.seo_keywords ?? {}

  // Only sections with _writer_notes are shown as content sections
  const sections = pageData.filter((s): s is SeedSection & { _writer_notes: WriterNotes } => Boolean(s._writer_notes))

  const isAdmin = user.user_metadata?.role === 'admin'

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Header */}
      <header style={{
        background: '#fff', borderBottom: '1px solid #e5e7eb',
        padding: '0 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 56,
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href={isAdmin ? '/admin/seo-pages' : '/writer'} style={{
            fontSize: 13, color: '#6b7280', textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            ← Back
          </a>
          <span style={{ color: '#e5e7eb' }}>|</span>
          <span style={{ fontWeight: 600, fontSize: 15, color: '#111' }}>
            Content Brief
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a
            href={`${SANITY_STUDIO_BASE}-${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '7px 16px',
              background: '#1d4ed8', color: '#fff',
              borderRadius: 8, fontSize: 14, fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Open in Sanity Studio ↗
          </a>
          <form action={logout}>
            <button type="submit" style={{
              background: 'none', border: '1px solid #e5e7eb',
              borderRadius: 6, padding: '5px 12px', fontSize: 13,
              cursor: 'pointer', color: '#374151',
            }}>
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main style={{ padding: '24px', maxWidth: 860, margin: '0 auto' }}>

        {/* ── Page Info ── */}
        <div style={{
          background: '#fff', border: '1px solid #e5e7eb',
          borderRadius: 12, padding: '20px 24px', marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, color: '#111' }}>
                {seedData.title ?? dbPage?.title ?? slug}
              </h1>
              {dbPage && (
                <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#6b7280', flexWrap: 'wrap' }}>
                  <span>URL: <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: 4 }}>{dbPage.url}</code></span>
                  <span>· Target: <strong style={{ color: '#111' }}>{meta.target_words ?? dbPage.target_words} words</strong></span>
                  <span>· Week {dbPage.week}</span>
                  <span>· Keyword: <em>{meta.primary_keyword ?? dbPage.keyword}</em></span>
                </div>
              )}
            </div>
            {dbPage && (
              <span style={{
                padding: '4px 12px', borderRadius: 99, fontSize: 12,
                fontWeight: 700, background: '#dbeafe', color: '#1d4ed8',
                flexShrink: 0,
              }}>
                {dbPage.status.replace('_', ' ').toUpperCase()}
              </span>
            )}
          </div>

          {/* Admin notes */}
          {dbPage?.admin_notes && (
            <div style={{
              marginTop: 14, padding: '10px 14px',
              background: '#fffbeb', borderLeft: '3px solid #f59e0b',
              borderRadius: '0 8px 8px 0', fontSize: 14, color: '#374151',
            }}>
              <strong>📌 Note from admin:</strong> {dbPage.admin_notes}
            </div>
          )}
        </div>

        {/* ── Keyword cheat-sheet ── */}
        {keywords.use_primary_exact && (
          <div style={{
            background: '#fff', border: '1px solid #e5e7eb',
            borderRadius: 12, padding: '18px 24px', marginBottom: 20,
          }}>
            <h2 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: '#111' }}>
              🔑 Keyword Guide
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: 6 }}>
                  Primary keyword
                </div>
                <code style={{
                  background: '#fef9c3', padding: '4px 10px',
                  borderRadius: 6, fontSize: 13, fontWeight: 600, color: '#78350f',
                }}>
                  {keywords.use_primary_exact}
                </code>
                {keywords.density_rule && (
                  <p style={{ fontSize: 12, color: '#6b7280', margin: '8px 0 0' }}>
                    {keywords.density_rule}
                  </p>
                )}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: 6 }}>
                  Synonyms to use
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {(keywords.synonyms ?? []).map((s: string) => (
                    <span key={s} style={{
                      background: '#f0fdf4', color: '#166534',
                      padding: '2px 8px', borderRadius: 99, fontSize: 12,
                    }}>{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: 6 }}>
                  LSI / related terms
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {(keywords.lsi_terms ?? []).map((s: string) => (
                    <span key={s} style={{
                      background: '#eff6ff', color: '#1d4ed8',
                      padding: '2px 8px', borderRadius: 99, fontSize: 12,
                    }}>{s}</span>
                  ))}
                </div>
              </div>
              {keywords.avoid && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#dc2626', textTransform: 'uppercase', marginBottom: 6 }}>
                    ⚠️ Avoid
                  </div>
                  <p style={{ fontSize: 12, color: '#374151', margin: 0 }}>{keywords.avoid}</p>
                </div>
              )}
            </div>
            {keywords.real_example_to_use && (
              <div style={{
                marginTop: 14, padding: '10px 14px',
                background: '#f0fdf4', borderLeft: '3px solid #22c55e',
                borderRadius: '0 8px 8px 0', fontSize: 13, color: '#374151',
              }}>
                <strong>Real example to use:</strong> {keywords.real_example_to_use}
              </div>
            )}
          </div>
        )}

        {/* ── Sections ── */}
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: '0 0 12px' }}>
          📝 Section Briefs ({sections.length} sections)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {sections.map((section, i) => {
            const notes: WriterNotes = section._writer_notes
            const heading = section.heading ?? section.title ?? `Section ${i + 1}`
            const component = section.component ?? ''
            const snippetHint = getSnippetHint(heading, component)
            const { label, color } = sectionLabel(component)
            const keyPoints = notes.key_points ?? []

            return (
              <div key={i} style={{
                background: '#fff', border: '1px solid #e5e7eb',
                borderRadius: 12, overflow: 'hidden',
              }}>
                {/* Section header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 18px', borderBottom: '1px solid #f3f4f6',
                  background: '#fafafa',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      background: color + '18', color, fontWeight: 700,
                      fontSize: 11, padding: '2px 8px', borderRadius: 99,
                      textTransform: 'uppercase', letterSpacing: '0.04em',
                    }}>
                      {label}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: 15, color: '#111' }}>{heading}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {notes.target_words && (
                      <span style={{
                        background: '#f3f4f6', color: '#374151',
                        padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600,
                      }}>
                        {notes.target_words as string} words
                      </span>
                    )}
                    {snippetHint && (
                      <span style={{
                        background: '#fef9c3', color: '#78350f',
                        padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
                      }}>
                        🎯 {snippetHint.type}
                      </span>
                    )}
                  </div>
                </div>

                {/* Section body */}
                <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>

                  {/* Focus */}
                  {notes.focus && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 5 }}>
                        Focus
                      </div>
                      <p style={{ margin: 0, fontSize: 14, color: '#111', lineHeight: 1.5 }}>
                        {notes.focus as string}
                      </p>
                    </div>
                  )}

                  {/* Snippet guidance */}
                  {snippetHint && (
                    <div style={{
                      padding: '8px 12px', background: '#fefce8',
                      borderRadius: 8, fontSize: 13, color: '#78350f',
                      borderLeft: '3px solid #fbbf24',
                    }}>
                      <strong>Snippet tip:</strong> {snippetHint.rule}
                    </div>
                  )}

                  {/* Key points */}
                  {keyPoints.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 8 }}>
                        Must cover
                      </div>
                      <ul style={{ margin: 0, padding: '0 0 0 18px' }}>
                        {keyPoints.map((point, pi) => (
                          <li key={pi} style={{
                            fontSize: 13, color: '#374151',
                            lineHeight: 1.6, marginBottom: 4,
                          }}>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Real example */}
                  {notes.real_example && (
                    <div style={{
                      padding: '10px 14px', background: '#f0fdf4',
                      borderRadius: 8, fontSize: 13, color: '#166534',
                      borderLeft: '3px solid #22c55e',
                    }}>
                      <strong>Real example to use:</strong> {notes.real_example as string}
                    </div>
                  )}

                  {/* Structure guidance */}
                  {notes.structure && (
                    <div style={{
                      padding: '10px 14px', background: '#eff6ff',
                      borderRadius: 8, fontSize: 13, color: '#1d4ed8',
                    }}>
                      <strong>Structure:</strong> {notes.structure as string}
                    </div>
                  )}

                  {/* Callout note */}
                  {notes.callout_after && (
                    <div style={{
                      padding: '10px 14px', background: '#f5f3ff',
                      borderRadius: 8, fontSize: 13, color: '#6d28d9',
                    }}>
                      <strong>Callout box after this section:</strong> {notes.callout_after as string}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Submission checklist ── */}
        <div style={{
          background: '#fff', border: '1px solid #e5e7eb',
          borderRadius: 12, padding: '18px 24px', marginTop: 24,
        }}>
          <h2 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: '#111' }}>
            ✅ Before You Submit — Checklist
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {[
              'Primary keyword used 3–5 times per 500 words',
              'At least 3 synonym variations used throughout',
              'Every H2 section has a direct, specific opening sentence',
              'At least one real-person example included',
              'FSRA or licensing credentials mentioned at least once',
              'FAQ section formatted as clear Q: / A: pairs',
              'All cost tables include Ontario-specific examples',
              'No passive voice in the first sentence of any section',
              'Word count is within the target range',
              'CTA is present at the end of key sections',
            ].map((item, i) => (
              <label key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                fontSize: 13, color: '#374151', cursor: 'pointer', padding: '3px 0',
              }}>
                <input type="checkbox" style={{ marginTop: 2 }} />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* ── Sanity Studio CTA ── */}
        <div style={{
          marginTop: 24, padding: '24px', background: '#1d4ed8',
          borderRadius: 12, textAlign: 'center', color: '#fff',
        }}>
          <p style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700 }}>
            Ready to write?
          </p>
          <p style={{ margin: '0 0 16px', fontSize: 14, opacity: 0.85 }}>
            Open this page in Sanity Studio and write directly in the CMS.
          </p>
          <a
            href={`${SANITY_STUDIO_BASE}-${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '10px 28px',
              background: '#fff', color: '#1d4ed8',
              borderRadius: 8, fontSize: 15, fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Open in Sanity Studio ↗
          </a>
        </div>

      </main>
    </div>
  )
}
