import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

// POST /api/quote/[id]/rate - User selects a rate
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const supabase = createServerSupabase()

    // Save the selected rate
    const { data: rate, error } = await supabase
      .from('quotation_form_rates')
      .insert({
        quotation_form_id: parseInt(id),
        company_name: body.company,
        tag: body.tag || null,
        monthly_price: body.monthly_price,
        yearly_price: body.yearly_price,
        coverage: body.coverage_key,
        term: body.term,
        age_until: body.age_until || null,
      })
      .select('id')
      .single()

    if (error) throw error

    // Simple base64 encode for the thank-you URL (replaces Laravel's encrypt)
    const encodedId = Buffer.from(String(rate!.id)).toString('base64url')
    const thankYouUrl = `/thankyou/${encodedId}`

    // Get user info for email
    const { data: quote } = await supabase
      .from('quotation_forms')
      .select('*, user_quotations(*)')
      .eq('id', id)
      .single()

    // Send rate email (non-blocking)
    if (quote?.user_quotations) {
      sendRateEmail(
        `${process.env.NEXT_PUBLIC_APP_URL}${thankYouUrl}`,
        quote.user_quotations,
        body
      ).catch(console.error)
    }

    return NextResponse.json({ url: thankYouUrl })
  } catch (error) {
    console.error('Rate save error:', error)
    return NextResponse.json({ error: 'Failed to save rate' }, { status: 500 })
  }
}

async function sendRateEmail(
  url: string,
  user: { name: string; email: string },
  rateData: Record<string, string>
) {
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
        to: [{ email_address: { address: user.email, name: user.name } }],
        subject: 'Your Selected Insurance Rate - PolicyScanner',
        htmlbody: `
          <h2>Hi ${user.name},</h2>
          <p>You've selected a rate from <strong>${rateData.company}</strong>:</p>
          <ul>
            <li>Monthly: $${rateData.monthly_price}</li>
            <li>Annual: $${rateData.yearly_price}</li>
            <li>Coverage: $${rateData.coverage_key}</li>
            <li>Term: ${rateData.term}</li>
          </ul>
          <p><a href="${url}" style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;">View Details</a></p>
          <br><p>— PolicyScanner Team</p>
        `,
      }),
    })
  } catch (e) {
    console.error('Rate email error:', e)
  }
}
