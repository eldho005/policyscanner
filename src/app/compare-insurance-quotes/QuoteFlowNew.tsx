'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type FormData = {
  type: string | null
  province: string | null
  gender: string | null
  tobacco: string | null
  meds: string | null
  dui: string | null
  coverage: string
  dobDay: string
  dobMonth: string
  dobYear: string
  name: string
  email: string
  phone: string
}

type LogItem = { text: string; done: boolean }

const STYLE_DEFAULT = 'bg-white border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
const STYLE_SELECTED = 'bg-slate-100 border-slate-800 text-slate-900 ring-1 ring-slate-800 shadow-sm'

function SelectCard({
  selected,
  onClick,
  children,
  className = '',
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex items-center gap-3 w-full p-4 text-left border rounded-lg active:scale-[0.99] transition-all duration-150 transform ${className} ${
        selected ? STYLE_SELECTED : STYLE_DEFAULT
      }`}
    >
      {children}
    </button>
  )
}

function TwoOptionCard({
  selected,
  onClick,
  label,
}: {
  selected: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full p-3 border rounded-lg active:scale-[0.99] transition-all duration-150 transform ${
        selected ? STYLE_SELECTED : STYLE_DEFAULT
      }`}
    >
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}

export default function QuoteFlowNew() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [step1Loading, setStep1Loading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    type: null,
    province: null,
    gender: null,
    tobacco: null,
    meds: null,
    dui: null,
    coverage: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    name: '',
    email: '',
    phone: '',
  })

  // Saved quote ID (from API response) — ref so the loader closure always reads the latest value
  const savedQuoteIdRef = useRef<string | number>('new')

  // Modal state
  const [showProvinceModal, setShowProvinceModal] = useState(false)
  const [showLoaderModal, setShowLoaderModal] = useState(false)

  // Loader animation state
  const [loaderProgress, setLoaderProgress] = useState(0)
  const [loaderLogs, setLoaderLogs] = useState<LogItem[]>([])
  const loaderIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const loaderTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  // Input validation errors
  const [inputErrors, setInputErrors] = useState<Record<string, boolean>>({})
  const [inputTouched, setInputTouched] = useState<Record<string, boolean>>({})
  const [inputSuccess, setInputSuccess] = useState<Record<string, boolean>>({})

  const step1Valid = !!(formData.type && formData.province)
  const step2Valid = !!(formData.gender && formData.tobacco && formData.meds && formData.dui)

  const checkValidity = useCallback((name: string, value: string) => {
    const v = value.trim()
    if (name === 'dob-day') return v.length === 2 && parseInt(v) >= 1 && parseInt(v) <= 31
    if (name === 'dob-month') return v.length === 2 && parseInt(v) >= 1 && parseInt(v) <= 12
    if (name === 'dob-year') return v.length === 4 && parseInt(v) >= 1900 && parseInt(v) <= new Date().getFullYear()
    if (name === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
    if (name === 'phone') return v.replace(/\D/g, '').length >= 10
    if (name === 'name' || name === 'coverage') return v.length > 0
    return false
  }, [])

  const step3Valid = checkValidity('name', formData.name) &&
    checkValidity('email', formData.email) &&
    checkValidity('phone', formData.phone) &&
    checkValidity('coverage', formData.coverage) &&
    checkValidity('dob-day', formData.dobDay) &&
    checkValidity('dob-month', formData.dobMonth) &&
    checkValidity('dob-year', formData.dobYear)

  const formatPhone = (val: string) => {
    const x = val.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
    if (!x) return val
    return !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '')
  }

  const fieldKey = (name: string): keyof FormData => {
    if (name === 'dob-day') return 'dobDay'
    if (name === 'dob-month') return 'dobMonth'
    if (name === 'dob-year') return 'dobYear'
    return name as keyof FormData
  }

  const handleInputChange = (name: string, value: string) => {
    const processed = name === 'phone' ? formatPhone(value) : value
    const key = fieldKey(name)
    setFormData(prev => ({ ...prev, [key]: processed }))
    const isValid = checkValidity(name, processed)
    setInputSuccess(prev => ({ ...prev, [name]: isValid }))
    if (inputTouched[name]) {
      setInputErrors(prev => ({ ...prev, [name]: !isValid && processed.length > 0 }))
    }
  }

  const handleInputBlur = (name: string, value: string) => {
    setInputTouched(prev => ({ ...prev, [name]: true }))
    const isValid = checkValidity(name, value)
    setInputErrors(prev => ({ ...prev, [name]: !isValid && value.trim().length > 0 }))
    setInputSuccess(prev => ({ ...prev, [name]: isValid }))
  }

  const goToStep = (s: 1 | 2 | 3) => {
    setStep(s)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const handleStep1Next = () => {
    if (!step1Valid) return
    setStep1Loading(true)
    // Normalize to lowercase so QuoteResultsNew reads correct values even if user abandons mid-flow
    const data = {
      ...formData,
      gender:  (formData.gender  || '').toLowerCase(),
      tobacco: (formData.tobacco || '').toLowerCase(),
      meds:    (formData.meds    || '').toLowerCase(),
      dui:     (formData.dui     || '').toLowerCase(),
    }
    localStorage.setItem('quoteFormData', JSON.stringify(data))
    setTimeout(() => {
      setStep1Loading(false)
      goToStep(2)
    }, 1500)
  }

  const startLoaderAnimation = () => {
    // Clear any existing timers
    if (loaderIntervalRef.current) clearInterval(loaderIntervalRef.current)
    loaderTimeoutsRef.current.forEach(t => clearTimeout(t))
    loaderTimeoutsRef.current = []

    setLoaderLogs([])
    setLoaderProgress(0)

    const logs = [
      'Verifying eligibility...',
      'Connecting to Ontario Exchange...',
      'Pinged 14 insurers...',
      'Analyzing risk profile...',
      'Filtering best rates...',
    ]

    logs.forEach((text, i) => {
      const t = setTimeout(() => {
        setLoaderLogs(prev => {
          const updated = prev.map((item, idx) =>
            idx === prev.length - 1 ? { ...item, done: true } : item
          )
          return [...updated, { text, done: false }]
        })
      }, i * 800)
      loaderTimeoutsRef.current.push(t)
    })

    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 2.5
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setLoaderProgress(100)
        setTimeout(() => {
          setLoaderLogs(prev => prev.map((item, idx) => idx === prev.length - 1 ? { ...item, done: true } : item))
          setTimeout(() => {
            setShowLoaderModal(false)
            router.push(`/quote-results/${savedQuoteIdRef.current}`)
          }, 500)
        }, 200)
      } else {
        setLoaderProgress(progress)
      }
    }, 50)
    loaderIntervalRef.current = interval
  }

  const handleSubmit = () => {
    const finalData = { ...formData }

    // Normalize to lowercase before storing – QuoteResultsNew checks for 'male'/'yes'/'no'
    // (The form uses 'Male'/'Female' and 'Yes'/'No' as display values)
    const genderLc  = (finalData.gender  || '').toLowerCase()  // 'male' | 'female'
    const tobaccoLc = (finalData.tobacco || '').toLowerCase()  // 'yes' | 'no'
    const medsLc    = (finalData.meds    || '').toLowerCase()  // 'yes' | 'no'
    const duiLc     = (finalData.dui     || '').toLowerCase()  // 'yes' | 'no'

    localStorage.setItem('quoteFormData', JSON.stringify({
      ...finalData,
      gender:  genderLc,
      tobacco: tobaccoLc,
      meds:    medsLc,
      dui:     duiLc,
    }))
    setShowLoaderModal(true)
    startLoaderAnimation()

    // Call API in parallel – fire-and-forget during the loader animation
    fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gender:          genderLc === 'male' ? 'M' : 'F',
        tobacco:         tobaccoLc === 'yes' ? 'Y' : 'N',
        dobDay:          finalData.dobDay,
        dobMonth:        finalData.dobMonth,
        dobYear:         finalData.dobYear,
        fullName:        finalData.name,
        email:           finalData.email,
        phone:           finalData.phone,
        type:            finalData.type,
        coverage:        parseInt(finalData.coverage, 10) || 250000,
        province:        finalData.province,
        medication:      medsLc === 'yes' ? 'Y' : 'N',
        dui:             duiLc  === 'yes' ? 'Y' : 'N',
      }),
    })
      .then(r => r.json())
      .then(d => { if (d?.id) savedQuoteIdRef.current = d.id })
      .catch(() => {/* keep 'new' fallback */})
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loaderIntervalRef.current) clearInterval(loaderIntervalRef.current)
      loaderTimeoutsRef.current.forEach(t => clearTimeout(t))
    }
  }, [])

  const progressPct = Math.round(step * 100 / 3)

  // Coverage options that match the selected insurance type (aligned with QuoteResultsNew)
  const coverageOptionsForType = (() => {
    switch (formData.type) {
      case 'Critical Illness':
        return [
          { value: 25000,  label: '$25,000' },
          { value: 50000,  label: '$50,000' },
          { value: 75000,  label: '$75,000' },
          { value: 100000, label: '$100,000' },
          { value: 150000, label: '$150,000' },
          { value: 250000, label: '$250,000' },
          { value: 500000, label: '$500,000' },
        ]
      case 'Whole Life':
        return [
          { value: 50000,  label: '$50,000' },
          { value: 100000, label: '$100,000' },
          { value: 200000, label: '$200,000' },
          { value: 500000, label: '$500,000' },
          { value: 750000, label: '$750,000' },
          { value: 1000000, label: '$1,000,000' },
        ]
      default: // Term Life, Mortgage
        return [
          { value: 250000,  label: '$250,000' },
          { value: 500000,  label: '$500,000' },
          { value: 750000,  label: '$750,000' },
          { value: 1000000, label: '$1,000,000' },
          { value: 1250000, label: '$1,250,000' },
          { value: 1500000, label: '$1,500,000' },
          { value: 2000000, label: '$2,000,000' },
        ]
    }
  })()

  const inputClass = (name: string) => {
    const base = 'w-full border rounded-md py-3 px-4 focus:outline-none focus:ring-2 transition-all duration-150 text-[15px]'
    if (inputErrors[name]) return `${base} border-red-500 focus:border-red-500 focus:ring-red-200`
    return `${base} border-slate-300 focus:border-slate-800 focus:ring-slate-800/10`
  }

  return (
    <>
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.6); opacity: 0; }
          40% { opacity: 0.4; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes scan-vertical {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .scan-line { animation: scan-vertical 1.5s linear infinite; }
        @keyframes fadeInStep {
          from { opacity: 0; transform: translateY(3px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .step-transition { animation: fadeInStep 0.25s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes checklist-slide {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .checklist-item { animation: checklist-slide 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .input-success-icon {
          opacity: 0;
          transform: scale(0.5) translateY(-50%);
          transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
          position: absolute;
          top: 50%;
          right: 12px;
        }
        .input-success-icon.visible {
          opacity: 1;
          transform: scale(1) translateY(-50%);
        }
      `}</style>

      <div className="bg-[#F8FAFC] text-slate-700 font-sans antialiased min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>

        {/* Navbar */}
        <nav className="bg-white h-[60px] border-b border-slate-200 sticky top-0 z-50 flex items-center shadow-sm">
          <div className="w-full max-w-[540px] mx-auto px-5 flex items-center justify-between">
            <a href="/" className="font-bold text-lg text-slate-800 flex items-center gap-2 hover:text-slate-900 transition-colors duration-150">
              <i className="fas fa-shield-alt text-[#FF7A2A]"></i> PolicyScanner
            </a>
            <div className="text-[13px] font-medium text-slate-400">
              Step {step} of 3
            </div>
          </div>
        </nav>

        {/* Progress Bar */}
        <div className="fixed top-[60px] left-0 w-full h-[3px] bg-slate-200 z-40">
          <div
            className="h-full bg-[#FF7A2A] transition-all duration-300"
            style={{ width: `${progressPct}%`, transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }}
          />
        </div>

        {/* Main */}
        <main className="w-full max-w-[540px] mx-auto px-5 pt-8 md:pt-12 pb-20">

          {/* Step 1 */}
          {step === 1 && (
            <div className="step-transition">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-800 leading-tight">Select your insurance type</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {[
                  { value: 'Term Life', icon: 'fa-hourglass-half' },
                  { value: 'Whole Life', icon: 'fa-infinity' },
                  { value: 'Mortgage', icon: 'fa-home' },
                  { value: 'Critical Illness', icon: 'fa-heartbeat' },
                ].map(({ value, icon }) => (
                  <SelectCard
                    key={value}
                    selected={formData.type === value}
                    onClick={() => setFormData(prev => ({ ...prev, type: value, coverage: '' }))}
                  >
                    <div className={`w-7 h-7 flex items-center justify-center text-lg transition-colors duration-150 ${formData.type === value ? 'text-slate-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                      <i className={`fas ${icon}`}></i>
                    </div>
                    <span className="text-sm font-medium">{value}</span>
                  </SelectCard>
                ))}
              </div>

              <div className="mb-6 mt-10">
                <h3 className="text-lg font-semibold text-slate-800 leading-tight">Which province are you in?</h3>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <SelectCard
                  selected={formData.province === 'Ontario'}
                  onClick={() => setFormData(prev => ({ ...prev, province: 'Ontario' }))}
                >
                  <div className={`w-7 h-7 flex items-center justify-center text-lg transition-colors duration-150 ${formData.province === 'Ontario' ? 'text-slate-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <span className="text-sm font-medium">Ontario</span>
                  <i className={`fas fa-check ml-auto text-slate-800 transition-all duration-200 ${formData.province === 'Ontario' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}></i>
                </SelectCard>

                <button
                  type="button"
                  onClick={() => setShowProvinceModal(true)}
                  className="group relative flex items-center gap-3 w-full p-4 text-left bg-white border border-slate-200 rounded-lg hover:border-slate-400 hover:bg-slate-50 active:scale-[0.99] transition-all duration-150 transform"
                >
                  <div className="w-7 h-7 flex items-center justify-center text-slate-400 text-lg group-hover:text-slate-600 transition-colors duration-150">
                    <i className="fas fa-globe-americas"></i>
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Other Province</span>
                </button>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  type="button"
                  disabled={!step1Valid || step1Loading}
                  onClick={handleStep1Next}
                  className="w-full bg-[#FF7A2A] hover:bg-[#FFA35C] text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-150 flex items-center justify-center"
                >
                  {step1Loading ? (
                    <><i className="fas fa-circle-notch fa-spin mr-2"></i> Saving...</>
                  ) : 'Continue'}
                </button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                <i className="fas fa-lock"></i> Your information is secure &amp; private
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="step-transition">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-800 leading-tight">Tell us a bit about yourself</h2>
              </div>

              {/* Gender */}
              <div className="mb-6">
                <h3 className="text-base font-semibold text-slate-800 mb-3">What is your gender?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[{ value: 'Male', icon: 'fa-mars' }, { value: 'Female', icon: 'fa-venus' }].map(({ value, icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, gender: value }))}
                      className={`group relative flex flex-col items-center justify-center gap-2 w-full p-4 border rounded-lg active:scale-[0.99] transition-all duration-150 transform ${formData.gender === value ? STYLE_SELECTED : STYLE_DEFAULT}`}
                    >
                      <i className={`fas ${icon} text-xl ${formData.gender === value ? 'text-slate-600' : 'text-slate-400 group-hover:text-slate-600'}`}></i>
                      <span className="text-sm font-medium">{value}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tobacco */}
              <div className="mb-6">
                <h3 className="text-base font-semibold text-slate-800 mb-3">Have you used tobacco or nicotine in the last 5 years?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Yes', 'No'].map(v => (
                    <TwoOptionCard key={v} label={v} selected={formData.tobacco === v} onClick={() => setFormData(prev => ({ ...prev, tobacco: v }))} />
                  ))}
                </div>
              </div>

              {/* Meds */}
              <div className="mb-6">
                <h3 className="text-base font-semibold text-slate-800 mb-3 leading-snug">Do you take medication for high blood pressure or cholesterol?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Yes', 'No'].map(v => (
                    <TwoOptionCard key={v} label={v} selected={formData.meds === v} onClick={() => setFormData(prev => ({ ...prev, meds: v }))} />
                  ))}
                </div>
              </div>

              {/* DUI */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-slate-800 mb-3 leading-snug">In the past 5 years, have you been charged with driving under the influence?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Yes', 'No'].map(v => (
                    <TwoOptionCard key={v} label={v} selected={formData.dui === v} onClick={() => setFormData(prev => ({ ...prev, dui: v }))} />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  disabled={!step2Valid}
                  onClick={() => goToStep(3)}
                  className="w-full bg-[#FF7A2A] hover:bg-[#FFA35C] text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-150"
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="w-full bg-transparent text-slate-500 hover:text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Back
                </button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                <i className="fas fa-lock"></i> Your information is secure &amp; private
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="step-transition">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-800 leading-tight">Almost there! Let&apos;s find your best rates</h2>
              </div>

              <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-sm mb-4">
                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">How much coverage do you need?</label>
                  <div className="relative">
                    <select
                      className={`${inputClass('coverage')} appearance-none pr-8`}
                      value={formData.coverage}
                      onChange={e => handleInputChange('coverage', e.target.value)}
                      onBlur={e => handleInputBlur('coverage', e.target.value)}
                    >
                      <option value="" disabled>Select coverage amount</option>
                      {coverageOptionsForType.map(o => (
                        <option key={o.value} value={String(o.value)}>{o.label}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <i className="fas fa-chevron-down text-xs"></i>
                    </div>
                  </div>
                </div>

                <div className="mb-0">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of birth</label>
                  <div className="flex gap-2">
                    {[
                      { field: 'dobDay', name: 'dob-day', placeholder: 'DD', maxLen: 2, width: 'w-[30%]' },
                      { field: 'dobMonth', name: 'dob-month', placeholder: 'MM', maxLen: 2, width: 'w-[30%]' },
                      { field: 'dobYear', name: 'dob-year', placeholder: 'YYYY', maxLen: 4, width: 'w-[40%]' },
                    ].map(({ field, name, placeholder, maxLen, width }) => (
                      <input
                        key={name}
                        type="tel"
                        placeholder={placeholder}
                        maxLength={maxLen}
                        inputMode="numeric"
                        value={formData[field as keyof FormData] as string}
                        onChange={e => {
                          const val = e.target.value
                          setFormData(prev => ({ ...prev, [field]: val }))
                          handleInputChange(name, val)
                          if (val.length === maxLen) {
                            const next = e.target.nextElementSibling as HTMLInputElement | null
                            if (next) next.focus()
                          }
                        }}
                        onBlur={e => handleInputBlur(name, e.target.value)}
                        className={`${width} text-center border rounded-md py-3 px-3 focus:outline-none focus:ring-2 transition-all duration-150 text-[15px] ${inputErrors[name] ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-slate-800 focus:ring-slate-800/10'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Get your personalized quotes</h3>
              </div>

              <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-sm">
                {/* Name */}
                <div className="mb-5 relative">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Your full name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={e => handleInputChange('name', e.target.value)}
                      onBlur={e => handleInputBlur('name', e.target.value)}
                      className={inputClass('name') + ' pr-10'}
                    />
                    <span className={`input-success-icon ${inputSuccess['name'] ? 'visible' : ''}`}>
                      <i className="fas fa-check-circle text-green-500 text-lg"></i>
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="mb-5 relative">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="you@email.com"
                      autoComplete="email"
                      inputMode="email"
                      value={formData.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      onBlur={e => handleInputBlur('email', e.target.value)}
                      className={inputClass('email') + ' pr-10'}
                    />
                    <span className={`input-success-icon ${inputSuccess['email'] ? 'visible' : ''}`}>
                      <i className="fas fa-check-circle text-green-500 text-lg"></i>
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div className="mb-0">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                  <div className="flex gap-2">
                    <div className="relative w-[100px] shrink-0">
                      <select className="w-full appearance-none bg-white border border-slate-300 text-slate-700 py-3 px-3 pr-6 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800 transition-all text-[15px]">
                        <option value="+1">🇨🇦 +1</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                        <i className="fas fa-chevron-down text-xs"></i>
                      </div>
                    </div>
                    <div className="relative w-full">
                      <input
                        type="tel"
                        placeholder="(555) 123-4567"
                        autoComplete="tel"
                        inputMode="tel"
                        value={formData.phone}
                        onChange={e => handleInputChange('phone', e.target.value)}
                        onBlur={e => handleInputBlur('phone', e.target.value)}
                        className={inputClass('phone') + ' pr-10'}
                      />
                      <span className={`input-success-icon ${inputSuccess['phone'] ? 'visible' : ''}`}>
                        <i className="fas fa-check-circle text-green-500 text-lg"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-center text-slate-500 leading-relaxed px-2">
                By clicking &quot;Get My Quotes&quot;, you agree to our{' '}
                <a href="/privacy-policy" className="text-slate-700 underline hover:text-slate-900">Privacy Policy</a> and{' '}
                <a href="/terms-of-service" className="text-slate-700 underline hover:text-slate-900">Terms &amp; Conditions</a>.
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  type="button"
                  disabled={!step3Valid}
                  onClick={handleSubmit}
                  className="w-full bg-[#FF7A2A] hover:bg-[#FFA35C] text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-150"
                >
                  Get My Quotes
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="w-full bg-transparent text-slate-500 hover:text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Back
                </button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                <i className="fas fa-lock"></i> Your information is secure &amp; private
              </div>
            </div>
          )}
        </main>

        {/* Province Modal */}
        {showProvinceModal && (
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px] z-[1000] flex items-center justify-center p-4"
            onClick={() => setShowProvinceModal(false)}
          >
            <div
              className="bg-white p-8 rounded-xl w-full max-w-[400px] text-center shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowProvinceModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 text-xl mx-auto mb-4">
                <i className="fas fa-map-marked-alt"></i>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Outside Ontario?</h2>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">We&apos;re currently offering online services in Ontario only, but we will be expanding to other provinces soon!</p>
              <button
                onClick={() => setShowProvinceModal(false)}
                className="w-full bg-[#FF7A2A] hover:bg-[#FFA35C] text-white font-semibold py-3 rounded-lg shadow-md transition-all active:scale-[0.98]"
              >
                Okay
              </button>
            </div>
          </div>
        )}

        {/* Loader Modal */}
        {showLoaderModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px] z-[1000] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl w-full max-w-[360px] text-center shadow-2xl">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#FF7A2A] rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300 text-2xl overflow-hidden h-8 w-8 flex items-center justify-center">
                  <i className="fas fa-shield-alt relative z-10"></i>
                  <div className="absolute w-full h-[2px] bg-[#FF7A2A]/50 scan-line z-20"></div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-4">Finding your best rates</h3>

              <div className="w-full text-left space-y-3 mb-6 min-h-[100px] px-2 overflow-hidden">
                {loaderLogs.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-slate-600 checklist-item">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${item.done ? 'bg-green-100' : 'bg-slate-100'}`}>
                      {item.done ? (
                        <i className="fas fa-check text-[10px] text-green-600"></i>
                      ) : (
                        <i className="fas fa-circle-notch fa-spin text-[10px] text-[#FF7A2A]"></i>
                      )}
                    </div>
                    <span className={`font-medium ${item.done ? 'text-slate-400' : ''}`}>{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FF7A2A] transition-all duration-300 ease-out"
                  style={{ width: `${loaderProgress}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2 text-right w-full">{Math.round(loaderProgress)}%</p>
            </div>
          </div>
        )}



      </div>
    </>
  )
}
