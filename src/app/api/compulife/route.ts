import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

/**
 * POST /api/compulife
 * Proxy to Compulife API for term/whole/mortgage life insurance quotes.
 * Also handles Critical Illness / Universal Life via MaxVisitors API.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createServerSupabase()

    const {
      quoteId,
      term,        // term code (e.g. "3", "H")
      medication,  // "Y" or "N"
      dui,         // "Y" or "N"
      gfilter,     // optional canada-life filter
    } = body

    // Fetch quote with type
    const { data: quote, error: qErr } = await supabase
      .from('quotation_forms')
      .select('*, types:type(id, name, slug)')
      .eq('id', quoteId)
      .single()
    if (qErr || !quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    const qData = typeof quote.data === 'string' ? JSON.parse(quote.data) : quote.data
    const slugType = quote.types?.slug

    // Get the current term
    const { data: currentTerm } = await supabase
      .from('terms')
      .select('*, type:type_id(slug)')
      .eq('type_id', quote.type)
      .order('id', { ascending: true })
      .limit(1)
      .single()

    // If specific term requested, get that instead
    let activeTerm = currentTerm
    if (term) {
      const { data: specificTerm } = await supabase
        .from('terms')
        .select('*, type:type_id(slug)')
        .eq('code', term)
        .eq('type_id', quote.type)
        .single()
      if (specificTerm) activeTerm = specificTerm
    }

    // Determine health class
    let health = 'R'
    const med = medication || quote.medication || 'N'
    const duiVal = dui || quote.dui || 'N'
    if (med === 'N' && duiVal === 'N') {
      health = 'PP'
    }

    let responseData: unknown

    if (['critical-illness', 'universal-life'].includes(slugType)) {
      // MaxVisitors API
      responseData = await callMaxVisitors(quote, qData, activeTerm, slugType, supabase)
    } else {
      // Compulife API
      responseData = await callCompulife(quote, qData, activeTerm, health, supabase)
    }

    // Get companies for enrichment
    const { data: companies } = await supabase
      .from('companies')
      .select('*')

    return NextResponse.json({
      results: responseData,
      quote: {
        id: quote.id,
        age: quote.age,
        coverage: quote.coverage,
        medication: med,
        dui: duiVal,
        data: qData,
      },
      currentTerm: activeTerm,
      companies: companies || [],
      gfilter: gfilter || null,
    })
  } catch (error) {
    console.error('Compulife API error:', error)
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 })
  }
}

async function callCompulife(
  quote: Record<string, unknown>,
  qData: Record<string, string>,
  term: Record<string, unknown> | null,
  health: string,
  supabase: ReturnType<typeof createServerSupabase>
) {
  const { data: companies } = await supabase
    .from('companies')
    .select('company_code')
    .eq('status', 'active')
    .not('company_code', 'is', null)

  const companiesList = companies?.map(c => c.company_code).join(',') || ''
  const termCode = (term as Record<string, unknown>)?.code || '3'

  const authID = process.env.COMPULIFE_AUTH_ID || 'A598DEFe2'
  const ip = process.env.COMPULIFE_IP || '15.157.201.107'

  const postData = new URLSearchParams({
    State: '9',
    ZipCode: '',
    BirthMonth: qData.dobMonth,
    Birthday: qData.dobDay,
    BirthYear: qData.dobYear,
    Sex: qData.gender,
    COMPINC: companiesList,
    ActualAge: String(quote.age),
    NearestAge: String(quote.age),
    Smoker: qData.tobacco,
    Health: health,
    NewCategory: `Z:${termCode}`,
    FaceAmount: String(quote.coverage),
    ModeUsed: 'ALL',
    SortOverride1: '',
    CompRating: '16',
    LANGUAGE: 'E',
    PRODDIS: '',
    MaxNumResults: '',
    REMOTE_IP: ip,
  })

  const url = `https://compulifeapi.com/api/request/?COMPULIFEAUTHORIZATIONID=${authID}&REMOTE_IP=${ip}`

  const res = await fetch(url, {
    method: 'POST',
    body: postData,
  })

  return res.json()
}

async function callMaxVisitors(
  quote: Record<string, unknown>,
  qData: Record<string, string>,
  term: Record<string, unknown> | null,
  slugType: string,
  supabase: ReturnType<typeof createServerSupabase>
) {
  const age = quote.age
  const gender = qData.gender === 'M' ? 1 : 2
  const coverage = quote.coverage
  const tobacco = qData.tobacco === 'Y' ? 1 : 0
  const dob = `${qData.dobDay}${qData.dobMonth}${qData.dobYear}`

  let companiesList = ''
  let pT = '5'
  let pi = '0'
  const termCode = (term as Record<string, unknown>)?.code || '3'

  if (slugType === 'critical-illness') {
    const { data: companies } = await supabase
      .from('companies')
      .select('ci_company_code')
      .eq('status', 'active')
      .not('ci_company_code', 'is', null)
    companiesList = companies?.map(c => c.ci_company_code).join(':') || ''
    pi = String(termCode)
    pT = '5'
  }

  if (slugType === 'universal-life') {
    companiesList = [
      'MANULIFE', 'IVARI', 'IAFINANC', 'CANADALI', 'DESJARDI',
      'SUNLIFE', 'CO-OPERA', 'EQUITABL', 'BENEVA'
    ].join(':')
    pT = String(termCode)
    pi = '0'
  }

  const queryParams: Record<string, string | number> = {
    age: age as number,
    g: gender,
    fa: coverage as number,
    tobacco,
    dob,
    fn: companiesList,
    productType: pT,
    r: 'R',
    lc: '13',
    pg: '5',
    pi,
    pm: '0',
    tucgl: '100',
    tucgr: '100',
    tucgt: '0',
    tuchw: '100',
    tumrj: '100',
    tuoth: '100',
    tupip: '100',
    tuvap: '100',
    tuwat: '100',
    ciOp: '',
  }

  // Build parms string like the original PHP
  let parms = ''
  for (const [key, value] of Object.entries(queryParams)) {
    if (key === 'age') {
      parms = `-${key}${value}`
    } else {
      parms = `${parms} -${key}${value}`
    }
  }

  const res = await fetch('https://api3.yourquote.ca/rates-life-ci', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: parms }),
  })

  return res.json()
}
