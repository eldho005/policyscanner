'use client'

import { useState, useActionState } from 'react'
import { createWriter, deleteWriter } from './actions'

interface Writer {
  id: string
  email: string
  name: string
  createdAt: string
  lastSignIn: string | null
  assignedPages: number
  donePages: number
}

interface Props {
  writers: Writer[]
  currentUserEmail: string
  logoutAction: () => Promise<void>
}

export default function WritersClient({ writers: initialWriters, currentUserEmail, logoutAction }: Props) {
  const [writers, setWriters] = useState(initialWriters)
  const [showForm, setShowForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [createState, createAction, creating] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      const result = await createWriter(formData)
      if (result.success) {
        setShowForm(false)
        // Refresh handled by revalidatePath
      }
      return result
    },
    null
  )

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove writer "${name}"? This will unassign all their pages.`)) return
    setDeletingId(id)
    await deleteWriter(id)
    setWriters(prev => prev.filter(w => w.id !== id))
    setDeletingId(null)
  }

  const td: React.CSSProperties = {
    padding: '12px 16px', fontSize: 14, color: '#111',
    borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle',
  }
  const th: React.CSSProperties = {
    textAlign: 'left', padding: '10px 16px', fontSize: 12, fontWeight: 600,
    color: '#6b7280', background: '#f9fafb', borderBottom: '1px solid #e5e7eb',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#111' }}>
            PolicyScanner <span style={{ color: '#6b7280', fontWeight: 400 }}>Admin</span>
          </span>
          <nav style={{ display: 'flex', gap: 4 }}>
            {[
              { href: '/admin/seo-pages', label: 'SEO Pages' },
              { href: '/admin/writers', label: 'Writers' },
              { href: '/admin/leads', label: 'Leads' },
            ].map(({ href, label }) => (
              <a key={href} href={href} style={{
                padding: '4px 12px', borderRadius: 6, fontSize: 14,
                fontWeight: 500, color: '#374151', textDecoration: 'none',
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
              background: 'none', border: '1px solid #e5e7eb',
              borderRadius: 6, padding: '5px 12px', fontSize: 13,
              cursor: 'pointer', color: '#374151',
            }}>
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main style={{ padding: 24 }}>
        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontWeight: 700, fontSize: 22, color: '#111' }}>Writers</h1>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>
              {writers.length} writer{writers.length !== 1 ? 's' : ''} — they log in at{' '}
              <code style={{ background: '#f3f4f6', padding: '1px 6px', borderRadius: 4 }}>
                {typeof window !== 'undefined' ? window.location.origin : ''}/login
              </code>
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '8px 18px', background: '#1d4ed8', color: '#fff',
              border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + Add Writer
          </button>
        </div>

        {/* Add writer form */}
        {showForm && (
          <div style={{
            background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12,
            padding: 24, marginBottom: 24, maxWidth: 480,
          }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>New Writer Account</h2>
            {createState?.error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 8, padding: '8px 12px', marginBottom: 12,
                color: '#dc2626', fontSize: 13,
              }}>{createState.error}</div>
            )}
            <form action={createAction} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { name: 'name', label: 'Name', type: 'text', placeholder: 'Jane Smith' },
                { name: 'email', label: 'Email', type: 'email', placeholder: 'jane@seocompany.com' },
                { name: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters' },
              ].map(f => (
                <div key={f.name}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
                    {f.label}
                  </label>
                  <input
                    name={f.name} type={f.type} required placeholder={f.placeholder}
                    style={{
                      width: '100%', padding: '8px 10px', border: '1px solid #d1d5db',
                      borderRadius: 8, fontSize: 14, boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  type="submit"
                  disabled={creating}
                  style={{
                    padding: '8px 20px', background: creating ? '#93c5fd' : '#1d4ed8',
                    color: '#fff', border: 'none', borderRadius: 8,
                    fontSize: 14, fontWeight: 600, cursor: creating ? 'not-allowed' : 'pointer',
                  }}
                >
                  {creating ? 'Creating…' : 'Create Writer'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: '8px 16px', background: '#f3f4f6',
                    color: '#374151', border: 'none', borderRadius: 8,
                    fontSize: 14, cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Writers table */}
        {writers.length === 0 ? (
          <div style={{
            background: '#fff', border: '1px dashed #d1d5db', borderRadius: 12,
            padding: 48, textAlign: 'center', color: '#6b7280',
          }}>
            <p style={{ margin: 0, fontSize: 15 }}>No writers yet. Add one above.</p>
          </div>
        ) : (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>Name</th>
                  <th style={th}>Email</th>
                  <th style={th}>Pages</th>
                  <th style={th}>Last login</th>
                  <th style={th}></th>
                </tr>
              </thead>
              <tbody>
                {writers.map(w => (
                  <tr key={w.id}>
                    <td style={td}>
                      <div style={{ fontWeight: 600 }}>{w.name}</div>
                    </td>
                    <td style={{ ...td, color: '#6b7280' }}>{w.email}</td>
                    <td style={td}>
                      <span style={{
                        fontSize: 13,
                        color: w.assignedPages === 0 ? '#9ca3af' : '#111',
                      }}>
                        {w.assignedPages === 0
                          ? 'No pages assigned'
                          : `${w.donePages}/${w.assignedPages} done`}
                      </span>
                    </td>
                    <td style={{ ...td, color: '#6b7280', fontSize: 12 }}>
                      {w.lastSignIn
                        ? new Date(w.lastSignIn).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
                        : 'Never'}
                    </td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(w.id, w.name)}
                        disabled={deletingId === w.id}
                        style={{
                          padding: '4px 12px', background: '#fff',
                          color: '#dc2626', border: '1px solid #fecaca',
                          borderRadius: 6, fontSize: 12, cursor: 'pointer',
                        }}
                      >
                        {deletingId === w.id ? 'Removing…' : 'Remove'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
