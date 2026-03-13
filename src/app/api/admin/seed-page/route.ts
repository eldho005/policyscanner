import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/client'
import path from 'path'
import fs from 'fs'

// ─── helpers ────────────────────────────────────────────────────────────────

/** Recursively remove private fields (_writer_notes, _guidance, _meta) */
function stripPrivate(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(stripPrivate)
  }
  if (obj !== null && typeof obj === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (k === '_writer_notes' || k === '_guidance' || k === '_meta') continue
      out[k] = stripPrivate(v)
    }
    return out
  }
  return obj
}

// Map JSON "component" snake_case names → Sanity _type camelCase names
const COMPONENT_TYPE_MAP: Record<string, string> = {
  // canonical names
  hero_section:      'heroSection',
  trust_badges:      'trustBadges',
  content_block:     'contentBlock',
  definition_block:  'definitionBlock',
  callout_block:     'calloutBlock',
  example_card:      'exampleCard',
  table_block:       'tableBlock',
  faq_block:         'faqBlock',
  cta_block:         'ctaBlock',
  calculator_block:  'calculatorBlock',
  // alternate names used in seed JSON files
  callout:           'calloutBlock',
  faq:               'faqBlock',
  cta_banner:        'ctaBlock',
  rate_calculator:   'calculatorBlock',
  definition:        'definitionBlock',
  example:           'exampleCard',
  table:             'tableBlock',
  hero:              'heroSection',
  trust_bar:         'trustBadges',
  image_block:       'imageBlock',
  image:             'imageBlock',
}

/** Convert table rows: string[][] → { _key, _type:'tableRow', cells:string[] }[] */
function normalizeTableRows(rows: unknown[]): unknown[] {
  return rows.map((row, i) => {
    if (Array.isArray(row)) {
      return { _type: 'tableRow', _key: `row_${i}`, cells: row.map(String) }
    }
    // already an object — ensure _key and _type
    const r = { ...(row as Record<string, unknown>) }
    if (!r._type) r._type = 'tableRow'
    if (!r._key) r._key = `row_${i}`
    return r
  })
}

/** Convert component field → _type and add deterministic _key */
function addKeys(arr: unknown[]): unknown[] {
  return arr.map((item, i) => {
    if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
      const o = { ...(item as Record<string, unknown>) }
      // Map "component" → "_type"
      if (typeof o.component === 'string') {
        o._type = COMPONENT_TYPE_MAP[o.component] ?? o.component
        delete o.component
      }
      // Fix table rows: string[][] → { _key, _type, cells }[]
      if (o._type === 'tableBlock' && Array.isArray(o.rows)) {
        o.rows = normalizeTableRows(o.rows as unknown[])
      }
      // Fix faq items: add _type:'faqItem' and _key to each
      if (o._type === 'faqBlock' && Array.isArray(o.items)) {
        o.items = (o.items as Record<string, unknown>[]).map((item, j) => ({
          _type: 'faqItem',
          _key: `faq_${j}`,
          ...item,
        }))
      }
      // Fix bullets/ordered in contentBlock: add _key to each
      if (o._type === 'contentBlock') {
        if (Array.isArray(o.bullets)) {
          o.bullets = (o.bullets as Record<string, unknown>[]).map((b, j) =>
            typeof b === 'string'
              ? { _type: 'object', _key: `bullet_${j}`, text: b }
              : { _key: `bullet_${j}`, ...b }
          )
        }
        if (Array.isArray(o.ordered)) {
          o.ordered = (o.ordered as Record<string, unknown>[]).map((b, j) =>
            typeof b === 'string'
              ? { _type: 'object', _key: `ordered_${j}`, text: b }
              : { _key: `ordered_${j}`, ...b }
          )
        }
        if (Array.isArray(o.paragraphs)) {
          o.paragraphs = (o.paragraphs as unknown[]).map(p => typeof p === 'string' ? p : String(p))
        }
      }
      if (!o._key) {
        o._key = `component_${i}_${((o._type as string) ?? 'item').replace(/[^a-z0-9]/gi, '_')}`
      }
      return o
    }
    return item
  })
}

// ─── POST /api/admin/seed-page ──────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // 1. Parse request
    const body = await req.json().catch(() => null)
    if (!body || typeof body.slug !== 'string') {
      return NextResponse.json({ error: 'Missing required field: slug' }, { status: 400 })
    }

    const { slug } = body as { slug: string }

    // Validate slug format (alphanumeric, hyphens only — prevent path traversal)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 })
    }

    // 2. Read seed JSON
    const seedPath = path.join(process.cwd(), 'src', 'data', 'insurance', `${slug}.json`)

    if (!fs.existsSync(seedPath)) {
      return NextResponse.json({ error: `Seed file not found: ${slug}.json` }, { status: 404 })
    }

    const raw = JSON.parse(fs.readFileSync(seedPath, 'utf-8'))

    // 3. Strip private fields (_writer_notes, _guidance, _meta)
    const stripped = stripPrivate(raw) as Record<string, unknown>

    // 4. Build page_data array with Sanity _key on each component
    const pageDataRaw = Array.isArray(raw.page_data) ? (raw.page_data as unknown[]) : []
    const pageDataStripped = stripPrivate(pageDataRaw) as unknown[]
    const pageDataKeyed = addKeys(pageDataStripped)

    // 5. Build the Sanity document
    const sanityDoc = {
      _type: 'insurancePage' as const,
      _id: `insurancePage-${slug}`,
      title: typeof stripped.title === 'string' ? stripped.title : slug,
      slug: {
        _type: 'slug' as const,
        current: slug,
      },
      tag: typeof stripped.tag === 'string' ? stripped.tag : undefined,
      read_time: typeof stripped.read_time === 'string' ? stripped.read_time : undefined,
      prepared_by: typeof stripped.prepared_by === 'string' ? stripped.prepared_by : undefined,
      reviewed_by: typeof stripped.reviewed_by === 'string' ? stripped.reviewed_by : undefined,
      seo_description: typeof stripped.seo_description === 'string'
        ? stripped.seo_description
        : undefined,
      page_data: pageDataKeyed,
    }

    // 6. Push to Sanity via writeClient
    if (!process.env.SANITY_API_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'SANITY_API_WRITE_TOKEN is not configured' },
        { status: 500 }
      )
    }

    const result = await writeClient.createOrReplace(sanityDoc)

    return NextResponse.json({
      success: true,
      sanityId: result._id,
      slug,
      title: sanityDoc.title,
      components: pageDataKeyed.length,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[seed-page] ERROR:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ─── GET /api/admin/seed-page?slug=xxx  (check if page exists in Sanity) ───

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')

    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: 'Invalid or missing slug' }, { status: 400 })
    }

    const doc = await writeClient.getDocument(`insurancePage-${slug}`)

    return NextResponse.json({
      exists: !!doc,
      sanityId: doc?._id ?? null,
      slug,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
