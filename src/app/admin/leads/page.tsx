import { createServerSupabase } from '@/lib/supabase-server'
import LeadsTable from './LeadsTable'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Leads | Admin | PolicyScanner',
  robots: 'noindex, nofollow',
}

export default async function AdminLeadsPage() {
  const supabase = createServerSupabase()

  // Fetch recent quotation forms with user info
  const { data: leads, error } = await supabase
    .from('quotation_forms')
    .select(`
      id,
      type,
      coverage,
      age,
      medication,
      dui,
      is_ontario,
      data,
      created_at,
      user_quotations:user_quotation_id (id, name, email, phone, dob),
      quotation_form_rates (id, company_name, monthly_price, yearly_price, term)
    `)
    .order('created_at', { ascending: false })
    .limit(200)

  // Fetch types for mapping IDs to names
  const { data: types } = await supabase
    .from('types')
    .select('id, name, slug')

  const typeMap = Object.fromEntries(
    (types || []).map(t => [String(t.id), t.name])
  )

  if (error) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
        <h1>Admin — Leads</h1>
        <p style={{ color: 'red' }}>Error loading leads: {error.message}</p>
      </div>
    )
  }

  return <LeadsTable leads={leads || []} typeMap={typeMap} />
}
