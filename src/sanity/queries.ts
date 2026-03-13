import { groq } from 'next-sanity'
import { client } from './client'
import imageUrlBuilder from '@sanity/image-url'
import { InsurancePageData } from '@/types/insurance'

// Image URL builder
const builder = imageUrlBuilder(client)
function sanityImageUrl(source: any): string {
  return builder.image(source).auto('format').fit('max').url()
}

// ─── Insurance Pages ─────────────────────────────────────────────────────────

export const insurancePageQuery = groq`
  *[_type == "insurancePage" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    tag,
    read_time,
    seo_description,
    prepared_by,
    reviewed_by,
    page_data[] {
      _type,
      id,
      heading,
      heading_level,
      image {
        asset,
        alt
      },
      "paragraphs": paragraphs,
      term,
      definition,
      type,
      title,
      text,
      headers,
      rows[] { cells },
      footnote,
      description,
      button_text,
      heading_label,
      url,
      body,
      bullets[] { bold, text },
      ordered[] { bold, text },
      items[] { question, answer },
    }
  }
`

export const allInsurancePageSlugsQuery = groq`
  *[_type == "insurancePage"] { "slug": slug.current }
`

export async function getInsurancePage(
  slug: string,
  fetchClient: typeof client = client
): Promise<InsurancePageData | null> {
  try {
    const raw = await fetchClient.fetch(insurancePageQuery, { slug }, { cache: 'no-store' })
    if (!raw) return null
    return mapSanityToInsurancePage(raw)
  } catch {
    return null
  }
}

export async function getAllInsurancePageSlugs(): Promise<string[]> {
  const results = await client.fetch(allInsurancePageSlugsQuery)
  return results.map((r: { slug: string }) => r.slug)
}

// Maps Sanity _type names → component names expected by InsurancePage renderer
function mapSanityToInsurancePage(raw: any): InsurancePageData {
  const typeMap: Record<string, string> = {
    heroSection: 'hero_section',
    contentBlock: 'content_block',
    definitionBlock: 'definition_block',
    calloutBlock: 'callout',
    exampleCard: 'example_card',
    tableBlock: 'table',
    faqBlock: 'faq',
    ctaBlock: 'cta_banner',
    calculatorBlock: 'rate_calculator',
    trustBadges: 'trust_badges',
  }

  const page_data = (raw.page_data || []).map((item: any) => {
    const component = typeMap[item._type] || item._type
    const { _type, _key, ...rest } = item

    // Convert Sanity image reference → { src, alt }
    if (rest.image?.asset) {
      rest.image = {
        src: sanityImageUrl(rest.image),
        alt: rest.image.alt || '',
      }
    }

    // Normalize table rows: Sanity returns rows[].cells[] → flatten to rows[][]
    if (rest.rows && Array.isArray(rest.rows) && rest.rows[0]?.cells) {
      rest.rows = rest.rows.map((row: { cells: string[] }) => row.cells)
    }

    return { component, ...rest }
  })

  return {
    title: raw.title,
    seo_description: raw.seo_description || '',
    slug: raw.slug,
    tag: raw.tag || '',
    read_time: raw.read_time || '',
    prepared_by: raw.prepared_by || '',
    reviewed_by: raw.reviewed_by || '',
    page_data,
  }
}


// ─── Static Pages ─────────────────────────────────────────────────────────────

export const staticPageQuery = groq`
  *[_type == "staticPage" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    seo_description,
    last_updated,
    content
  }
`

export async function getStaticPage(slug: string, fetchClient: typeof client = client) {
  try {
    return await fetchClient.fetch(staticPageQuery, { slug }, { cache: 'no-store' })
  } catch {
    return null
  }
}

