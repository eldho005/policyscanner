import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

// POST /api/quote - Store a new quote lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createServerSupabase()

    const {
      gender, tobacco,
      dobDay, dobMonth, dobYear,
      fullName, email, phone, countryCode,
      whatsappEnabled, type, coverage, province,
      medication, dui,
    } = body

    // Calculate age
    const dob = `${dobYear}-${dobMonth}-${dobDay}`
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    // Upsert user quotation (find by email+phone or create)
    const { data: existingUser } = await supabase
      .from('user_quotations')
      .select('id')
      .ilike('email', `%${email}%`)
      .ilike('phone', `%${phone}%`)
      .single()

    let userId: number

    if (existingUser) {
      const { error } = await supabase
        .from('user_quotations')
        .update({ name: fullName, email, phone, wa_notification: whatsappEnabled ?? '1', dob })
        .eq('id', existingUser.id)
      if (error) throw error
      userId = existingUser.id
    } else {
      const { data: newUser, error } = await supabase
        .from('user_quotations')
        .insert({ name: fullName, email, phone, wa_notification: whatsappEnabled ?? '1', dob })
        .select('id')
        .single()
      if (error) throw error
      userId = newUser!.id
    }

    // Get type ID from slug
    // Map form type label -> slug for DB lookup
    const typeSlugMap: Record<string, string> = {
      'Term Life':        'term-life',
      'Whole Life':       'whole-life',
      'Mortgage':         'mortgage-insurance',
      'Critical Illness': 'critical-illness',
    }
    const typeSlug = typeSlugMap[type] || type?.toLowerCase().replace(/\s+/g, '-') || 'term-life'

    const { data: typeData } = await supabase
      .from('types')
      .select('id')
      .eq('slug', typeSlug)
      .single()

    const quoteData = {
      gender, tobacco,
      dobDay, dobMonth, dobYear,
      name: fullName, email,
      countryCode, phoneNumber: phone,
      whatsappConsent: whatsappEnabled ?? '1',
      medication: medication || 'N',
      dui: dui || 'N',
    }

    // Create quotation form
    const { data: quote, error: quoteError } = await supabase
      .from('quotation_forms')
      .insert({
        user_quotation_id: userId,
        type: typeData?.id || 1,
        coverage,
        age,
        data: JSON.stringify(quoteData),
        is_ontario: province?.toLowerCase() === 'ontario' ? '1' : '0',
      })
      .select('id')
      .single()

    if (quoteError) throw quoteError

    // Send emails via ZeptoMail (non-blocking)
    const quoteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/quote-results/${quote!.id}`
    sendQuoteEmails(quoteUrl, body).catch(console.error)

    return NextResponse.json({ id: quote!.id, url: quoteUrl })
  } catch (error) {
    console.error('Quote store error:', error)
    return NextResponse.json({ error: 'Failed to save quote' }, { status: 500 })
  }
}

// Send emails (fire and forget)
async function sendQuoteEmails(url: string, formData: Record<string, string>) {
  const apiKey = process.env.ZEPTOMAIL_API_KEY
  if (!apiKey) return

  try {
    await fetch('https://api.zeptomail.com/v1.1/email', {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-enczapikey ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: { address: process.env.ZEPTOMAIL_FROM || 'noreply@policyscanner.ca', name: 'PolicyScanner' },
        to: [{ email_address: { address: formData.email, name: formData.fullName } }],
        subject: 'Your Insurance Quote is Ready - PolicyScanner',
        htmlbody: `
          <h2>Hi ${formData.fullName},</h2>
          <p>Your insurance quote comparison is ready!</p>
          <p><a href="${url}" style="background:#FF7A2A;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600;">View Your Quotes</a></p>
          <p style="color:#64748b;font-size:13px;">You can revisit this link anytime to review your saved quotes.</p>
          <br><p>— PolicyScanner Team</p>
        `,
      }),
    })
  } catch (e) {
    console.error('Email send error:', e)
  }
}
