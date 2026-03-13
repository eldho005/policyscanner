import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

// GET /api/quote/[id] - Get quote data for the results page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createServerSupabase()

    const { data: quote, error } = await supabase
      .from('quotation_forms')
      .select(`
        *,
        types (*),
        user_quotations (*)
      `)
      .eq('id', id)
      .single()

    if (error || !quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Parse the JSON data field
    quote.data = typeof quote.data === 'string' ? JSON.parse(quote.data) : quote.data

    return NextResponse.json(quote)
  } catch (error) {
    console.error('Quote fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 })
  }
}

// PATCH /api/quote/[id] - Update quote profile (medication, dui, coverage, type)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const supabase = createServerSupabase()

    const updates: Record<string, unknown> = {}
    if (body.medication !== undefined) updates.medication = body.medication === 'yes' ? 'Y' : 'N'
    if (body.dui !== undefined) updates.dui = body.dui === 'yes' ? 'Y' : 'N'
    if (body.coverage !== undefined) updates.coverage = body.coverage

    if (body.type) {
      const { data: typeData } = await supabase
        .from('types')
        .select('id')
        .ilike('slug', `%${body.type}%`)
        .single()
      if (typeData) updates.type = typeData.id
    }

    if (body.gender || body.dobDay) {
      // Recalculate age and update data JSON
      const dob = `${body.dobDay}-${body.dobMonth}-${body.dobYear}`
      const birthDate = new Date(`${body.dobYear}-${body.dobMonth}-${body.dobDay}`)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      updates.age = age
      updates.data = JSON.stringify({
        gender: body.gender === 'male' ? 'M' : 'F',
        tobacco: body.smoking === 'yes' ? 'Y' : 'N',
        dobDay: body.dobDay,
        dobMonth: body.dobMonth,
        dobYear: body.dobYear,
        name: body.name,
        email: body.email,
        phoneNumber: body.phone,
      })
    }

    const { data, error } = await supabase
      .from('quotation_forms')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Quote update error:', error)
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 })
  }
}
