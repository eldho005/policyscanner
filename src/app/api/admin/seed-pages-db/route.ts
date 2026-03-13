import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { SEO_PAGES } from '@/data/seo-page-plan'

/**
 * POST /api/admin/seed-pages-db
 * Seeds the seo_pages table from the SEO_PAGES manifest.
 * Safe to run multiple times (uses upsert).
 */
export async function POST() {
  const supabase = createServerSupabase()

  const rows = SEO_PAGES.map((p) => ({
    slug: p.slug,
    title: p.title,
    url: p.path ? `/life-insurance/${p.path}` : '/life-insurance',
    target_words: p.wordCount,
    week: p.week,
    level: p.level,
    type: p.type,
    keyword: p.keyword,
    seed_file: p.seedFile,
  }))

  const { error, count } = await supabase
    .from('seo_pages')
    .upsert(rows, { onConflict: 'slug', ignoreDuplicates: false })
    .select()

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, seeded: rows.length, message: `${rows.length} pages seeded/updated.` })
}
