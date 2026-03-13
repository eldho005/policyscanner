'use client'

import { useState } from 'react'

interface Lead {
  id: number
  type: string | null
  coverage: string | null
  age: string | null
  medication: string | null
  dui: string | null
  is_ontario: string | null
  data: Record<string, string> | string | null
  created_at: string
  user_quotations: {
    id: number
    name: string
    email: string
    phone: string
    dob: string | null
  }[] | {
    id: number
    name: string
    email: string
    phone: string
    dob: string | null
  } | null
  quotation_form_rates: {
    id: number
    company_name: string
    monthly_price: number
    yearly_price: number
    term: string
  }[]
}

export default function LeadsTable({
  leads,
  typeMap,
}: {
  leads: Lead[]
  typeMap: Record<string, string>
}) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'rated' | 'unrated'>('all')

  const filtered = leads.filter(lead => {
    const uq = lead.user_quotations
    const user = Array.isArray(uq) ? uq[0] : uq
    const data = typeof lead.data === 'string' ? JSON.parse(lead.data) : lead.data

    // Search filter
    if (search) {
      const q = search.toLowerCase()
      const name = (user?.name || data?.name || '').toLowerCase()
      const email = (user?.email || data?.email || '').toLowerCase()
      const phone = (user?.phone || data?.phoneNumber || '').toLowerCase()
      if (!name.includes(q) && !email.includes(q) && !phone.includes(q) && !String(lead.id).includes(q)) {
        return false
      }
    }

    // Rate status filter
    if (filter === 'rated' && (!lead.quotation_form_rates || lead.quotation_form_rates.length === 0)) return false
    if (filter === 'unrated' && lead.quotation_form_rates && lead.quotation_form_rates.length > 0) return false

    return true
  })

  return (
    <div style={{ padding: '2rem', fontFamily: 'Inter, sans-serif', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Admin — Leads ({leads.length})</h1>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by name, email, phone, or ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '0.9rem',
            minWidth: '300px',
          }}
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value as 'all' | 'rated' | 'unrated')}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '0.9rem',
          }}
        >
          <option value="all">All Leads</option>
          <option value="rated">Selected a Rate</option>
          <option value="unrated">No Rate Selected</option>
        </select>
        <span style={{ alignSelf: 'center', color: '#666', fontSize: '0.85rem' }}>
          Showing {filtered.length} of {leads.length}
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.85rem',
          }}
        >
          <thead>
            <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
              <Th>ID</Th>
              <Th>Date</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Type</Th>
              <Th>Coverage</Th>
              <Th>Age</Th>
              <Th>Province</Th>
              <Th>Med</Th>
              <Th>DUI</Th>
              <Th>Selected Rate</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(lead => {
              const uq = lead.user_quotations
              const user = Array.isArray(uq) ? uq[0] : uq
              const data = typeof lead.data === 'string' ? JSON.parse(lead.data) : lead.data
              const rate = lead.quotation_form_rates?.[0]
              const typeName = typeMap[lead.type || ''] || lead.type || '—'
              const date = new Date(lead.created_at)

              return (
                <tr key={lead.id} style={{ borderBottom: '1px solid #eee' }}>
                  <Td>{lead.id}</Td>
                  <Td>{date.toLocaleDateString('en-CA')} {date.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' })}</Td>
                  <Td>{user?.name || data?.name || '—'}</Td>
                  <Td>
                    <a href={`mailto:${user?.email || data?.email}`} style={{ color: '#2563eb' }}>
                      {user?.email || data?.email || '—'}
                    </a>
                  </Td>
                  <Td>{user?.phone || data?.phoneNumber || '—'}</Td>
                  <Td>{typeName}</Td>
                  <Td>${Number(lead.coverage || 0).toLocaleString()}</Td>
                  <Td>{lead.age || '—'}</Td>
                  <Td>{lead.is_ontario === '1' ? 'ON' : 'Other'}</Td>
                  <Td>{lead.medication || '—'}</Td>
                  <Td>{lead.dui || '—'}</Td>
                  <Td>
                    {rate ? (
                      <span style={{ color: '#16a34a', fontWeight: 500 }}>
                        {rate.company_name} — ${rate.monthly_price}/mo
                      </span>
                    ) : (
                      <span style={{ color: '#999' }}>—</span>
                    )}
                  </Td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={12} style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
      {children}
    </th>
  )
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td style={{ padding: '0.6rem 0.5rem', whiteSpace: 'nowrap' }}>
      {children}
    </td>
  )
}
