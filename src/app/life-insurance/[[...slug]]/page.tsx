import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import PublicLayout from '@/components/PublicLayout'
import InsurancePage from '@/components/insurance/InsurancePage'
import { InsurancePageData } from '@/types/insurance'
import { getInsurancePage } from '@/sanity/queries'
import { previewClient } from '@/sanity/client'

interface Props {
  params: Promise<{ slug?: string[] }>
}

function buildSlugString(slugParts: string[]): string {
  if (!slugParts || slugParts.length === 0) return 'life-insurance'
  return slugParts.join('--')
}

function loadLocalPageData(slugParts: string[]): InsurancePageData | null {
  const filename = slugParts.length === 0 ? 'life-insurance.json' : slugParts.join('--') + '.json'
  const filePath = path.join(process.cwd(), 'src', 'data', 'insurance', filename)
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw) as InsurancePageData
  } catch {
    return null
  }
}

async function loadPageData(slugParts: string[], isDraft: boolean): Promise<InsurancePageData | null> {
  const slug = buildSlugString(slugParts)

  // 1. Try Sanity first (when env vars are configured)
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    const sanityPage = await getInsurancePage(slug, isDraft ? previewClient : undefined)
    if (sanityPage) return sanityPage
  }

  // 2. Fall back to local JSON files
  return loadLocalPageData(slugParts)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await loadPageData(slug ?? [], false)
  if (!page) return { title: 'Page Not Found' }
  return {
    title: `${page.title} | PolicyScanner`,
    description: page.seo_description,
  }
}

export default async function LifeInsurancePage({ params }: Props) {
  const { slug } = await params
  const { isEnabled: isDraft } = await draftMode()
  const page = await loadPageData(slug ?? [], isDraft)

  if (!page) {
    notFound()
  }

  const currentSlug = slug && slug.length > 0 ? slug.join('--') : 'life-insurance'

  return (
    <PublicLayout
      extraCss={['/css/content_global.css', '/css/component.css', '/css/component_calculator.css']}
      extraJs={['/js/components.js', '/js/component_calculator.js']}
    >
      {isDraft && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
          background: '#0070f3', color: '#fff', textAlign: 'center',
          padding: '8px 16px', fontSize: '14px', fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
        }}>
          <span>🔵 Draft Preview Mode — showing unpublished edits</span>
          <a
            href={`/api/draft/disable?redirect=/life-insurance/${currentSlug}`}
            style={{ color: '#fff', textDecoration: 'underline', fontWeight: 400 }}
          >
            Exit Preview
          </a>
        </div>
      )}
      {isDraft && <div style={{ height: '42px' }} />}
      <InsurancePage page={page} />
    </PublicLayout>
  )
}
