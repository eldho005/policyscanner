import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

/**
 * GET /api/riders?company_id=X&plan=term-life&type=Free
 * Fetch insurance riders for a company by plan type and rider type.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('company_id')
    const plan = searchParams.get('plan') || 'term-life'
    const type = searchParams.get('type') || 'Free'

    if (!companyId) {
      return NextResponse.json({ error: 'company_id required' }, { status: 400 })
    }

    const supabase = createServerSupabase()

    const { data: riders, error } = await supabase
      .from('insurance_riders')
      .select('*')
      .eq('company_id', companyId)
      .eq('plan_type', plan)
      .eq('rider_type', type)

    if (error) throw error

    const title = type === 'Paid' 
      ? 'Optional Paid Riders'
      : 'Free Riders Included'
    const desc = type === 'Paid'
      ? 'Add extra protection to your policy for a small cost. These riders help tailor your coverage to better fit your needs.'
      : 'These extra benefits come with your policy at no additional cost. They add flexibility and protection for different life situations.'

    return NextResponse.json({ riders: riders || [], title, desc })
  } catch (error) {
    console.error('Riders fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch riders' }, { status: 500 })
  }
}
