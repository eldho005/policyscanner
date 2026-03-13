import type { Metadata } from 'next'
import { createServerSupabase } from '@/lib/supabase-server'
import { coverageLabel } from '@/lib/helpers'
import { BOOKING_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Thank You | PolicyScanner',
}

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ quote: string }>
}) {
  const { quote: encodedId } = await params

  // Decode the base64url ID
  let rateId: number
  try {
    rateId = parseInt(Buffer.from(encodedId, 'base64url').toString())
  } catch {
    return <NotFound />
  }

  const supabase = createServerSupabase()
  const { data: rate } = await supabase
    .from('quotation_form_rates')
    .select('*, quotation_forms:quotation_form_id(*)')
    .eq('id', rateId)
    .single()

  if (!rate) return <NotFound />

  const anotherQuoteUrl = `/quote-results/${rate.quotation_form_id}?medication=${rate.quotation_forms?.medication || 'N'}&dui=${rate.quotation_forms?.dui || 'N'}`

  return (
    <>
      <link rel="stylesheet" href="/css/global_quote.css" precedence="default" />
      <link rel="stylesheet" href="/css/details_page.css" precedence="default" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" precedence="low" />

      <header className="quote-header">
        <div className="quote-header__content">
          <div className="quote-header__brand">
            <div className="quote-header__left-section">
              <h1 className="quote-header__logo"><a href="/">PolicyScanner</a></h1>
            </div>
          </div>
        </div>
      </header>

      <main className="layout__container" style={{ paddingTop: '3rem', paddingBottom: '3rem', maxWidth: '640px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ marginBottom: '0.5rem' }}>Great Choice!</h2>
          <p style={{ color: 'var(--secondary-text)', marginBottom: '2rem' }}>
            You&apos;ve selected a rate from <strong>{rate.company_name}</strong>.
            Our team will reach out to help you with the next steps.
          </p>

          <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: '0.25rem' }}>Monthly</p>
                <p style={{ fontWeight: 600 }}>${rate.monthly_price}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: '0.25rem' }}>Annual</p>
                <p style={{ fontWeight: 600 }}>${rate.yearly_price}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: '0.25rem' }}>Coverage</p>
                <p style={{ fontWeight: 600 }}>${coverageLabel(rate.coverage || '')}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: '0.25rem' }}>Term</p>
                <p style={{ fontWeight: 600 }}>{rate.term}</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a href={BOOKING_URL} className="button button--primary" style={{ width: '100%' }}>
              Schedule a Call with an Advisor
            </a>
            <a href={anotherQuoteUrl} className="button button--outline" style={{ width: '100%' }}>
              Compare More Quotes
            </a>
          </div>
        </div>
      </main>
    </>
  )
}

function NotFound() {
  return (
    <main style={{ textAlign: 'center', padding: '6rem 1rem' }}>
      <h2>Quote not found</h2>
      <p>This link may have expired.</p>
      <a href="/compare-insurance-quotes" className="button button--primary" style={{ marginTop: '1rem' }}>
        Get a New Quote
      </a>
    </main>
  )
}
