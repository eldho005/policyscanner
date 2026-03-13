import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

/**
 * POST /api/calculator
 * Quick calculator endpoint - used by homepage calculator widget.
 * Takes age, gender, smoking, coverage and returns cheapest matching rate.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { age, gender, smoking, coverage, term = 3 } = body

    const supabase = createServerSupabase()
    const authID = process.env.COMPULIFE_AUTH_ID || 'A598DEFe2'
    const ip = process.env.COMPULIFE_IP || '15.157.201.107'

    // Get active company codes
    const { data: companies } = await supabase
      .from('companies')
      .select('company_code, company_name, display_name')
      .eq('status', 'active')
      .not('company_code', 'is', null)

    const companiesList = companies?.map(c => c.company_code).join(',') || ''

    // Calculate DOB from age
    const now = new Date()
    const dobYear = now.getFullYear() - age
    const dobMonth = String(now.getMonth() + 1).padStart(2, '0')
    const dobDay = String(now.getDate()).padStart(2, '0')

    const postData = new URLSearchParams({
      State: '9',
      ZipCode: '',
      BirthMonth: dobMonth,
      Birthday: dobDay,
      BirthYear: String(dobYear),
      Sex: gender === 'male' ? 'M' : 'F',
      COMPINC: companiesList,
      ActualAge: String(age),
      NearestAge: String(age),
      Smoker: smoking === 'yes' ? 'Y' : 'N',
      Health: 'R',
      NewCategory: `Z:${term}`,
      FaceAmount: String(coverage),
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

    const responseData = await res.json()

    // Find the first matching company
    let result: { name?: string; premium_monthly?: string; image?: string; yearly_price?: string; ageUntil?: number } = {}

    if (responseData?.Compulife_ComparisonResults) {
      for (const terms of responseData.Compulife_ComparisonResults) {
        for (const list of terms.Compulife_Results) {
          const compName = list.Compulife_company
          const getComp = companies?.find(
            c => c.display_name?.toLowerCase() === compName?.toLowerCase()
          )
          if (getComp) {
            const companySlug = getComp.display_name
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')

            result = {
              name: getComp.company_name,
              premium_monthly: list.Compulife_premiumM,
              yearly_price: list.Compulife_premiumAnnual || list.Compulife_premiumA,
              image: `/comp/${companySlug}.webp`,
              ageUntil: Number(term) > 10 ? 100 : Number(term) + age,
            }
            break
          }
        }
        if (result.name) break
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Calculator error:', error)
    return NextResponse.json({ error: 'Calculation failed' }, { status: 500 })
  }
}
