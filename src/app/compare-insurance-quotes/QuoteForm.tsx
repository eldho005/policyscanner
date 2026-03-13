'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { COVERAGE_OPTIONS, calculateInsuranceAge } from '@/lib/helpers'
import { BOOKING_URL } from '@/lib/constants'

interface InsuranceType {
  slug: string
  name: string
}

// Hard-coded insurance types (loaded from Supabase in production, seeded)
const INSURANCE_TYPES: InsuranceType[] = [
  { slug: 'term-life', name: 'Term Life' },
  { slug: 'whole-life', name: 'Whole Life' },
  { slug: 'mortgage-insurance', name: 'Mortgage Insurance' },
  { slug: 'critical-illness', name: 'Critical Illness' },
]

export default function QuoteFormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    type: '',
    province: '',
    gender: '',
    tobacco: '',
    coverage: '1000000',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    fullName: '',
    email: '',
    countryCode: '+1',
    phone: '',
  })

  const [insuranceAge, setInsuranceAge] = useState<number | null>(null)
  const [dobError, setDobError] = useState('')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Pre-fill from query params (for Google Ads landing)
  useEffect(() => {
    const age = searchParams.get('age')
    const gender = searchParams.get('gender')
    const smoking = searchParams.get('smoking')
    const coverage = searchParams.get('coverage')

    if (age && gender && smoking && coverage) {
      const now = new Date()
      const dobYear = now.getFullYear() - parseInt(age)
      const dobMonth = String(now.getMonth() + 1).padStart(2, '0')
      const dobDay = String(now.getDate()).padStart(2, '0')

      setFormData(prev => ({
        ...prev,
        gender: gender === 'male' ? 'M' : 'F',
        tobacco: smoking === 'yes' ? 'Y' : 'N',
        coverage,
        dobDay,
        dobMonth,
        dobYear: String(dobYear),
      }))
      setCurrentStep(1) // still need to select type
    }
  }, [searchParams])

  // Calculate insurance age when DOB changes
  useEffect(() => {
    const { dobDay, dobMonth, dobYear } = formData
    if (dobDay.length === 2 && dobMonth.length === 2 && dobYear.length === 4) {
      const age = calculateInsuranceAge(parseInt(dobDay), parseInt(dobMonth), parseInt(dobYear))
      setInsuranceAge(age)
    } else {
      setInsuranceAge(null)
    }
  }, [formData.dobDay, formData.dobMonth, formData.dobYear])

  const updateField = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setFormErrors(prev => ({ ...prev, [field]: '' }))
  }, [])

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step)
  }, [])

  // Validate DOB
  function validateDob(): boolean {
    const { dobDay, dobMonth, dobYear } = formData
    if (!dobDay || parseInt(dobDay) < 1 || parseInt(dobDay) > 31) {
      setDobError('Enter a valid day (01-31)')
      return false
    }
    if (!dobMonth || parseInt(dobMonth) < 1 || parseInt(dobMonth) > 12) {
      setDobError('Enter a valid month (01-12)')
      return false
    }
    const year = parseInt(dobYear)
    const currentYear = new Date().getFullYear()
    if (!dobYear || year < currentYear - 100 || year > currentYear - 1) {
      setDobError(`Enter a valid year (${currentYear - 100}-${currentYear - 1})`)
      return false
    }
    setDobError('')
    return true
  }

  // Submit quote to API
  async function submitQuote() {
    // Validate step 6 fields
    const errors: Record<string, string> = {}
    if (!formData.fullName.trim()) errors.fullName = 'Name is required'
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Valid email is required'
    if (!formData.phone.trim()) errors.phone = 'Phone number is required'

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.id) {
        // Show final questions (medication/DUI) then redirect
        setQuoteId(data.id)
        setShowFinalQuestions(true)
      }
    } catch {
      console.error('Failed to submit quote')
    } finally {
      setLoading(false)
    }
  }

  // Final questions state (medication + DUI)
  const [quoteId, setQuoteId] = useState<number | null>(null)
  const [showFinalQuestions, setShowFinalQuestions] = useState(false)
  const [finalStep, setFinalStep] = useState(1)
  const [medicationAnswer, setMedicationAnswer] = useState('')
  const [duiAnswer, setDuiAnswer] = useState('')

  function handleFinalContinue() {
    if (finalStep === 1 && medicationAnswer) {
      setFinalStep(2)
    } else if (finalStep === 2 && duiAnswer) {
      // Redirect to results
      setLoading(true)
      router.push(`/quote-results/${quoteId}?medication=${medicationAnswer}&dui=${duiAnswer}`)
    }
  }

  // Province modal
  const [showProvinceModal, setShowProvinceModal] = useState(false)

  const progress = (currentStep / 6) * 100

  return (
    <>
      {/* Loading overlay */}
      {loading && (
        <div className="loading-state">
          <div className="loading-pre"></div>
        </div>
      )}

      {/* Header */}
      <header className="quote-header" role="banner">
        <div className="layout__container">
          <div className="quote-header__inner">
            <a href="/" className="quote-header__logo">PolicyScanner</a>
            <div className="quote-header__progress" aria-live="polite">Step {currentStep} of 6</div>
            {formData.type && (
              <button
                type="button"
                className="quote-header__insurance-type"
                onClick={() => goToStep(1)}
                title="Restart quote"
              >
                <span>{INSURANCE_TYPES.find(t => t.slug === formData.type)?.name || 'Select Type'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="quote-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="quote-progress__bar" style={{ width: `${progress}%` }}></div>
      </div>

      {/* Main Content */}
      <div className="layout__section" id="quote-content">
        <div className="layout__container">

          {/* Step 1: Insurance Type */}
          {currentStep === 1 && (
            <div className="quote-step quote-step--active" id="step1">
              <div className="u-text-center">
                <h1 className="u-sr-only">Compare Life Insurance Quotes in Canada</h1>
                <div style={{ marginBottom: '2rem', marginTop: '2rem' }}>
                  <h2>Select your insurance type</h2>
                  <p className="text-secondary" style={{ fontSize: 'var(--font-size-base)', lineHeight: 1.5, margin: 0 }}>
                    Choose the coverage that fits your needs
                  </p>
                </div>
                <div className="insurance-section">
                  <div className="insurance-section__title">Life Insurance</div>
                  <div className="insurance-grid">
                    {INSURANCE_TYPES.map(type => (
                      <button
                        key={type.slug}
                        type="button"
                        className={`insurance-card${formData.type === type.slug ? ' insurance-card--selected' : ''}`}
                        onClick={() => { updateField('type', type.slug); goToStep(2) }}
                        role="radio"
                        aria-checked={formData.type === type.slug}
                      >
                        <div className="insurance-card__title">{type.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <TrustIndicator />
              </div>
            </div>
          )}

          {/* Step 2: Province */}
          {currentStep === 2 && (
            <div className="quote-step quote-step--active" id="step2">
              <div className="u-text-center">
                <AvatarGreeting text="Hey, I'm Teena! Let's find your perfect coverage." />
                <div style={{ marginBottom: '2rem' }}>
                  <h2>Which province are you in?</h2>
                  <p className="text-secondary" style={{ fontSize: 'var(--font-size-base)', lineHeight: 1.5, margin: 0 }}>
                    We&apos;ll show you quotes available in your area
                  </p>
                </div>
                <fieldset className="selection-grid" style={{ maxWidth: '400px', margin: '0 auto 2rem' }}>
                  <legend className="u-sr-only">Province selection</legend>
                  {[
                    { value: 'ontario', label: 'Ontario' },
                    { value: 'other', label: 'Other Province' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`selection-card${formData.province === opt.value ? ' selection-card--selected' : ''}`}
                      onClick={() => {
                        updateField('province', opt.value)
                        if (opt.value === 'ontario') goToStep(3)
                        else setShowProvinceModal(true)
                      }}
                      role="radio"
                      aria-checked={formData.province === opt.value}
                    >
                      <div className="selection-card__content">
                        <h3 className="selection-card__title">{opt.label}</h3>
                      </div>
                    </button>
                  ))}
                </fieldset>
                <div style={{ marginBottom: '2rem' }}>
                  <button type="button" className="back-button" onClick={() => goToStep(1)}>Back</button>
                </div>
                <TrustIndicator />
              </div>
            </div>
          )}

          {/* Step 3: Gender */}
          {currentStep === 3 && (
            <div className="quote-step quote-step--active" id="step3">
              <div className="u-text-center">
                <AvatarGreeting text="Great choice! Now let's get some details." />
                <div style={{ marginBottom: '2rem' }}>
                  <h2>What is your gender?</h2>
                  <p className="text-secondary" style={{ fontSize: 'var(--font-size-base)', lineHeight: 1.5, margin: 0 }}>
                    This helps us provide more accurate insurance quotes
                  </p>
                </div>
                <fieldset className="selection-grid" style={{ maxWidth: '400px', margin: '0 auto 2rem' }}>
                  <legend className="u-sr-only">Gender selection</legend>
                  {[
                    { value: 'M', label: 'Male' },
                    { value: 'F', label: 'Female' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`selection-card${formData.gender === opt.value ? ' selection-card--selected' : ''}`}
                      onClick={() => { updateField('gender', opt.value); goToStep(4) }}
                    >
                      <div className="selection-card__content">
                        <h3 className="selection-card__title">{opt.label}</h3>
                      </div>
                    </button>
                  ))}
                </fieldset>
                <div style={{ marginBottom: '2rem' }}>
                  <button type="button" className="back-button" onClick={() => goToStep(2)}>Back</button>
                </div>
                <TrustIndicator />
              </div>
            </div>
          )}

          {/* Step 4: Tobacco */}
          {currentStep === 4 && (
            <div className="quote-step quote-step--active" id="step4">
              <div className="u-text-center">
                <AvatarGreeting text="Almost there! Just a few more questions." />
                <div style={{ marginBottom: '2rem' }}>
                  <h2>Have you used tobacco or nicotine in the last 5 years?</h2>
                  <p className="text-secondary" style={{ fontSize: 'var(--font-size-base)', lineHeight: 1.5, margin: 0 }}>
                    Includes cigarettes, cigars, vaping, e-cigarettes, or mixing tobacco with cannabis
                  </p>
                </div>
                <fieldset className="selection-grid" style={{ maxWidth: '400px', margin: '0 auto 2rem' }}>
                  <legend className="u-sr-only">Tobacco use</legend>
                  {[
                    { value: 'Y', label: 'Yes' },
                    { value: 'N', label: 'No' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`selection-card${formData.tobacco === opt.value ? ' selection-card--selected' : ''}`}
                      onClick={() => { updateField('tobacco', opt.value); goToStep(5) }}
                    >
                      <div className="selection-card__content">
                        <h3 className="selection-card__title">{opt.label}</h3>
                      </div>
                    </button>
                  ))}
                </fieldset>
                <div style={{ marginBottom: '2rem' }}>
                  <button type="button" className="back-button" onClick={() => goToStep(3)}>Back</button>
                </div>
                <TrustIndicator />
              </div>
            </div>
          )}

          {/* Step 5: Coverage & DOB */}
          {currentStep === 5 && (
            <div className="quote-step quote-step--active" id="step5">
              <div className="u-text-center">
                <AvatarGreeting text="Perfect! Now let's calculate your rates." />
                <div style={{ marginBottom: '2rem' }}>
                  <h2>Almost there! Let&apos;s find your best rates</h2>
                  <p className="text-secondary" style={{ fontSize: 'var(--font-size-base)', lineHeight: 1.5, margin: 0 }}>
                    Provide the following details for accurate quotes
                  </p>
                </div>
                <div className="form-step">
                  <form className="form" onSubmit={e => e.preventDefault()}>
                    <div className="form-row">
                      <div className="form-col">
                        <div className="form__group">
                          <label htmlFor="coverageAmount" className="form__label">How much coverage do you need?</label>
                          <select
                            className="form__control"
                            id="coverageAmount"
                            value={formData.coverage}
                            onChange={e => updateField('coverage', e.target.value)}
                          >
                            {Object.entries(COVERAGE_OPTIONS).map(([key, label]) => (
                              <option key={key} value={key}>
                                ${label}{key === '1000000' ? ' (Most popular)' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-col">
                        <div className="form__group">
                          <fieldset>
                            <legend className="form__label">Date of birth</legend>
                            <div className="dob-input-wrapper">
                              <div className="dob-inputs" role="group">
                                <div className="dob-field">
                                  <input
                                    type="text"
                                    className="form__control"
                                    placeholder="DD"
                                    maxLength={2}
                                    inputMode="numeric"
                                    value={formData.dobDay}
                                    onChange={e => updateField('dobDay', e.target.value.replace(/\D/g, ''))}
                                  />
                                </div>
                                <div className="dob-field">
                                  <input
                                    type="text"
                                    className="form__control"
                                    placeholder="MM"
                                    maxLength={2}
                                    inputMode="numeric"
                                    value={formData.dobMonth}
                                    onChange={e => updateField('dobMonth', e.target.value.replace(/\D/g, ''))}
                                  />
                                </div>
                                <div className="dob-field">
                                  <input
                                    type="text"
                                    className="form__control"
                                    placeholder="YYYY"
                                    maxLength={4}
                                    inputMode="numeric"
                                    value={formData.dobYear}
                                    onChange={e => updateField('dobYear', e.target.value.replace(/\D/g, ''))}
                                  />
                                </div>
                              </div>
                            </div>
                          </fieldset>
                          {dobError && <div className="form__error" role="alert">{dobError}</div>}
                        </div>
                      </div>
                    </div>

                    {insuranceAge !== null && (
                      <div className="insurance-age-display" style={{ marginTop: '0.5rem' }}>
                        <div className="insurance-age-label">
                          <span style={{ fontWeight: 500 }}>Insurance Age:</span>
                          <span className="insurance-age-value">{insuranceAge}</span>
                        </div>
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.8125rem', color: 'var(--secondary-text)' }}>
                          If your next birthday is in under 6 months, insurers use that age.
                        </p>
                      </div>
                    )}

                    <div className="button-actions">
                      <button type="button" className="back-button" onClick={() => goToStep(4)}>Back</button>
                      <button
                        type="button"
                        className="button button--primary"
                        onClick={() => { if (validateDob()) goToStep(6) }}
                      >
                        Continue
                      </button>
                    </div>
                  </form>
                </div>
                <TrustIndicator />
              </div>
            </div>
          )}

          {/* Step 6: Contact Details */}
          {currentStep === 6 && (
            <div className="quote-step quote-step--active" id="step6">
              <div className="u-text-center">
                <AvatarGreeting text="Almost there! Let's find coverage that's perfect for you." />
                <div className="form-header">
                  <h2>Your life insurance options are ready</h2>
                  <p className="text-secondary form-header__subtitle">
                    We&apos;ll show you the best plans and help you choose
                  </p>
                </div>
                <div className="form-step">
                  <form className="form" onSubmit={e => e.preventDefault()} noValidate>
                    <div className="form__group">
                      <label htmlFor="fullName" className="form__label">Name</label>
                      <input
                        type="text"
                        className="form__control"
                        id="fullName"
                        placeholder="Your full name"
                        value={formData.fullName}
                        onChange={e => updateField('fullName', e.target.value)}
                        autoComplete="name"
                      />
                      {formErrors.fullName && <div className="form__error" role="alert">{formErrors.fullName}</div>}
                    </div>

                    <div className="form__group">
                      <label htmlFor="email" className="form__label">Email</label>
                      <input
                        type="email"
                        className="form__control"
                        id="email"
                        placeholder="you@email.com"
                        value={formData.email}
                        onChange={e => updateField('email', e.target.value)}
                        autoComplete="email"
                      />
                      {formErrors.email && <div className="form__error" role="alert">{formErrors.email}</div>}
                    </div>

                    <div className="form__group">
                      <label htmlFor="phone" className="form__label">Phone</label>
                      <div className="phone-input-group">
                        <select
                          className="form__control"
                          id="countryCode"
                          value={formData.countryCode}
                          onChange={e => updateField('countryCode', e.target.value)}
                        >
                          <option value="+1">CA +1</option>
                          <option value="+1">US +1</option>
                          <option value="+44">UK +44</option>
                          <option value="+61">AU +61</option>
                          <option value="+91">IN +91</option>
                        </select>
                        <input
                          type="tel"
                          className="form__control"
                          id="phone"
                          placeholder="(123) 456-7890"
                          value={formData.phone}
                          onChange={e => updateField('phone', e.target.value)}
                          autoComplete="tel"
                        />
                      </div>
                      <p className="micro-text">We never spam or share your number</p>
                      {formErrors.phone && <div className="form__error" role="alert">{formErrors.phone}</div>}
                    </div>

                    <div className="button-actions">
                      <button type="button" className="back-button" onClick={() => goToStep(5)}>Back</button>
                      <button
                        type="button"
                        className="button button--primary"
                        onClick={submitQuote}
                        disabled={loading}
                      >
                        {loading ? 'Processing...' : 'Get My Quotes'}
                      </button>
                    </div>
                  </form>
                </div>
                <div className="terms-statement">
                  By clicking &quot;Get My Quotes&quot;, you agree to our{' '}
                  <a href="/terms-of-service" target="_blank">Terms</a> &{' '}
                  <a href="/privacy-policy" target="_blank">Privacy Policy</a>
                </div>
                <TrustIndicator />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Province Modal */}
      {showProvinceModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <button type="button" className="modal-close" onClick={() => setShowProvinceModal(false)}>
                &times;
              </button>
              <h3 className="modal-header__title">Outside Ontario?</h3>
              <p className="modal-header__subtitle">
                We&apos;re currently offering online services in Ontario only, but our licensed advisors can help you find great coverage anywhere in Canada.
              </p>
            </div>
            <div className="modal-body">
              <div className="modal-actions">
                <a href={BOOKING_URL} className="button button--primary">Schedule a Free Call</a>
                <button type="button" className="button button--outline" onClick={() => setShowProvinceModal(false)}>
                  Get Notified
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Final Questions Modal */}
      {showFinalQuestions && (
        <div className="final-questions-modal" style={{ display: 'flex' }} role="dialog" aria-modal="true">
          <div className="final-questions-card">
            <div className="final-questions-header">
              <div className="final-questions-progress">Question {finalStep} of 2</div>
              <h3 className="final-questions-title">Just 2 more quick questions</h3>
              <p className="final-questions-subtitle">This helps us refine your quotes to get you the best rates</p>
            </div>
            <div className="final-questions-body">
              <div className="question-content">
                <div className="question-text">
                  {finalStep === 1
                    ? 'Do you take medication for high blood pressure or cholesterol?'
                    : 'Have you had any impaired driving incidents (DUI/DWI) in the past 5 years?'}
                </div>
                <fieldset className="selection-grid" style={{ maxWidth: '100%', marginBottom: 0 }}>
                  <legend className="u-sr-only">Answer options</legend>
                  {['yes', 'no'].map(answer => {
                    const selected = finalStep === 1
                      ? medicationAnswer === answer
                      : duiAnswer === answer
                    return (
                      <button
                        key={answer}
                        type="button"
                        className={`selection-card${selected ? ' selection-card--selected' : ''}`}
                        onClick={() => {
                          if (finalStep === 1) setMedicationAnswer(answer)
                          else setDuiAnswer(answer)
                        }}
                      >
                        <div className="selection-card__content">
                          <h3 className="selection-card__title">{answer === 'yes' ? 'Yes' : 'No'}</h3>
                        </div>
                      </button>
                    )
                  })}
                </fieldset>
              </div>
              <div className="final-questions-actions">
                {finalStep === 2 && (
                  <button type="button" className="back-button" onClick={() => setFinalStep(1)}>Back</button>
                )}
                <button
                  type="button"
                  className="button button--primary"
                  disabled={finalStep === 1 ? !medicationAnswer : !duiAnswer}
                  onClick={handleFinalContinue}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function AvatarGreeting({ text }: { text: string }) {
  return (
    <div className="avatar-greeting">
      <img
        src="https://res.cloudinary.com/dy4lolmvf/image/upload/v1748295431/teena_eqlxvi.png"
        alt="Teena, PolicyScanner advisor"
        className="avatar-greeting__image"
        width={56}
        height={56}
      />
      <p className="avatar-greeting__text">{text}</p>
    </div>
  )
}

function TrustIndicator() {
  return (
    <div className="trust-indicator">
      <div className="trust-indicator__logos">
        <img
          src="https://res.cloudinary.com/dy4lolmvf/image/upload/v1751082925/cloudflare-svgrepo-com_hyd4il.svg"
          alt="Cloudflare security"
          className="trust-indicator__logo trust-indicator__logo--cloudflare"
          width={32}
          height={32}
        />
        <img
          src="https://res.cloudinary.com/dy4lolmvf/image/upload/v1751082817/Amazon_Web_Services_Logo_zgwjem.svg"
          alt="AWS hosting"
          className="trust-indicator__logo trust-indicator__logo--aws"
          width={24}
          height={24}
        />
      </div>
      <div className="trust-indicator__subtext">Safe | Secure | Privacy protected</div>
    </div>
  )
}
