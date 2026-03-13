'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

type PolicyType = 'term' | 'whole' | 'mortgage' | 'critical'
type View = 'dashboard' | 'profile' | 'thankyou'

const COVERAGE_OPTIONS_STANDARD = [
  { value: 250000, label: '$250,000' },
  { value: 500000, label: '$500,000' },
  { value: 750000, label: '$750,000' },
  { value: 1000000, label: '$1,000,000' },
  { value: 1250000, label: '$1,250,000' },
  { value: 1500000, label: '$1,500,000' },
  { value: 2000000, label: '$2,000,000' },
]
const COVERAGE_OPTIONS_WHOLE = [
  { value: 50000, label: '$50,000' },
  { value: 100000, label: '$100,000' },
  { value: 200000, label: '$200,000' },
  { value: 500000, label: '$500,000' },
  { value: 750000, label: '$750,000' },
  { value: 1000000, label: '$1,000,000' },
]
const COVERAGE_OPTIONS_CI = [
  { value: 25000,  label: '$25,000' },
  { value: 50000,  label: '$50,000' },
  { value: 75000,  label: '$75,000' },
  { value: 100000, label: '$100,000' },
  { value: 150000, label: '$150,000' },
  { value: 250000, label: '$250,000' },
  { value: 500000, label: '$500,000' },
]

const TERM_OPTIONS = [
  { value: 10, label: '10 Years' },
  { value: 15, label: '15 Years' },
  { value: 20, label: '20 Years' },
  { value: 25, label: '25 Years' },
  { value: 30, label: '30 Years' },
]

interface ApiCard {
  id: number
  companyName: string
  displayName: string
  product: string
  pClass: string
  risk: string
  planNote: string
  companyUrl: string
  ageFrom: number
  ageTo: number
  slug: string
  imageUrl: string | null
  monthlyPrice: string
  yearlyPrice: string
  coverageLastAge: number
  isBestValue: boolean
  company: Record<string, unknown> | null
}

const POLICY_LABEL: Record<PolicyType, string> = {
  term: 'Term Life Insurance',
  whole: 'Whole Life Insurance',
  mortgage: 'Mortgage Insurance',
  critical: 'Critical Illness',
}

function formatCoverage(v: number) {
  return v >= 1000000 ? `$${v / 1000000}M` : `$${v / 1000}k`
}

type FilterOption = { value: string; label: string }
function getFilters(pt: PolicyType): FilterOption[] {
  if (pt === 'whole') return [
    { value: 'life-pay', label: 'Life 100 Pay' },
    { value: '20-pay', label: '20 Pay' },
    { value: '10-pay', label: '10 Pay' },
  ]
  if (pt === 'mortgage') return []
  return [
    { value: 'all', label: 'All' },
    { value: 'no-medical', label: 'Simplified Issue' },
  ]
}

export default function QuoteResultsNew() {
  const params = useParams()
  const searchParams = useSearchParams()
  const quoteId = params?.id as string | undefined

  const [view, setView] = useState<View>('dashboard')
  const [policyType, setPolicyType] = useState<PolicyType>('term')
  const [coverage, setCoverage] = useState(250000)
  const [term, setTerm] = useState(20)
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [filter, setFilter] = useState('all')
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})
  const [showPolicyModal, setShowPolicyModal] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [quoteLoading, setQuoteLoading] = useState<number | null>(null)

  // API state
  const [apiCards, setApiCards] = useState<ApiCard[]>([])
  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const fetchAbort = useRef<AbortController | null>(null)
  // Tracks whether we've already initialized coverage/type from localStorage (first load only)
  const directModeInitialized = useRef(false)
  // Always mirrors policyType state — lets fetchQuotes see the current type without being in its deps
  const activePolicyType = useRef<PolicyType>('term')

  // Helpers to persist / restore the user's current selections across refreshes
  const OVERRIDE_KEY = `quoteOverride_${quoteId || 'new'}`
  const saveOverride = useCallback((type: PolicyType, cov: number, t: number, f?: string) => {
    try { localStorage.setItem(OVERRIDE_KEY, JSON.stringify({ type, coverage: cov, term: t, filter: f ?? 'all' })) } catch {}
  }, [OVERRIDE_KEY])
  const loadOverride = useCallback((): { type: PolicyType; coverage: number; term: number; filter?: string } | null => {
    try {
      const raw = localStorage.getItem(OVERRIDE_KEY)
      if (!raw) return null
      return JSON.parse(raw)
    } catch { return null }
  }, [OVERRIDE_KEY])

  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    gender: 'Male',
    tobacco: 'No',
    meds: 'No',
    dui: 'No',
  })

  const withLoader = useCallback((fn: () => void, ms = 600) => {
    if (isProcessing) return
    setIsProcessing(true)
    setShowLoader(true)
    setTimeout(() => {
      fn()
      setShowLoader(false)
      setIsProcessing(false)
    }, ms)
  }, [isProcessing])

  // Fetch quotes from WinQuote API
  const fetchQuotes = useCallback(async (termYears: number, coverageAmt: number, typeOverride?: PolicyType, wholePayOverride?: string) => {
    if (fetchAbort.current) fetchAbort.current.abort()
    fetchAbort.current = new AbortController()

    if (!quoteId || quoteId === 'new') {
      // No real quote ID — use form data from localStorage
      const stored = typeof window !== 'undefined' ? localStorage.getItem('quoteFormData') : null
      if (!stored) {
        setApiError('No quote data found. Please start a new quote.')
        setApiLoading(false)
        return
      }
      const d = JSON.parse(stored)

      // Map insurance type label → policyType
      const typeToPolicy: Record<string, PolicyType> = {
        'Term Life': 'term',
        'Whole Life': 'whole',
        'Mortgage': 'mortgage',
        'Critical Illness': 'critical',
      }
      // Map policyType → WinQuote type label
      const policyToLabel: Record<PolicyType, string> = {
        term: 'Term Life',
        whole: 'Whole Life',
        mortgage: 'Mortgage',
        critical: 'Critical Illness',
      }

      const formType = d.insuranceType || d.type || 'Term Life'
      const formPolicyType = typeToPolicy[formType] || 'term'

      // Effective type for this request:
      // 1. Explicit typeOverride (user picked from policy modal)
      // 2. activePolicyType ref (user previously changed policy, then changed coverage/term)
      // 3. formType from localStorage (first load)
      const resolvedType: PolicyType = typeOverride
        ?? (directModeInitialized.current ? activePolicyType.current : null)
        ?? loadOverride()?.type
        ?? (typeToPolicy[formType] || 'term')
      const effectiveType = policyToLabel[resolvedType]

      // On first load: sync coverage + policyType from form data
      // When user changes policy type (typeOverride set): use passed coverage, mark as initialized
      // On subsequent coverage/term changes: use the passed coverageAmt
      let formCoverage: number
      if (typeOverride) {
        directModeInitialized.current = true
        activePolicyType.current = typeOverride
        formCoverage = coverageAmt
      } else if (!directModeInitialized.current) {
        directModeInitialized.current = true
        // Prefer persisted override (survives refresh) over raw form data
        const saved = loadOverride()
        if (saved) {
          formCoverage = saved.coverage
          const savedType = saved.type
          setPolicyType(savedType)
          activePolicyType.current = savedType
          setCoverage(saved.coverage)
          setTerm(saved.term)
          setFilter(getFilters(savedType)[0]?.value ?? 'all')
        } else {
          formCoverage = parseInt(d.coverage, 10) || coverageAmt
          setPolicyType(formPolicyType)
          activePolicyType.current = formPolicyType
          if (formCoverage !== coverageAmt) setCoverage(formCoverage)
        }
      } else {
        formCoverage = coverageAmt
      }

      setProfile({
        name:     d.name  || '',
        email:    d.email || '',
        phone:    d.phone || '',
        dobDay:   d.dobDay   || '',
        dobMonth: d.dobMonth || '',
        dobYear:  d.dobYear  || '',
        gender:   d.gender  === 'male'  ? 'Male'   : 'Female',
        tobacco:  d.tobacco === 'yes'   ? 'Yes'    : 'No',
        meds:     d.meds    === 'yes'   ? 'Yes'    : 'No',
        dui:      d.dui     === 'yes'   ? 'Yes'    : 'No',
      })

      setApiLoading(true)
      setApiError(null)
      try {
        const res = await fetch('/api/winquote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quoteId: 'new',
            termYears,
            coverageOverride: formCoverage,
            directDobDay:   d.dobDay,
            directDobMonth: d.dobMonth,
            directDobYear:  d.dobYear,
            directGender:   d.gender === 'male' ? 'M' : 'F',
            directTobacco:  d.tobacco === 'yes' ? 'Y' : 'N',
            directCoverage: formCoverage,
            directType:     effectiveType,
            medication:     d.meds === 'yes' ? 'Y' : 'N',
            dui:            d.dui  === 'yes' ? 'Y' : 'N',
            ...(resolvedType === 'whole' && wholePayOverride ? { wholePayPeriod: wholePayOverride } : {}),
          }),
          signal: fetchAbort.current.signal,
        })
        const data = await res.json()
        if (data.error) { setApiError(data.error); return }
        const enriched: ApiCard[] = (data.cards || []).map((c: Omit<ApiCard, 'id' | 'isBestValue'>, i: number) => ({
          ...c,
          id: i + 1,
          isBestValue: i === 0,
        }))
        setApiCards(enriched)
      } catch (err: unknown) {
        if ((err as Error)?.name === 'AbortError') return
        setApiError('Failed to load quotes. Please try again.')
      } finally {
        setApiLoading(false)
      }
      return
    }

    setApiLoading(true)
    setApiError(null)
    try {
      const med = searchParams?.get('medication') || undefined
      const duiVal = searchParams?.get('dui') || undefined

      const res = await fetch('/api/winquote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteId,
          termYears,
          coverageOverride: coverageAmt,
          medication: med,
          dui: duiVal,
          ...(typeOverride ? { typeOverride: {
            term: 'term-life',
            whole: 'whole-life',
            mortgage: 'mortgage-insurance',
            critical: 'critical-illness',
          }[typeOverride] } : {}),
          ...((typeOverride === 'whole' || activePolicyType.current === 'whole') && wholePayOverride ? { wholePayPeriod: wholePayOverride } : {}),
        }),
        signal: fetchAbort.current.signal,
      })
      const data = await res.json()
      if (data.error) { setApiError(data.error); return }

      // Enrich cards with index IDs
      const enriched: ApiCard[] = (data.cards || []).map((c: Omit<ApiCard, 'id' | 'isBestValue'>, i: number) => ({
        ...c,
        id: i + 1,
        isBestValue: i === 0,
      }))
      setApiCards(enriched)

      // Pre-fill profile from quote data
      if (data.quote?.data) {
        const qd = data.quote.data
        setProfile({
          name:     qd.name        || '',
          email:    qd.email       || '',
          phone:    qd.phoneNumber || '',
          dobDay:   qd.dobDay      || '',
          dobMonth: qd.dobMonth    || '',
          dobYear:  qd.dobYear     || '',
          gender:   qd.gender  === 'M' ? 'Male'   : 'Female',
          tobacco:  qd.tobacco === 'Y' ? 'Yes'    : 'No',
          meds:     data.quote.medication === 'Y' ? 'Yes' : 'No',
          dui:      data.quote.dui        === 'Y' ? 'Yes' : 'No',
        })
        // Only sync coverage and policyType from DB on first load (no typeOverride means
        // the user hasn't switched away from the DB's original type yet).
        if (!typeOverride) {
          if (data.quote.coverage) {
            setCoverage(Number(data.quote.coverage) || coverageAmt)
          }
          if (data.quote.slugType) {
            const slugToPolicy: Record<string, PolicyType> = {
              'term-life': 'term',
              'whole-life': 'whole',
              'mortgage-insurance': 'mortgage',
              'critical-illness': 'critical',
            }
            const pt = slugToPolicy[data.quote.slugType]
            if (pt) {
              setPolicyType(pt)
              activePolicyType.current = pt
              setFilter(getFilters(pt)[0]?.value ?? 'all')
            }
          }
        }
      }
    } catch (e: unknown) {
      if ((e as Error)?.name !== 'AbortError') setApiError('Failed to load quotes.')
    } finally {
      setApiLoading(false)
    }
  }, [quoteId, searchParams])

  // Initial load — restore any saved override first (survives refresh), then fetch
  useEffect(() => {
    const saved = loadOverride()
    if (saved) {
      // User previously changed policy type / coverage / term — restore their selection
      const restoredFilter = saved.filter ?? (getFilters(saved.type)[0]?.value ?? 'all')
      const restoredPayPeriod = saved.type === 'whole' ? restoredFilter : undefined
      setPolicyType(saved.type)
      activePolicyType.current = saved.type
      setCoverage(saved.coverage)
      setTerm(saved.term)
      setFilter(restoredFilter)
      directModeInitialized.current = true
      fetchQuotes(saved.term, saved.coverage, saved.type, restoredPayPeriod)
    } else {
      fetchQuotes(term, coverage)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteId])

  // Reset image errors whenever a new set of cards loads
  useEffect(() => { setImgErrors({}) }, [apiCards])

  // Cleanup abort on unmount
  useEffect(() => () => { fetchAbort.current?.abort() }, [])

  const handleSaveProfile = () => {
    // Persist profile changes to localStorage so re-fetch uses updated data (direct mode)
    if (!quoteId || quoteId === 'new') {
      try {
        const stored = localStorage.getItem('quoteFormData')
        const d = stored ? JSON.parse(stored) : {}
        localStorage.setItem('quoteFormData', JSON.stringify({
          ...d,
          name:     profile.name,
          email:    profile.email,
          phone:    profile.phone,
          dobDay:   profile.dobDay,
          dobMonth: profile.dobMonth,
          dobYear:  profile.dobYear,
          gender:   profile.gender === 'Male' ? 'male' : 'female',
          tobacco:  profile.tobacco === 'Yes' ? 'yes' : 'no',
          meds:     profile.meds    === 'Yes' ? 'yes' : 'no',
          dui:      profile.dui     === 'Yes' ? 'yes' : 'no',
        }))
      } catch { /* ignore */ }
    }
    withLoader(() => {
      setView('dashboard')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3300)
      window.scrollTo(0, 0)
      // Re-fetch with updated profile data — only in direct mode where localStorage was updated.
      // DB mode: profile edits are cosmetic until a DB write is implemented; re-fetching would
      // overwrite the edits with stale Supabase data, silently reverting the user's changes.
      if (!quoteId || quoteId === 'new') {
        const payOverride = activePolicyType.current === 'whole' ? filter : undefined
        fetchQuotes(term, coverage, activePolicyType.current, payOverride)
      }
    })
  }

  const handlePolicyChange = (newType: PolicyType) => {
    const newTerm = newType === 'whole' ? 0 : newType === 'critical' ? 20 : 10
    const newCoverage = (newType === 'whole' || newType === 'critical') ? 100000 : 250000
    const initialFilter = getFilters(newType)[0]?.value ?? 'all'
    const initialPayPeriod = newType === 'whole' ? initialFilter : undefined
    setPolicyType(newType)
    activePolicyType.current = newType
    setTerm(newTerm)
    setCoverage(newCoverage)
    setFilter(initialFilter)
    setShowPolicyModal(false)
    saveOverride(newType, newCoverage, newTerm, initialFilter)
    window.scrollTo(0, 0)
    fetchQuotes(newTerm, newCoverage, newType, initialPayPeriod)
  }

  const handleGetQuote = (cardId: number) => {
    setQuoteLoading(cardId)

    // Find the selected card and send lead data to the backend
    const selectedCard = apiCards.find(c => c.id === cardId)
    if (selectedCard) {
      fetch('/api/quote-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteId: quoteId || 'new',
          companyName: selectedCard.companyName,
          displayName: selectedCard.displayName,
          product: selectedCard.product,
          monthlyPrice: selectedCard.monthlyPrice,
          yearlyPrice: selectedCard.yearlyPrice,
          coverage,
          term,
          policyType,
          userName: profile.name,
          userEmail: profile.email,
          userPhone: profile.phone,
        }),
      }).catch(() => { /* non-blocking */ })
    }

    setTimeout(() => {
      setQuoteLoading(null)
      setView('thankyou')
      window.scrollTo(0, 0)
    }, 800)
  }

  const coverageOptions = policyType === 'whole' ? COVERAGE_OPTIONS_WHOLE
                         : policyType === 'critical' ? COVERAGE_OPTIONS_CI
                         : COVERAGE_OPTIONS_STANDARD
  const filters = getFilters(policyType)

  const formatPhone = (val: string) => {
    const x = val.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
    if (!x) return val
    return !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '')
  }

  const insuranceAge = (() => {
    const y = parseInt(profile.dobYear)
    const m = parseInt(profile.dobMonth)
    const d = parseInt(profile.dobDay)
    if (!y || y < 1900 || !m || !d) return null
    const today = new Date()
    const birth = new Date(y, m - 1, d)
    // Insurance age = age at nearest birthday (round to closest)
    const ageMs = today.getTime() - birth.getTime()
    const ageDate = new Date(ageMs)
    const rawAge = Math.abs(ageDate.getUTCFullYear() - 1970)
    // Check if next birthday is closer than last birthday
    const nextBirthday = new Date(today.getFullYear(), m - 1, d)
    if (nextBirthday < today) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
    const lastBirthday = new Date(nextBirthday)
    lastBirthday.setFullYear(lastBirthday.getFullYear() - 1)
    const daysToNext = (nextBirthday.getTime() - today.getTime()) / 86400000
    const daysSinceLast = (today.getTime() - lastBirthday.getTime()) / 86400000
    return daysToNext < daysSinceLast ? rawAge + 1 : rawAge
  })()

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .fade-enter { animation: fadeInPage 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes fadeInPage {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-update { transition: opacity 0.2s ease-in-out; }
        .fade-update.updating { opacity: 0.4; }
        .toast-slide {
          animation: slideUpToast 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes slideUpToast {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes spinAnim { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .spinner-el {
          border: 3px solid #E2E8F0;
          border-top: 3px solid #FF7A2A;
          border-radius: 50%;
          width: 2.5rem;
          height: 2.5rem;
          animation: spinAnim 0.8s linear infinite;
        }
        @media (min-width: 768px) {
          [data-tooltip] { position: relative; cursor: help; }
          [data-tooltip]::before {
            content: attr(data-tooltip);
            position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);
            background: #1E293B; color: white; padding: 0.5rem 0.75rem; border-radius: 0.375rem;
            font-size: 0.75rem; font-weight: 500; width: max-content; max-width: 240px;
            text-align: center; opacity: 0; pointer-events: none; transition: all 0.2s ease; z-index: 50;
          }
          [data-tooltip]::after {
            content: ''; position: absolute; bottom: calc(100% + 2px); left: 50%; transform: translateX(-50%);
            border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #1E293B;
            opacity: 0; pointer-events: none; transition: all 0.2s ease; z-index: 50;
          }
          [data-tooltip]:hover::before, [data-tooltip]:hover::after { opacity: 1; }
        }
      `}</style>

      <div className="bg-[#F8FAFC] text-slate-700 min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>

        {/* Header */}
        <header className="bg-white h-[60px] border-b border-slate-200 sticky top-0 z-40 flex items-center shadow-sm">
          <div className="w-full max-w-[1024px] mx-auto px-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/compare-insurance-quotes" className="font-bold text-lg text-slate-800 whitespace-nowrap flex items-center gap-2 hover:text-slate-900 transition-colors">
                <i className="fas fa-shield-alt text-[#FF7A2A]"></i>
                <span className="hidden sm:inline">PolicyScanner</span>
              </a>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <span className="font-semibold text-sm sm:text-base text-slate-700 whitespace-nowrap">
                {POLICY_LABEL[policyType]}
              </span>
              <button
                onClick={() => setShowPolicyModal(true)}
                className="text-xs font-semibold text-slate-500 bg-transparent border border-slate-300 rounded px-2 py-1 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-400 transition-all duration-200"
              >
                Change
              </button>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/compare-insurance-quotes"
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors hidden sm:block"
              >
                New Quote
              </a>
              <button
                onClick={() => { setView('profile'); window.scrollTo(0, 0) }}
                className="flex items-center gap-3 cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors group"
              >
                <span className="text-sm font-medium text-slate-500 group-hover:text-slate-800 hidden sm:block">Edit Profile</span>
                <div className="w-8 h-8 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 group-hover:text-slate-600 group-hover:border-slate-300 transition-all">
                  <i className="fas fa-user text-sm"></i>
                </div>
              </button>
            </div>
          </div>
        </header>

        <div className="w-full max-w-[1024px] mx-auto px-4 sm:px-6 pt-3 md:pt-6 pb-20">

          {/* Dashboard View */}
          {view === 'dashboard' && (
            <main className="fade-enter">

              {/* Controls Bar */}
              <div className="sticky top-[60px] md:top-[76px] z-30 bg-white border border-slate-200 rounded-xl shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05),0_2px_4px_-1px_rgb(0_0_0/0.03)] p-3 md:p-4 mb-6 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">

                  {/* Dropdowns */}
                  <div className="flex items-center gap-3 md:gap-4 flex-1">
                    <div className="flex flex-col gap-1 w-full md:w-auto">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Coverage</span>
                      <div className="relative">
                        <select
                          value={coverage}
                          onChange={e => {
                            const val = parseInt(e.target.value)
                            setCoverage(val)
                            saveOverride(activePolicyType.current, val, term, filter)
                            fetchQuotes(term, val, activePolicyType.current, activePolicyType.current === 'whole' ? filter : undefined)
                          }}
                          className="w-full md:min-w-[140px] appearance-none bg-white border border-slate-200 text-slate-800 text-sm font-medium py-2 pl-3 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-400 transition-all cursor-pointer"
                        >
                          {coverageOptions.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                          <i className="fas fa-chevron-down text-xs"></i>
                        </div>
                      </div>
                    </div>

                    {policyType !== 'whole' && policyType !== 'critical' && (
                      <div className="flex flex-col gap-1 w-full md:w-auto">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Term</span>
                        <div className="relative">
                          <select
                            value={term}
                            onChange={e => {
                            const val = parseInt(e.target.value)
                            setTerm(val)
                            saveOverride(activePolicyType.current, coverage, val, filter)
                            fetchQuotes(val, coverage, activePolicyType.current)
                          }}
                            className="w-full md:min-w-[120px] appearance-none bg-white border border-slate-200 text-slate-800 text-sm font-medium py-2 pl-3 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-400 transition-all cursor-pointer"
                          >
                            {TERM_OPTIONS.map(o => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                            <i className="fas fa-chevron-down text-xs"></i>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Toggle & Filters */}
                  <div className="flex items-center justify-between gap-4 w-full md:w-auto">
                    {/* Monthly/Yearly Toggle */}
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                      {(['monthly', 'yearly'] as const).map(p => (
                        <button
                          key={p}
                          onClick={() => { if (p !== period) withLoader(() => setPeriod(p), 400) }}
                          className={`flex-1 py-1.5 px-3 text-xs rounded-md transition-all capitalize ${
                            period === p
                              ? 'font-semibold bg-white text-slate-900 shadow-sm'
                              : 'font-medium text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                      ))}
                    </div>

                    {/* Filter Pills */}
                    {filters.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        {filters.map(f => (
                          <button
                            key={f.value}
                            onClick={() => {
                              if (filter !== f.value) {
                                if (policyType === 'whole') {
                                  withLoader(() => {
                                    setFilter(f.value)
                                    saveOverride(activePolicyType.current, coverage, term, f.value)
                                    fetchQuotes(term, coverage, activePolicyType.current, f.value)
                                  })
                                } else {
                                  withLoader(() => setFilter(f.value))
                                }
                              }
                            }}
                            className={`whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                              filter === f.value
                                ? 'bg-slate-800 text-white border-slate-800'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quote Cards */}
              <section className="space-y-4">
                {/* Loading skeleton */}
                {apiLoading && apiCards.length === 0 && [1, 2, 3].map(i => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 animate-pulse">
                    <div className="grid grid-cols-1 md:grid-cols-[1.5fr_2fr_1.5fr] gap-6 items-center">
                      <div className="space-y-2">
                        <div className="h-5 bg-slate-200 rounded w-24"></div>
                        <div className="h-4 bg-slate-100 rounded w-16"></div>
                      </div>
                      <div className="h-20 bg-slate-100 rounded-lg"></div>
                      <div className="flex flex-col gap-2 items-end">
                        <div className="h-8 bg-slate-200 rounded w-24"></div>
                        <div className="h-10 bg-slate-100 rounded-lg w-36"></div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* API error */}
                {apiError && !apiLoading && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-sm font-medium text-red-600">{apiError}</p>
                    <div className="mt-3 flex items-center justify-center gap-4">
                      <button
                        onClick={() => fetchQuotes(term, coverage)}
                        className="text-xs font-semibold text-red-700 underline"
                      >
                        Retry
                      </button>
                      <a
                        href="/compare-insurance-quotes"
                        className="text-xs font-semibold text-[#FF7A2A] underline"
                      >
                        Start New Quote
                      </a>
                    </div>
                  </div>
                )}

                {/* No results */}
                {!apiLoading && !apiError && apiCards.length === 0 && (
                  <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
                    <p className="text-sm font-medium text-slate-500">No quotes found for the selected parameters.</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting the coverage or term above.</p>
                  </div>
                )}

                {/* Real quote cards */}
                {(() => {
                  // Simplified Issue: no exam, health questionnaire only (Beneva Simplified, CPP, HuGO, Teachers Life, etc.)
                  const SIMPLIFIED_PATTERN = /simplified|no[\s-]?med|non[\s-]?med|hugo|canada[\s-]*protection|\bcpp\b/i

                  const matchesSimplified = (c: ApiCard) =>
                    SIMPLIFIED_PATTERN.test(c.product) ||
                    SIMPLIFIED_PATTERN.test(c.companyName) ||
                    SIMPLIFIED_PATTERN.test(c.displayName)

                  const filtered = filter === 'all' || policyType === 'whole'
                    ? apiCards
                    : apiCards.filter(matchesSimplified)
                  // Re-assign isBestValue after filtering
                  const displayCards = filtered.map((c, i) => ({ ...c, isBestValue: i === 0 }))

                  if (displayCards.length === 0 && apiCards.length > 0) {
                    return (
                      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
                        <p className="text-sm font-medium text-slate-500">No quotes match the &ldquo;{filters.find(f => f.value === filter)?.label}&rdquo; filter.</p>
                        <button onClick={() => setFilter('all')} className="mt-2 text-xs font-semibold text-[#FF7A2A] underline">Show All</button>
                      </div>
                    )
                  }

                  return displayCards.map(card => {
                  const price       = period === 'monthly' ? `$${parseFloat(card.monthlyPrice).toFixed(2)}` : `$${parseFloat(card.yearlyPrice).toFixed(2)}`
                  const pricePeriod = period === 'yearly' ? '/ year' : '/ month'
                  const covDisplay  = formatCoverage(coverage)
                  const wholeLabel = getFilters('whole').find(f => f.value === filter)?.label ?? 'Life Pay'
                  const termDisplay = policyType === 'whole' ? wholeLabel : `${term} Yrs`
                  const badge       = card.isBestValue ? '★ Best Value' : (card.risk || card.pClass || 'Standard Plan')
                  // Parse planNote from WinQuote (e.g. "Renewable & Convertible(75); Level Benefit") into chips
                  const planNoteFeatures = card.planNote
                    ? card.planNote.split(';').map(s => s.trim()).filter(Boolean)
                    : []
                  const logoFailed  = imgErrors[card.id] ?? false

                  return (
                    <article
                      key={card.id}
                      className={`card rounded-xl shadow-sm transition-colors duration-200 group ${
                        card.isBestValue
                          ? 'bg-orange-50/30 border border-orange-200 ring-1 ring-orange-200/50'
                          : 'bg-white border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-[1.5fr_2fr_1.5fr] gap-6 items-center">

                        {/* Brand */}
                        <div className="flex flex-row md:flex-col justify-between items-center md:items-start md:justify-start gap-3 border-b md:border-b-0 border-slate-100 pb-3 md:pb-0 border-dashed">
                          <div className="h-10 md:h-12 flex items-center">
                            {(!card.imageUrl || logoFailed) ? (
                              <span className={`text-sm font-bold ${card.isBestValue ? 'text-slate-800' : 'text-slate-600'}`}>
                                {card.displayName}
                              </span>
                            ) : (
                              <img
                                src={card.imageUrl}
                                alt={card.displayName}
                                className="max-h-full max-w-[110px] object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                                onError={() => setImgErrors(prev => ({ ...prev, [card.id]: true }))}
                              />
                            )}
                          </div>
                          <span className={`inline-block text-[10px] font-bold uppercase px-2 py-1 rounded tracking-wide border ${
                            card.isBestValue
                              ? 'bg-[#FF7A2A]/10 text-[#FF7A2A] border-[#FF7A2A]/20'
                              : 'bg-white text-slate-500 border-slate-200'
                          }`}>
                            {badge}
                          </span>
                        </div>

                        {/* Stats */}
                        <div className={`border rounded-lg p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 ${card.isBestValue ? 'bg-white/80 border-slate-100' : 'bg-slate-50 border-slate-100'}`}>
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Coverage</span>
                            <span className="text-sm font-bold text-slate-800 fade-update">{covDisplay}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Term</span>
                            <span className="text-sm font-bold text-slate-800 fade-update">{termDisplay}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Covered Until</span>
                            <span className="text-sm font-bold text-slate-800">
                              {(policyType === 'term' || policyType === 'mortgage') && insuranceAge
                                ? `${insuranceAge + term} yrs`
                                : card.coverageLastAge
                                  ? `${card.coverageLastAge} yrs`
                                  : '—'}
                            </span>
                          </div>
                          {card.risk && (
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Risk Class</span>
                              <span className={`text-sm font-bold ${
                                card.risk.toLowerCase() === 'elite' ? 'text-green-600'
                                : card.risk.toLowerCase() === 'preferred' ? 'text-blue-600'
                                : 'text-slate-700'
                              }`}>{card.risk}</span>
                            </div>
                          )}
                        </div>

                        {/* Price + CTA */}
                        <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-2 md:gap-1">
                          <div className="text-right">
                            <div className="text-2xl md:text-3xl font-bold text-slate-900 leading-none tracking-tight fade-update">{price}</div>
                            <div className="text-xs font-medium text-slate-400 fade-update">{pricePeriod}</div>
                          </div>
                          <button
                            onClick={() => handleGetQuote(card.id)}
                            disabled={quoteLoading !== null}
                            data-tooltip="Get a personalized quote from an advisor"
                            className="bg-[#FF7A2A] hover:bg-[#FFA35C] text-white text-sm font-semibold py-2.5 px-6 rounded-lg shadow-md transition-colors duration-150 min-w-[140px] flex items-center justify-center disabled:opacity-80 disabled:cursor-not-allowed active:scale-[0.97]"
                          >
                            {quoteLoading === card.id ? (
                              <i className="fas fa-circle-notch fa-spin text-white text-sm"></i>
                            ) : (
                              <span>Get Quote</span>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Plan features strip */}
                      {planNoteFeatures.length > 0 && (
                        <div className="border-t border-slate-100 bg-slate-50/50 rounded-b-xl px-4 py-2.5 md:px-5 md:py-3 flex flex-wrap gap-2">
                          {planNoteFeatures.map(feat => (
                            <span key={feat} className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-slate-600 bg-slate-100 rounded px-2 py-0.5 font-medium">
                              <i className="fas fa-check text-green-500 text-[9px]"></i>
                              {feat}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  )
                })
                })()}
              </section>

              {/* Banner */}
              <aside className="mt-8 bg-white border border-slate-200 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">Enjoying PolicyScanner?</h4>
                  <p className="text-sm text-slate-500">Help us improve our algorithms with your feedback.</p>
                </div>
                <button className="bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 font-semibold py-2 px-6 rounded-lg transition-all duration-200 text-sm whitespace-nowrap">
                  Leave Review
                </button>
              </aside>
            </main>
          )}

          {/* Profile View */}
          {view === 'profile' && (
            <section className="fade-enter max-w-2xl mx-auto pt-4">
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8">
                <div className="border-b border-slate-100 pb-6 mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Your Profile</h2>
                  <p className="text-sm text-slate-500 mt-1">Update your details to see accurate quotes.</p>
                </div>

                <div className="space-y-6">
                  {[
                    { label: 'Full Name', key: 'name', type: 'text', autoComplete: 'name' },
                    { label: 'Email Address', key: 'email', type: 'email', autoComplete: 'email' },
                    { label: 'Phone Number', key: 'phone', type: 'tel', autoComplete: 'tel' },
                  ].map(({ label, key, type, autoComplete }) => (
                    <div key={key}>
                      <label className="block text-xs font-bold uppercase text-slate-500 tracking-wide mb-1.5">{label}</label>
                      <input
                        type={type}
                        autoComplete={autoComplete}
                        value={profile[key as keyof typeof profile]}
                        onChange={e => {
                          const val = key === 'phone' ? formatPhone(e.target.value) : e.target.value
                          setProfile(prev => ({ ...prev, [key]: val }))
                        }}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-400 transition-all"
                      />
                    </div>
                  ))}

                  {/* DOB */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 tracking-wide mb-1.5">Date of Birth</label>
                    <div className="grid grid-cols-[1fr_1fr_1.5fr] gap-3">
                      {[
                        { key: 'dobDay', placeholder: 'DD', maxLen: 2 },
                        { key: 'dobMonth', placeholder: 'MM', maxLen: 2 },
                        { key: 'dobYear', placeholder: 'YYYY', maxLen: 4 },
                      ].map(({ key, placeholder, maxLen }) => (
                        <input
                          key={key}
                          type="text"
                          inputMode="numeric"
                          placeholder={placeholder}
                          maxLength={maxLen}
                          value={profile[key as keyof typeof profile]}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, maxLen)
                            setProfile(prev => ({ ...prev, [key]: val }))
                          }}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-center text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-400 transition-all"
                        />
                      ))}
                    </div>
                    {insuranceAge && (
                      <div className="mt-2 text-xs text-slate-400 font-medium">
                        Insurance age: <span className="text-slate-700 font-bold">{insuranceAge}</span>
                      </div>
                    )}
                  </div>

                  {/* Toggle Groups */}
                  {[
                    { label: 'What is your gender?', key: 'gender', options: ['Male', 'Female'] },
                    { label: 'Have you used tobacco or nicotine in the last 5 years?', key: 'tobacco', options: ['No', 'Yes'] },
                    { label: 'Do you take medication for high blood pressure or cholesterol?', key: 'meds', options: ['No', 'Yes'] },
                    { label: 'In the past 5 years, have you been charged with driving under the influence of alcohol or drugs?', key: 'dui', options: ['No', 'Yes'] },
                  ].map(({ label, key, options }) => (
                    <div key={key} className="mb-4">
                      <label className="block text-sm font-medium text-slate-900 mb-2">{label}</label>
                      <div className="flex gap-2">
                        {options.map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setProfile(prev => ({ ...prev, [key]: opt }))}
                            className={`flex-1 py-2.5 rounded-lg text-sm transition-all ${
                              profile[key as keyof typeof profile] === opt
                                ? 'border border-slate-800 bg-slate-800 text-white font-semibold'
                                : 'border border-slate-200 bg-white text-slate-500 hover:text-slate-800 font-medium'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleSaveProfile}
                    className="w-full bg-[#FF7A2A] hover:bg-[#FFA35C] text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors mt-4"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => withLoader(() => { setView('dashboard'); window.scrollTo(0, 0) }, 400)}
                    className="w-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 font-semibold py-3 px-6 rounded-lg transition-all mt-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Thank You View */}
          {view === 'thankyou' && (
            <section className="fade-enter max-w-xl mx-auto pt-8 text-center">
              <div className="bg-white p-8 md:p-12 rounded-2xl shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-2px_rgb(0_0_0/0.05)] border border-slate-200 relative overflow-hidden">

                <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-800 text-3xl">
                  <i className="fas fa-check"></i>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight">Application Received</h2>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8 px-4">
                  Your quote request has been securely submitted. A licensed advisor is now reviewing your profile details.
                </p>

                {/* Steps */}
                <div className="flex justify-between relative mb-10 px-4">
                  <div className="absolute top-[15px] left-[30px] right-[30px] h-0.5 bg-slate-200 -z-0"></div>

                  {[
                    { num: 1, label: 'Submitted', done: true },
                    { num: 2, label: 'Review', done: false, active: true },
                    { num: 3, label: 'Finalize', done: false, active: false },
                  ].map(({ num, label, done, active }) => (
                    <div key={num} className="relative z-10 flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border-2 font-bold ${
                        done
                          ? 'bg-slate-800 text-white border-slate-800'
                          : active
                            ? 'bg-white text-slate-800 border-slate-800'
                            : 'bg-white text-slate-300 border-slate-200'
                      }`}>
                        {done ? <i className="fas fa-check"></i> : num}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${active || done ? 'text-slate-800' : 'text-slate-400'}`}>{label}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-left mb-8">
                  <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider mb-4">What Happens Next?</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-slate-600">
                      <i className="fas fa-envelope mt-1 text-slate-400 text-xs"></i>
                      <span>Confirmation email sent to your inbox.</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-slate-600">
                      <i className="fas fa-phone-alt mt-1 text-slate-400 text-xs"></i>
                      <span>A senior executive will call you to discuss tailored options and secure your best quote.</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => withLoader(() => { setView('dashboard'); window.scrollTo(0, 0) }, 600)}
                  className="w-full bg-[#FF7A2A] hover:bg-[#FFA35C] text-white font-bold py-3 rounded-lg shadow-md transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </section>
          )}

        </div>

        {/* Policy Type Modal */}
        {showPolicyModal && (
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPolicyModal(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4">Select Policy Type</h3>
              <div className="space-y-2">
                {(Object.entries(POLICY_LABEL) as [PolicyType, string][]).map(([type, label]) => (
                  <button
                    key={type}
                    onClick={() => handlePolicyChange(type)}
                    className={`w-full flex justify-between items-center p-3 rounded-lg border text-sm transition-all ${
                      policyType === type
                        ? 'border-[#FF7A2A] bg-orange-50 text-slate-900 font-semibold'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-[#FF7A2A] hover:bg-orange-50 hover:text-[#FF7A2A] font-normal'
                    }`}
                  >
                    <span>{label}</span>
                    {policyType === type && <i className="fas fa-check text-[#FF7A2A]"></i>}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowPolicyModal(false)}
                className="w-full mt-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Loader Overlay — shown during explicit loader actions OR while API re-fetches (cards already visible) */}
        {(showLoader || (apiLoading && apiCards.length > 0)) && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center gap-4">
              <div className="spinner-el"></div>
              <div className="text-sm font-semibold text-slate-700">Updating Quotes...</div>
            </div>
          </div>
        )}

        {/* Toast */}
        {showToast && (
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-6 z-[70] toast-slide">
            <div className="bg-slate-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
              <i className="fas fa-check-circle text-green-400"></i>
              <span className="text-sm font-medium">Profile Updated Successfully</span>
            </div>
          </div>
        )}

      </div>
    </>
  )
}
