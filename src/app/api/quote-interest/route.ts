import { NextRequest, NextResponse } from 'next/server'

// POST /api/quote-interest — Log when a user clicks "Get Quote" on a specific company card.
// This is fire-and-forget from the client; failures are non-critical.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      quoteId,
      companyName,
      displayName,
      product,
      monthlyPrice,
      yearlyPrice,
      coverage,
      term,
      policyType,
      userName,
      userEmail,
      userPhone,
    } = body

    // Log to server console for now — replace with Supabase insert when a
    // "quote_interests" table is created in production.
    console.log('[QuoteInterest]', JSON.stringify({
      timestamp: new Date().toISOString(),
      quoteId,
      company: displayName || companyName,
      product,
      price: { monthly: monthlyPrice, yearly: yearlyPrice },
      coverage,
      term,
      policyType,
      user: { name: userName, email: userEmail, phone: userPhone },
    }))

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Quote interest error:', error)
    return NextResponse.json({ error: 'Failed to log interest' }, { status: 500 })
  }
}
