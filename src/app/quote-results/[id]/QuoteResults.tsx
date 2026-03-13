'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { COVERAGE_OPTIONS, coverageLabel, companySlug, TERM_LIFE_WITHOUT_MED_COMP_IDS } from '@/lib/helpers'
import { BOOKING_URL } from '@/lib/constants'

interface CompulifeResult {
  Compulife_company: string
  Compulife_product: string
  Compulife_premiumM: string
  Compulife_premiumAnnual?: string
  Compulife_premiumA?: string
  Compulife_rating: string
  Compulife_category: string
  Compulife_compprodcode?: string
  [key: string]: string | undefined
}

interface Company {
  id: number
  company_name: string
  display_name: string
  company_code: string
  started_year: string
  am_best_rating: string
  market_scope: string
  headquarters: string
  insurance_riders?: Rider[]
}

interface Rider {
  id: number
  rider: string
  icon: string
  rider_type: string
  plan_type: string
  company_id: number
}

interface Term {
  id: number
  name: string
  code: string
  value: number
  type_id: number
  type?: { slug: string }
}

interface QuoteInfo {
  id: number
  age: number
  coverage: string
  medication: string
  dui: string
  data: {
    name: string
    email: string
    gender: string
    tobacco: string
    dobDay: string
    dobMonth: string
    dobYear: string
    phoneNumber?: string
  }
}

interface ProcessedCard {
  index: number
  companyName: string
  displayName: string
  slug: string
  imageUrl: string
  monthlyPrice: string
  yearlyPrice: string
  tag: string
  tagId: string
  isNoMedical: boolean
  isMedical: boolean
  isBestValue: boolean
  ageUntil: number
  company: Company
  prodCode: string
  freeRiders: Rider[]
  paidRiders: Rider[]
}

export default function QuoteResultsClient() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const quoteId = params.id as string

  const [loading, setLoading] = useState(true)
  const [cards, setCards] = useState<ProcessedCard[]>([])
  const [quote, setQuote] = useState<QuoteInfo | null>(null)
  const [currentTerm, setCurrentTerm] = useState<Term | null>(null)
  const [terms, setTerms] = useState<Term[]>([])
  const [companies, setCompanies] = useState<Company[]>([])

  // Filter state
  const [selectedCoverage, setSelectedCoverage] = useState(searchParams.get('coverage') || '')
  const [selectedTerm, setSelectedTerm] = useState(searchParams.get('term') || '')
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '')
  const [filterType, setFilterType] = useState(searchParams.get('filter') || 'all')
  const [premiumMode, setPremiumMode] = useState<'monthly' | 'yearly'>('monthly')

  // Sidebar state
  const [selectedPlan, setSelectedPlan] = useState<ProcessedCard | null>(null)
  const [showPlanDetails, setShowPlanDetails] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [ratingLoading, setRatingLoading] = useState(false)

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: '', email: '', phone: '', gender: 'male', dobDay: '', dobMonth: '', dobYear: '',
    smoking: 'no', dui: 'no', bpMeds: 'no',
  })

  const medication = searchParams.get('medication') || 'N'
  const dui = searchParams.get('dui') || 'N'

  // Fetch quotes
  const fetchQuotes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/compulife', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteId,
          term: selectedTerm || undefined,
          medication,
          dui,
          gfilter: searchParams.get('gfilter'),
        }),
      })
      const data = await res.json()
      if (data.error) { console.error(data.error); return }

      setQuote(data.quote)
      setCurrentTerm(data.currentTerm)
      setCompanies(data.companies || [])

      // Also fetch terms for this type
      const termsRes = await fetch(`/api/terms?type_id=${data.quote.type || data.currentTerm?.type_id}`)
      if (termsRes.ok) {
        const termsData = await termsRes.json()
        setTerms(termsData.terms || [])
      }

      if (!selectedCoverage) setSelectedCoverage(data.quote.coverage)

      // Process Compulife results into cards
      const allResults: CompulifeResult[] = []
      const responseData = data.results

      if (responseData?.Compulife_ComparisonResults) {
        for (const termBlock of responseData.Compulife_ComparisonResults) {
          for (const result of termBlock.Compulife_Results) {
            allResults.push(result)
          }
        }
      }

      const slugType = data.currentTerm?.type?.slug || ''
      const seen = new Set<string>()
      const processed: ProcessedCard[] = []

      for (let i = 0; i < allResults.length; i++) {
        const list = allResults[i]
        const compName = list.Compulife_company
        const matchedComp = (data.companies as Company[]).find(
          c => c.display_name?.toLowerCase() === compName?.toLowerCase()
        )
        if (!matchedComp) continue
        if (seen.has(matchedComp.company_name)) continue
        seen.add(matchedComp.company_name)

        const prodCode = list.Compulife_compprodcode || ''
        const isNoMedical = slugType === 'term-life' && TERM_LIFE_WITHOUT_MED_COMP_IDS.includes(prodCode)
        const isMedical = slugType === 'term-life' && !isNoMedical
        const isBestValue = processed.length < 2 && !isNoMedical

        let ageUntil = 0
        if (data.currentTerm && ['H', 'J', 'S'].includes(data.currentTerm.code)) {
          ageUntil = 100
        } else if (data.currentTerm) {
          ageUntil = (data.currentTerm.value || 0) + (data.quote.age || 0)
        }

        const slug = companySlug(matchedComp.display_name || '')
        const freeRiders = (matchedComp.insurance_riders || []).filter(
          (r: Rider) => r.plan_type === slugType && r.rider_type === 'Free'
        )
        const paidRiders = (matchedComp.insurance_riders || []).filter(
          (r: Rider) => r.plan_type === slugType && r.rider_type === 'Paid'
        )

        processed.push({
          index: i,
          companyName: matchedComp.company_name,
          displayName: matchedComp.display_name,
          slug,
          imageUrl: `/comp/${slug}.webp`,
          monthlyPrice: list.Compulife_premiumM,
          yearlyPrice: list.Compulife_premiumAnnual || list.Compulife_premiumA || '',
          tag: isBestValue ? '★ Best Value' : isNoMedical ? 'No Medical' : '',
          tagId: isBestValue ? 'best_value' : isNoMedical ? 'no_medical' : '',
          isNoMedical,
          isMedical,
          isBestValue,
          ageUntil,
          company: matchedComp,
          prodCode,
          freeRiders,
          paidRiders,
        })
      }

      setCards(processed)
    } catch (err) {
      console.error('Failed to fetch quotes:', err)
    } finally {
      setLoading(false)
    }
  }, [quoteId, selectedTerm, medication, dui, searchParams, selectedCoverage])

  useEffect(() => { fetchQuotes() }, [fetchQuotes])

  // Prefill profile form when quote loads
  useEffect(() => {
    if (quote?.data) {
      setProfileForm({
        name: quote.data.name || '',
        email: quote.data.email || '',
        phone: quote.data.phoneNumber || '',
        gender: quote.data.gender === 'M' ? 'male' : 'female',
        dobDay: quote.data.dobDay || '',
        dobMonth: quote.data.dobMonth || '',
        dobYear: quote.data.dobYear || '',
        smoking: quote.data.tobacco === 'Y' ? 'yes' : 'no',
        dui: dui === 'Y' ? 'yes' : 'no',
        bpMeds: medication === 'Y' ? 'yes' : 'no',
      })
    }
  }, [quote, medication, dui])

  // Filter/navigate handler
  function handleFilterChange(newCoverage?: string, newTerm?: string, newType?: string) {
    const cov = newCoverage || selectedCoverage
    const trm = newTerm || selectedTerm
    const typ = newType || selectedType
    const url = `/quote-results/${quoteId}?medication=${medication}&dui=${dui}&term=${trm}&coverage=${cov}&type=${typ}&filter=${filterType}`
    router.push(url)
  }

  // Rate selection
  async function handleGetRate(card: ProcessedCard) {
    setRatingLoading(true)
    try {
      const res = await fetch(`/api/quote/${quoteId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: card.companyName,
          tag: card.tag,
          monthly_price: card.monthlyPrice,
          yearly_price: card.yearlyPrice,
          coverage_key: quote?.coverage,
          term: currentTerm?.name,
          age_until: card.ageUntil,
        }),
      })
      const data = await res.json()
      if (data.url) {
        router.push(data.url)
      }
    } catch (err) {
      console.error('Rate selection failed:', err)
    } finally {
      setRatingLoading(false)
    }
  }

  // Profile update
  async function handleProfileUpdate() {
    try {
      await fetch(`/api/quote/${quoteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      })
      setShowEditProfile(false)
      handleFilterChange()
    } catch (err) {
      console.error('Profile update failed:', err)
    }
  }

  // Filter cards by type
  const filteredCards = cards.filter(card => {
    if (filterType === 'all') return true
    if (filterType === 'with-medical') return card.isMedical
    if (filterType === 'no-medical') return card.isNoMedical
    if (filterType === 'best-value') return card.isBestValue
    return true
  })

  const slugType = currentTerm?.type?.slug || ''

  return (
    <>
      {/* Loading overlay */}
      {(loading || ratingLoading) && (
        <div className="loading-state">
          <div className="loading-pre"></div>
        </div>
      )}

      {/* Quote Header */}
      <header className="quote-header">
        <div className="quote-header__content">
          <div className="quote-header__brand">
            <div className="quote-header__left-section">
              <h1 className="quote-header__logo"><a href="/">PolicyScanner</a></h1>
              <nav className="quote-header__nav">
                <a href="#" className="quote-header__nav-item">
                  {currentTerm?.type?.slug?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Insurance
                </a>
              </nav>
            </div>
            <div className="quote-header__actions">
              <div className="quote-header__user-section" onClick={() => setShowEditProfile(true)} style={{ cursor: 'pointer' }}>
                <div className="quote-header__user-icon"><i className="bi bi-person"></i></div>
                <span className="quote-header__user-text">Edit Profile</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="quote-header__controls">
            <div className="quote-header__form-row">
              <div className="quote-header__form-left">
                <div className="quote-header__field">
                  <label className="quote-header__label">Coverage:</label>
                  <select
                    className="quote-header__select coverage"
                    value={selectedCoverage}
                    onChange={e => { setSelectedCoverage(e.target.value); handleFilterChange(e.target.value) }}
                  >
                    {Object.entries(COVERAGE_OPTIONS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="quote-header__form-center">
                <div className="quote-header__field">
                  <label className="quote-header__label">Term:</label>
                  <select
                    className="quote-header__select terms"
                    value={selectedTerm}
                    onChange={e => { setSelectedTerm(e.target.value); handleFilterChange(undefined, e.target.value) }}
                  >
                    {terms.map(t => (
                      <option key={t.code} value={t.code}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="quote-header__form-right">
                <div className="quote-header__toggle-container">
                  <label className="quote-header__label">Period:</label>
                  <div className="quote-header__toggle period-toggle">
                    <button
                      className={`quote-header__toggle-btn${premiumMode === 'monthly' ? ' quote-header__toggle-btn--active' : ''}`}
                      onClick={() => setPremiumMode('monthly')}
                    >Month</button>
                    <button
                      className={`quote-header__toggle-btn${premiumMode === 'yearly' ? ' quote-header__toggle-btn--active' : ''}`}
                      onClick={() => setPremiumMode('yearly')}
                    >Year</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="quote-header__filters">
            <button
              className={`quote-header__filter${filterType === 'all' ? ' quote-header__filter--active' : ''}`}
              onClick={() => setFilterType('all')}
            >All</button>
            {slugType === 'term-life' && (
              <>
                <button
                  className={`quote-header__filter${filterType === 'with-medical' ? ' quote-header__filter--active' : ''}`}
                  onClick={() => setFilterType('with-medical')}
                >With Medical</button>
                <button
                  className={`quote-header__filter${filterType === 'no-medical' ? ' quote-header__filter--active' : ''}`}
                  onClick={() => setFilterType('no-medical')}
                >No Medical</button>
              </>
            )}
            {['whole-life', 'mortgage'].includes(slugType) && (
              <button
                className={`quote-header__filter${filterType === 'best-value' ? ' quote-header__filter--active' : ''}`}
                onClick={() => setFilterType('best-value')}
              >Best Value</button>
            )}
          </div>
        </div>
      </header>

      {/* Feedback notification */}
      <div className="quote-feedback" id="quoteFeedback">
        <div className="quote-feedback__icon" id="feedbackIcon"><i className="bi bi-arrow-clockwise"></i></div>
        <p className="quote-feedback__text" id="feedbackText">Updating your quotes...</p>
      </div>

      {/* Main Content */}
      <div className="layout__container">
        <div className="quote-layout">
          <div className="quote-cards-column">
            {!loading && filteredCards.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <h3>No quotes found</h3>
                <p>Try adjusting your filters or coverage amount.</p>
              </div>
            )}

            {filteredCards.map(card => (
              <article
                key={`${card.companyName}-${card.index}`}
                className={`card quote-card${card.isMedical ? ' with-medical' : ''}${card.isNoMedical ? ' no-medical' : ''}${card.isBestValue ? ' best-value' : ''}`}
              >
                <header className="quote-card__header">
                  <div className="quote-card__company">
                    <div className="quote-card__logo">
                      <img src={card.imageUrl} alt={card.companyName} />
                    </div>
                    <div className="quote-card__badges">
                      {card.isBestValue && (
                        <span className="quote-card__badge quote-card__badge--best-value">★ Best Value</span>
                      )}
                      {card.isNoMedical && (
                        <span className="quote-card__badge quote-card__badge--no-medical">No Medical</span>
                      )}
                    </div>
                  </div>

                  <div className={`quote-card__price${premiumMode === 'monthly' ? '' : ' hide'}`} style={premiumMode === 'monthly' ? {} : { display: 'none' }}>
                    <h3 className="quote-card__price-amount">${card.monthlyPrice}</h3>
                    <p className="quote-card__price-period">per month</p>
                  </div>
                  <div className={`quote-card__price${premiumMode === 'yearly' ? '' : ' hide'}`} style={premiumMode === 'yearly' ? {} : { display: 'none' }}>
                    <h3 className="quote-card__price-amount">${card.yearlyPrice}</h3>
                    <p className="quote-card__price-period">per year</p>
                  </div>
                </header>

                <section className="quote-card__policy">
                  <div className="quote-card__policy-grid u-text-center">
                    <div>
                      <p className="quote-card__policy-label">Coverage</p>
                      <p className="quote-card__policy-value">${coverageLabel(quote?.coverage || '')}</p>
                    </div>
                    <div>
                      <p className="quote-card__policy-label">Term</p>
                      <p className="quote-card__policy-value">{currentTerm?.name}</p>
                    </div>
                    <div>
                      <p className="quote-card__policy-label">Covered Until</p>
                      <p className="quote-card__policy-value">Age {card.ageUntil}</p>
                    </div>
                  </div>
                </section>

                {/* Riders */}
                {(card.freeRiders.length > 0 || card.paidRiders.length > 0) && (
                  <RiderSection card={card} />
                )}

                <footer className="quote-card__actions">
                  <button
                    className="button button--outline"
                    onClick={() => { setSelectedPlan(card); setShowPlanDetails(true) }}
                  >
                    View Plan Details
                  </button>
                  <button
                    className="button button--primary"
                    onClick={() => handleGetRate(card)}
                    disabled={ratingLoading}
                  >
                    Get This Rate
                  </button>
                </footer>
              </article>
            ))}
          </div>

          {/* Companion Cards */}
          <div className="companion-cards-column">
            <article className="card">
              <div className="companion-card__header u-flex u-align-center">
                <div className="companion-card__icon"><i className="bi bi-calendar-check"></i></div>
                <h4 className="companion-card__title">Schedule a Call</h4>
              </div>
              <p className="companion-card__subtitle">Talk to a licensed advisor.</p>
              <a href={BOOKING_URL} className="button button--primary">Pick a Time</a>
            </article>

            <article className="card">
              <div className="companion-card__header u-flex u-align-center">
                <div className="companion-card__icon"><i className="bi bi-star-fill"></i></div>
                <h4 className="companion-card__title">Enjoying PolicyScanner?</h4>
              </div>
              <p className="companion-card__subtitle">We&apos;d love your feedback!</p>
              <a href="https://g.page/r/CSTWjjGbW_3gEBM/review" className="button button--outline">Leave a Review</a>
            </article>
          </div>
        </div>
      </div>

      {/* Plan Details Sidebar */}
      {showPlanDetails && selectedPlan && (
        <div className="sidebar sidebar--active" id="planDetailsSidebar">
          <div className="sidebar__overlay" onClick={() => setShowPlanDetails(false)}></div>
          <div className="sidebar__content">
            <div className="sidebar__header">
              <h2>Plan Details</h2>
              <button className="sidebar__close" onClick={() => setShowPlanDetails(false)}>&times;</button>
            </div>
            <div className="sidebar__body">
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <img src={selectedPlan.imageUrl} alt={selectedPlan.companyName} style={{ height: '48px' }} />
                <h3 style={{ marginTop: '0.5rem' }}>{selectedPlan.companyName}</h3>
              </div>
              <div className="plan-details__grid">
                <div className="plan-details__item">
                  <span className="plan-details__label">Monthly Premium</span>
                  <span className="plan-details__value">${selectedPlan.monthlyPrice}</span>
                </div>
                <div className="plan-details__item">
                  <span className="plan-details__label">Annual Premium</span>
                  <span className="plan-details__value">${selectedPlan.yearlyPrice}</span>
                </div>
                <div className="plan-details__item">
                  <span className="plan-details__label">Coverage Amount</span>
                  <span className="plan-details__value">${coverageLabel(quote?.coverage || '')}</span>
                </div>
                <div className="plan-details__item">
                  <span className="plan-details__label">Term</span>
                  <span className="plan-details__value">{currentTerm?.name}</span>
                </div>
                <div className="plan-details__item">
                  <span className="plan-details__label">Covered Until</span>
                  <span className="plan-details__value">Age {selectedPlan.ageUntil}</span>
                </div>
                {selectedPlan.company.am_best_rating && (
                  <div className="plan-details__item">
                    <span className="plan-details__label">AM Best Rating</span>
                    <span className="plan-details__value">{selectedPlan.company.am_best_rating}</span>
                  </div>
                )}
                {selectedPlan.company.started_year && (
                  <div className="plan-details__item">
                    <span className="plan-details__label">Founded</span>
                    <span className="plan-details__value">{selectedPlan.company.started_year}</span>
                  </div>
                )}
                {selectedPlan.company.headquarters && (
                  <div className="plan-details__item">
                    <span className="plan-details__label">Headquarters</span>
                    <span className="plan-details__value">{selectedPlan.company.headquarters}</span>
                  </div>
                )}
              </div>
              <div style={{ marginTop: '2rem' }}>
                <button
                  className="button button--primary"
                  style={{ width: '100%' }}
                  onClick={() => handleGetRate(selectedPlan)}
                  disabled={ratingLoading}
                >
                  Get This Rate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Sidebar */}
      {showEditProfile && (
        <div className="sidebar sidebar--active" id="editProfileSidebar">
          <div className="sidebar__overlay" onClick={() => setShowEditProfile(false)}></div>
          <div className="sidebar__content">
            <div className="sidebar__header">
              <h2>Edit Profile</h2>
              <button className="sidebar__close" onClick={() => setShowEditProfile(false)}>&times;</button>
            </div>
            <div className="sidebar__body">
              <div className="form__group">
                <label className="form__label">Name</label>
                <input className="form__control" value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="form__group">
                <label className="form__label">Email</label>
                <input className="form__control" value={profileForm.email} onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="form__group">
                <label className="form__label">Phone</label>
                <input className="form__control" value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="form__group">
                <label className="form__label">Gender</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['male', 'female'].map(g => (
                    <button
                      key={g}
                      type="button"
                      className={`button ${profileForm.gender === g ? 'button--primary' : 'button--outline'}`}
                      onClick={() => setProfileForm(p => ({ ...p, gender: g }))}
                    >{g === 'male' ? 'Male' : 'Female'}</button>
                  ))}
                </div>
              </div>
              <div className="form__group">
                <label className="form__label">Date of Birth</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input className="form__control" placeholder="DD" maxLength={2} value={profileForm.dobDay}
                    onChange={e => setProfileForm(p => ({ ...p, dobDay: e.target.value }))} style={{ width: '60px' }} />
                  <input className="form__control" placeholder="MM" maxLength={2} value={profileForm.dobMonth}
                    onChange={e => setProfileForm(p => ({ ...p, dobMonth: e.target.value }))} style={{ width: '60px' }} />
                  <input className="form__control" placeholder="YYYY" maxLength={4} value={profileForm.dobYear}
                    onChange={e => setProfileForm(p => ({ ...p, dobYear: e.target.value }))} style={{ flex: 1 }} />
                </div>
              </div>
              <div className="form__group">
                <label className="form__label">Smoker?</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['yes', 'no'].map(v => (
                    <button key={v} type="button"
                      className={`button ${profileForm.smoking === v ? 'button--primary' : 'button--outline'}`}
                      onClick={() => setProfileForm(p => ({ ...p, smoking: v }))}
                    >{v === 'yes' ? 'Yes' : 'No'}</button>
                  ))}
                </div>
              </div>
              <div className="form__group">
                <label className="form__label">Blood Pressure / Cholesterol Meds?</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['yes', 'no'].map(v => (
                    <button key={v} type="button"
                      className={`button ${profileForm.bpMeds === v ? 'button--primary' : 'button--outline'}`}
                      onClick={() => setProfileForm(p => ({ ...p, bpMeds: v }))}
                    >{v === 'yes' ? 'Yes' : 'No'}</button>
                  ))}
                </div>
              </div>
              <div className="form__group">
                <label className="form__label">DUI/DWI in past 5 years?</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['yes', 'no'].map(v => (
                    <button key={v} type="button"
                      className={`button ${profileForm.dui === v ? 'button--primary' : 'button--outline'}`}
                      onClick={() => setProfileForm(p => ({ ...p, dui: v }))}
                    >{v === 'yes' ? 'Yes' : 'No'}</button>
                  ))}
                </div>
              </div>
              <button
                className="button button--primary"
                style={{ width: '100%', marginTop: '1.5rem' }}
                onClick={handleProfileUpdate}
              >
                Update & Refresh Quotes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function RiderSection({ card }: { card: ProcessedCard }) {
  const [activeTab, setActiveTab] = useState<'free' | 'paid'>('free')

  return (
    <section className="quote-card__features">
      <div className="quote-card__features-header">
        <div className="quote-card__features-toggle">
          {card.freeRiders.length > 0 && (
            <button
              className={`quote-card__features-tab${activeTab === 'free' ? ' quote-card__features-tab--active' : ''}`}
              onClick={() => setActiveTab('free')}
            >
              <span className="quote-card__features-title">Included Features</span>
            </button>
          )}
          {card.paidRiders.length > 0 && (
            <button
              className={`quote-card__features-tab${activeTab === 'paid' ? ' quote-card__features-tab--active' : ''}`}
              onClick={() => setActiveTab('paid')}
            >
              <span className="quote-card__features-title">Paid Riders</span>
            </button>
          )}
        </div>
      </div>
      <div className="quote-card__features-content">
        {activeTab === 'free' && card.freeRiders.length > 0 && (
          <div className="quote-card__features-panel quote-card__features-panel--active">
            <div className="quote-card__features-list">
              {card.freeRiders.map(r => (
                <div key={r.id} className="quote-card__feature-item">
                  <span dangerouslySetInnerHTML={{ __html: r.icon || '' }} />
                  <span>{r.rider}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'paid' && card.paidRiders.length > 0 && (
          <div className="quote-card__features-panel quote-card__features-panel--active">
            <div className="quote-card__features-list">
              {card.paidRiders.map(r => (
                <div key={r.id} className="quote-card__feature-item">
                  <span dangerouslySetInnerHTML={{ __html: r.icon || '' }} />
                  <span>{r.rider}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
