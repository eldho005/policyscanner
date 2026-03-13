import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

const WINQUOTE_BASE = 'https://www.winquote.net/cgi-bin/compete.pl'
const WINQUOTE_PROFILE = process.env.WINQUOTE_PROFILE || '1755192606'

// Term years → WinQuote product item code (pg=0, Term Life)
const TERM_YEAR_TO_PI: Record<number, string> = {
  5:  '1',
  10: '2',
  15: '3',
  20: '4',
  25: '5',
  30: '6',
  65: '9',  // Term to 65
  100:'9',  // Term to 100
}

// Whole-life pay period filter → WinQuote product item (pg=3)
const WHOLE_PAY_TO_PI: Record<string, string> = {
  'life-pay': '0',  // Whole Life Pay to 100  (planGroupItemCode 3:0)
  '20-pay':   '3',  // Whole Life 20 Pay       (planGroupItemCode 3:3)
  '10-pay':   '5',  // Whole Life 10 Pay       (planGroupItemCode 3:5)
}

// Insurance type slug → WinQuote product group + default item
function getProductGroupItem(slugType: string, termYears?: number, wholePayPeriod?: string): { pg: string; pi: string } {
  switch (slugType) {
    case 'whole-life': {
      const pi = (wholePayPeriod && WHOLE_PAY_TO_PI[wholePayPeriod]) ? WHOLE_PAY_TO_PI[wholePayPeriod] : '0'
      return { pg: '3', pi } // Whole Life – specific pay period or Life Pay (default)
    }
    case 'critical-illness':
      return { pg: '5', pi: '3' }  // CI – All (term 20)
    case 'universal-life':
      return { pg: '4', pi: '0' }  // UL – All
    default: {
      // term-life / mortgage: pg=0 (Term)
      const pi = termYears ? (TERM_YEAR_TO_PI[termYears] ?? '4') : '4'
      return { pg: '0', pi }
    }
  }
}

// Parse WinQuote XML into array of { heading, data } objects
function parseWinquoteXml(xml: string): Array<{ heading: Record<string, string>; data: Record<string, string> }> {
  const records: Array<{ heading: Record<string, string>; data: Record<string, string> }> = []

  const extractTag = (src: string, tag: string): string => {
    const m = src.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))
    if (!m) return ''
    return m[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").trim()
  }

  const extractFields = (src: string): Record<string, string> => {
    const obj: Record<string, string> = {}
    const re = /<(\w+)>([\s\S]*?)<\/\1>/g
    let m: RegExpExecArray | null
    while ((m = re.exec(src)) !== null) {
      obj[m[1]] = m[2].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").trim()
    }
    return obj
  }

  const rsetRe = /<recordSet>([\s\S]*?)<\/recordSet>/g
  let match: RegExpExecArray | null
  while ((match = rsetRe.exec(xml)) !== null) {
    const content = match[1]
    const hSection = extractTag(content, 'recordSetHeading')
    const dSection = extractTag(content, 'recordSetData')

    if (!hSection && !dSection) continue

    const heading = extractFields(`<recordSetHeading>${hSection}</recordSetHeading>`)
    const data    = extractFields(`<recordSetData>${dSection}</recordSetData>`)

    // skip non-qualifying premiums (error codes > 9000000)
    const prem = parseFloat(data.premium || '0')
    if (prem > 9000000 || prem <= 0) continue

    records.push({ heading, data })
  }

  return records
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      quoteId,
      termYears,           // numeric: 10, 20, 30 …
      coverageOverride,    // optional: override quote's stored coverage
      medication,          // 'Y' | 'N'
      dui,                 // 'Y' | 'N'
      typeOverride,        // optional: override the insurance type slug (e.g. 'whole-life')
      wholePayPeriod,      // optional: 'life-pay' | '20-pay' | '10-pay'
      // Direct params (used when quoteId is 'new' / no DB)
      directDobDay,
      directDobMonth,
      directDobYear,
      directGender,        // 'M' | 'F'
      directTobacco,       // 'Y' | 'N'
      directCoverage,
      directType,          // insurance type slug
    } = body as {
      quoteId?: string | number
      termYears?: number
      coverageOverride?: number
      medication?: string
      dui?: string
      typeOverride?: string
      wholePayPeriod?: string
      directDobDay?: string
      directDobMonth?: string
      directDobYear?: string
      directGender?: string
      directTobacco?: string
      directCoverage?: number
      directType?: string
    }

    const isDirectMode = !quoteId || quoteId === 'new'

    let qDataResolved: Record<string, string>
    let slugType: string
    let age: number
    let coverageAmt: string
    let med: string
    let duiVal: string

    if (isDirectMode) {
      // Use form data directly – no DB needed
      if (!directDobYear || !directDobMonth || !directDobDay || !directGender) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      }
      qDataResolved = {
        dobDay:   directDobDay,
        dobMonth: directDobMonth,
        dobYear:  directDobYear,
        gender:   directGender,
        tobacco:  directTobacco || 'N',
      }
      const birthDate = new Date(`${directDobYear}-${directDobMonth}-${directDobDay}`)
      const today = new Date()
      age = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--

      // Map form type label -> slug
      const typeMap: Record<string, string> = {
        'Term Life': 'term-life',
        'Whole Life': 'whole-life',
        'Mortgage': 'term-life',
        'Critical Illness': 'critical-illness',
      }
      slugType = typeOverride || typeMap[directType || ''] || 'term-life'
      coverageAmt = String(directCoverage || coverageOverride || 500000)
      med = medication || 'N'
      duiVal = dui || 'N'
    } else {
      const supabase = createServerSupabase()
      const { data: quote, error: qErr } = await supabase
        .from('quotation_forms')
        .select('*')
        .eq('id', quoteId)
        .single()

      if (qErr || !quote) {
        console.error('[WinQuote] Quote not found:', quoteId, qErr?.message)
        return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
      }

      // Look up insurance type slug separately
      let typeSlug = 'term-life'
      if (quote.type) {
        const { data: typeData } = await supabase
          .from('types')
          .select('slug')
          .eq('id', parseInt(String(quote.type), 10))
          .single()
        if (typeData?.slug) typeSlug = typeData.slug
      }

      console.log('[WinQuote] Loaded quote from DB:', quote.id, 'typeSlug:', typeSlug, 'age:', quote.age)

      qDataResolved = typeof quote.data === 'string' ? JSON.parse(quote.data) : quote.data
      slugType = typeOverride || typeSlug
      age = parseInt(String(quote.age), 10)
      coverageAmt = String(coverageOverride || quote.coverage || 250000)
      med = medication ?? quote.medication ?? 'N'
      duiVal = dui ?? quote.dui ?? 'N'
    }

    // DOB: WinQuote wants MMDDYYYY
    const dob = [
      String(qDataResolved.dobMonth).padStart(2, '0'),
      String(qDataResolved.dobDay).padStart(2, '0'),
      String(qDataResolved.dobYear),
    ].join('')

    const gender   = qDataResolved.gender === 'M' ? '1' : '2'
    const coverage = coverageAmt
    // Always use Regular (R) risk class so simplified issue products appear alongside
    // fully-underwritten ones. Accurate Elite/Preferred pricing is handled by the advisor.
    const riskClass = 'R'
    const isSmoker  = qDataResolved.tobacco === 'Y'

    // NOTE: Company filter removed — the DB company_code values are truncated/incorrect
    // and were filtering out all results. The -ceilrank25 flag already limits to top 25.

    const { pg, pi } = getProductGroupItem(slugType, termYears, wholePayPeriod)

    // Build dc parameter string
    const params: string[] = [
      `-ccca`,
      `-pcca${WINQUOTE_PROFILE}`,
      `-qt0`,
      `-rt0`,
      `-lc13`,
      `-ofjson`,
      `-pm3:0`,          // monthly first, then annual
      `-fmt`,            // format text fields
      `-dob${dob}`,
      `-g${gender}`,
      `-fa${coverage}`,
      `-r${riskClass}`,
      `-pg${pg}`,
      `-pi${pi}`,
      `-rc0`,            // show all products
      `-pfgp2`,          // show both guaranteed and non-guaranteed
      `-ceilp`,          // remove error-coded premiums
      `-ceilrank25`,     // top 25 results
    ]

    // Tobacco: if smoker, add cigarette use in last 12 months
    if (isSmoker) {
      params.push('-tucgt0')  // cigarette use: last 12 months
    }

    const dcParam = params.join('%20')
    const url = `${WINQUOTE_BASE}?dc=${dcParam}`

    const res = await fetch(url, { next: { revalidate: 0 } })
    const text = await res.text()

    // Try JSON first (when -ofjson works), fall back to XML parser
    let records: Array<{ heading: Record<string, string>; data: Record<string, string> }> = []
    try {
      const json = JSON.parse(text)
      // WinQuote JSON structure: { results: { record: { recordSet: [...] } } }
      // Each item: { recordSetHeading: {...}, company, product, premium, premiumAlt, ... }
      // Data fields are at the SAME level as recordSetHeading (not nested in recordSetData)
      const arr = Array.isArray(json?.results?.record?.recordSet)
                    ? json.results.record.recordSet
                    : Array.isArray(json?.recordSet)
                    ? json.recordSet
                    : Array.isArray(json) ? json : []

      console.log('[WinQuote] Parsed records count:', arr.length)

      for (const r of arr) {
        // Data fields are direct properties, not in recordSetData
        const prem = parseFloat(r?.premium ?? r?.recordSetData?.premium ?? '0')
        if (prem > 9000000 || prem <= 0) continue

        // Build heading from recordSetHeading
        const heading = r.recordSetHeading ?? {}

        // Build data from all non-heading direct fields
        const data: Record<string, string> = {}
        for (const [k, v] of Object.entries(r)) {
          if (k !== 'recordSetHeading' && typeof v === 'string') {
            data[k] = v
          }
        }

        records.push({ heading, data })
      }
    } catch {
      // JSON parse failed – response is XML
      records = parseWinquoteXml(text)
    }

    // Load companies DB for enrichment (optional)
    let dbCompanies: Record<string, unknown>[] = []
    try {
      const supabase = createServerSupabase()
      const { data } = await supabase.from('companies').select('*')
      dbCompanies = data || []
    } catch { /* no DB */ }

    // Direct nameCode → logo filename map (exact WinQuote companyNameCode values → /public/comp/ files)
    const NAMECODE_TO_LOGO: Record<string, string> = {
      // Co-operators Life
      'CO-OPERA':   'cooperators-life-insurance.webp',
      'CO-OPERAA':  'cooperators-life-insurance.webp',
      // Equitable Life
      'EQUITABL':   'equitable-life-insurance-co-of-canada.webp',
      'EQUITABLA':  'equitable-life-insurance-co-of-canada.webp',
      // Beneva
      'BENEVA':     'beneva-la-capitalessq-merger.webp',
      // BMO Insurance
      'BMOINSUR':   'bmo-life-assurance-company.webp',
      'BMOINSURA':  'bmo-life-assurance-company.webp',
      // Desjardins
      'DESJARDI':   'desjardins-financial-security.webp',
      // Empire Life
      'EMPIRELI':   'the-empire-life-insurance-company.webp',
      'EMPIRELIA':  'the-empire-life-insurance-company.webp',
      'SCOTIAIN':   'the-empire-life-insurance-company.webp',  // Scotia underwritten by Empire
      // Foresters
      'FORESTER':   'foresters-life-insurance-company.webp',
      'FORESTERA':  'foresters-life-insurance-company.webp',
      'CPPUNDER':   'canada-protection-plan-foresters-life.webp',
      // Humania
      'HUMANIA':    'humania-assurance-inc.webp',
      'HUMANIAA':   'humania-assurance-inc.webp',
      // iA Financial Group
      'IAFINANC':   'industrial-alliance-life-insurance.webp',
      'IAFINANCA':  'industrial-alliance-life-insurance.webp',
      // ivari
      'IVARI':      'ivari.webp',
      'IVARIAAA':   'ivari.webp',
      // Manulife
      'MANULIFE':   'the-manufacturers-life-insurance-company.webp',
      'MANUFAAA':   'the-manufacturers-life-insurance-company.webp',
      // RBC Insurance
      'RBCINSUR':   'rbc-life-insurance-company.webp',
      'RBCINSURA':  'rbc-life-insurance-company.webp',
      // Sun Life
      'SUNLIFE':    'sun-life-assurance-company-of-canada.webp',
      'SUNLIFEA':   'sun-life-assurance-company-of-canada.webp',
      // UV Insurance
      'UVINSURA':   'uv-insurance.webp',
      'UVASSURA':   'uv-insurance.webp',
      // Assumption Life
      'ASSUMPTI':   'assumption-mutual-life-insurance-company.webp',
      'ASSUMPTIA':  'assumption-mutual-life-insurance-company.webp',
      // Canada Life
      'CANADALI':   'the-canada-life-assurance-company.webp',
      'CANALIAA':   'the-canada-life-assurance-company.webp',
      // Blue Cross
      'BLUECROS':   'blue-cross.webp',
      'BLUECRO1':   'blue-cross.webp',
      // Wawanesa Life
      'WAWANESA':   'wawa-medium.png',
      // Serenia Life
      'SERENIAL':   'sere-medium.png',
    }

    // Enrich records and deduplicate by company
    const seen = new Set<string>()
    const cards = []

    for (const rec of records) {
      const compDisplayName: string = rec.data.company || ''
      const nameCode: string        = rec.heading.companyNameCode || ''

      // Match against DB by display_name, company_code, or ci_company_code
      const dbComp = (dbCompanies || []).find(
        (c: Record<string, unknown>) =>
          (c.display_name as string)?.toLowerCase() === compDisplayName.toLowerCase() ||
          (c.company_code as string)?.toLowerCase() === nameCode.toLowerCase() ||
          (c.ci_company_code as string)?.toLowerCase() === nameCode.toLowerCase()
      ) as Record<string, unknown> | undefined

      // Deduplicate by BOTH canonical company name AND nameCode:
      // - Canonical name catches different nameCodes for the same insurer (e.g. MANULIFE + MANUFAAA → "Manulife Financial")
      // - nameCode catches the same company appearing multiple times for different products (e.g. UVINSURA × 3)
      // WinQuote returns results ordered cheapest-first so we always keep the best price.
      const canonicalKey = (dbComp?.company_name as string) || compDisplayName
      const ncKey = nameCode.toUpperCase()
      if (seen.has(canonicalKey) || (ncKey && seen.has(ncKey))) continue
      seen.add(canonicalKey)
      if (ncKey) seen.add(ncKey)

      const monthlyPrice  = parseFloat(rec.data.premium || '0')
      const yearlyPrice   = parseFloat(rec.data.premiumAlt || '0') || monthlyPrice * 12

      const coverageLastAge = parseInt(rec.heading.coverageLastAge || '85')

      const slug = ((dbComp?.display_name as string) || compDisplayName)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      const cleanDisplay = ((dbComp?.display_name as string) || compDisplayName)
        .replace(/\s+underwritten\s+by.*$/i, '')
        .replace(/\s+issued\s+by.*$/i, '')
        .trim()

      // Resolve logo: DB logo field (primary) → direct nameCode→filename map → null (show text)
      const dbLogo = dbComp?.logo as string | undefined
      const logoFile = dbLogo || NAMECODE_TO_LOGO[nameCode.toUpperCase()] || null

      // Exclude Teachers Life from results
      const EXCLUDE_PATTERN = /teachers\s*life/i
      if (EXCLUDE_PATTERN.test(compDisplayName) || EXCLUDE_PATTERN.test(rec.data.product || '')) continue

      cards.push({
        companyName:    (dbComp?.company_name   as string) || compDisplayName,
        displayName:    cleanDisplay,
        product:        rec.data.product       || '',
        pClass:         rec.data.pClass        || '',
        risk:           rec.data.risk          || '',
        planNote:       (rec.data.planNote     || '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
        companyUrl:     rec.heading.companyUrl || '',
        ageFrom:        parseInt(rec.heading.ageFrom || '0') || 0,
        ageTo:          parseInt(rec.heading.ageTo   || '0') || 0,
        slug,
        imageUrl:       logoFile ? `/comp/${logoFile}` : null,
        monthlyPrice:   monthlyPrice.toFixed(2),
        yearlyPrice:    yearlyPrice.toFixed(2),
        coverageLastAge,
        nameCode,
        companyFileCode: rec.heading.companyFileCode || '',
        company:         dbComp || null,
      })
    }

    return NextResponse.json({
      cards,
      quote: {
        id:        quoteId || 'new',
        age,
        coverage:  coverageAmt,
        medication: med,
        dui:        duiVal,
        slugType,
        data:       qDataResolved,
      },
    })
  } catch (error) {
    console.error('WinQuote API error:', error)
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 })
  }
}
