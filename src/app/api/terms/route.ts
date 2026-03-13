import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

/**
 * GET /api/terms?type_id=X
 * Fetch terms by type ID for the quote results dropdown.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const typeId = searchParams.get('type_id')

    const supabase = createServerSupabase()

    let query = supabase.from('terms').select('*, type:type_id(id, name, slug)').eq('status', 'active')

    if (typeId) {
      query = query.eq('type_id', typeId)
    }

    const { data: terms, error } = await query.order('id', { ascending: true })

    if (error) throw error

    return NextResponse.json({ terms: terms || [] })
  } catch (error) {
    console.error('Terms fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch terms' }, { status: 500 })
  }
}
