// ============================================================
// POLICYSCANNER — SEO PAGE PLAN MANIFEST
// Single source of truth for the 20-page lean hub strategy.
// Admin dashboard reads this to know what exists, what's seeded,
// what's live.
// ============================================================

export type PageLevel = 1 | 2 | 3 | 4 | 5

export interface SeoPlanPage {
  /** URL path under /life-insurance, e.g. "term/20-year" */
  path: string
  /** Sanity slug & JSON filename key (-- for nested) */
  slug: string
  /** Display title */
  title: string
  /** JSON seed filename in src/data/insurance/ */
  seedFile: string
  /** Hub level from the plan */
  level: PageLevel
  /** Primary target keyword */
  keyword: string
  /** Target word count range */
  wordCount: string
  /** Build schedule week (1-12) */
  week: number
  /** Page type tag */
  type: 'hub' | 'product' | 'comparison' | 'demographic' | 'tool' | 'money'
  /** Internal links this page should contain */
  linksTo: string[]
}

export const SEO_PAGES: SeoPlanPage[] = [
  // ── LEVEL 1: Main Hub ───────────────────────────────────────
  {
    path: '',
    slug: 'life-insurance',
    title: 'Life Insurance Canada: Complete Guide',
    seedFile: 'life-insurance.json',
    level: 1,
    keyword: 'life insurance canada',
    wordCount: '1,200–1,500',
    week: 1,
    type: 'hub',
    linksTo: ['term', 'whole-life', 'quotes', 'calculator', 'critical-illness', 'disability'],
  },

  // ── LEVEL 2: Category Hubs ──────────────────────────────────
  {
    path: 'term',
    slug: 'term',
    title: 'Term Life Insurance Canada',
    seedFile: 'term.json',
    level: 2,
    keyword: 'term life insurance canada',
    wordCount: '2,000–2,500',
    week: 4,
    type: 'hub',
    linksTo: ['term--20-year', 'term--10-year', 'term--30-year', 'calculator', 'quotes'],
  },
  {
    path: 'whole-life',
    slug: 'whole-life',
    title: 'Whole Life Insurance Canada',
    seedFile: 'whole-life.json',
    level: 2,
    keyword: 'whole life insurance canada',
    wordCount: '2,000–2,500',
    week: 7,
    type: 'hub',
    linksTo: ['term-vs-whole-life', 'quotes', 'calculator'],
  },
  {
    path: 'quotes',
    slug: 'quotes',
    title: 'Life Insurance Quotes Canada',
    seedFile: 'quotes.json',
    level: 2,
    keyword: 'life insurance quotes canada',
    wordCount: '1,200–1,500',
    week: 2,
    type: 'money',
    linksTo: ['term', 'calculator', 'how-much-do-i-need'],
  },

  // ── LEVEL 3: Product / Term Length Pages ────────────────────
  {
    path: 'term/20-year',
    slug: 'term--20-year',
    title: '20-Year Term Life Insurance',
    seedFile: 'term--20-year.json',
    level: 3,
    keyword: '20 year term life insurance',
    wordCount: '2,000–2,500',
    week: 5,
    type: 'product',
    linksTo: ['term', 'term--10-year', 'term--30-year', 'mortgage-protection', 'quotes', 'calculator'],
  },
  {
    path: 'term/10-year',
    slug: 'term--10-year',
    title: '10-Year Term Life Insurance',
    seedFile: 'term--10-year.json',
    level: 3,
    keyword: '10 year term life insurance',
    wordCount: '1,800–2,200',
    week: 6,
    type: 'product',
    linksTo: ['term', 'term--20-year', 'term--30-year', 'quotes'],
  },
  {
    path: 'term/30-year',
    slug: 'term--30-year',
    title: '30-Year Term Life Insurance',
    seedFile: 'term--30-year.json',
    level: 3,
    keyword: '30 year term life insurance',
    wordCount: '1,800–2,200',
    week: 6,
    type: 'product',
    linksTo: ['term', 'term--20-year', 'term--10-year', 'quotes'],
  },
  {
    path: 'critical-illness',
    slug: 'critical-illness',
    title: 'Critical Illness Insurance Canada',
    seedFile: 'critical-illness.json',
    level: 3,
    keyword: 'critical illness insurance canada',
    wordCount: '2,000–2,500',
    week: 8,
    type: 'product',
    linksTo: ['critical-illness-vs-disability', 'quotes', 'calculator'],
  },
  {
    path: 'disability',
    slug: 'disability',
    title: 'Disability Insurance Canada',
    seedFile: 'disability.json',
    level: 3,
    keyword: 'disability insurance canada',
    wordCount: '2,000–2,500',
    week: 8,
    type: 'product',
    linksTo: ['critical-illness-vs-disability', 'self-employed', 'quotes'],
  },
  {
    path: 'mortgage-protection',
    slug: 'mortgage-protection',
    title: 'Mortgage Protection Insurance vs Bank Insurance',
    seedFile: 'mortgage-protection.json',
    level: 3,
    keyword: 'mortgage life insurance canada',
    wordCount: '1,800–2,200',
    week: 7,
    type: 'product',
    linksTo: ['term--20-year', 'for-homeowners', 'quotes'],
  },
  {
    path: 'no-medical',
    slug: 'no-medical',
    title: 'No Medical Life Insurance Canada',
    seedFile: 'no-medical.json',
    level: 3,
    keyword: 'no medical life insurance canada',
    wordCount: '1,800–2,200',
    week: 8,
    type: 'product',
    linksTo: ['over-50', 'quotes', 'calculator'],
  },
  {
    path: 'calculator',
    slug: 'calculator',
    title: 'Life Insurance Calculator Canada',
    seedFile: 'calculator.json',
    level: 3,
    keyword: 'life insurance calculator canada',
    wordCount: '1,000–1,200',
    week: 3,
    type: 'tool',
    linksTo: ['quotes', 'how-much-do-i-need', 'term'],
  },

  // ── LEVEL 4: Comparison Pages ────────────────────────────────
  {
    path: 'term-vs-whole-life',
    slug: 'term-vs-whole-life',
    title: 'Term vs Whole Life Insurance',
    seedFile: 'term-vs-whole-life.json',
    level: 4,
    keyword: 'term vs whole life insurance',
    wordCount: '2,200–2,800',
    week: 9,
    type: 'comparison',
    linksTo: ['term', 'whole-life', 'quotes', 'calculator'],
  },
  {
    path: 'how-much-do-i-need',
    slug: 'how-much-do-i-need',
    title: 'How Much Life Insurance Do I Need?',
    seedFile: 'how-much-do-i-need.json',
    level: 4,
    keyword: 'how much life insurance do i need',
    wordCount: '1,800–2,200',
    week: 9,
    type: 'comparison',
    linksTo: ['calculator', 'quotes', 'term'],
  },
  {
    path: 'critical-illness-vs-disability',
    slug: 'critical-illness-vs-disability',
    title: 'Critical Illness vs Disability Insurance',
    seedFile: 'critical-illness-vs-disability.json',
    level: 4,
    keyword: 'critical illness vs disability insurance',
    wordCount: '1,800–2,200',
    week: 10,
    type: 'comparison',
    linksTo: ['critical-illness', 'disability', 'quotes'],
  },

  // ── LEVEL 5: Demographic / Use Case ─────────────────────────
  {
    path: 'for-young-families',
    slug: 'for-young-families',
    title: 'Life Insurance for Young Families',
    seedFile: 'for-young-families.json',
    level: 5,
    keyword: 'life insurance for young families',
    wordCount: '1,500–1,800',
    week: 10,
    type: 'demographic',
    linksTo: ['term--20-year', 'how-much-do-i-need', 'quotes'],
  },
  {
    path: 'for-homeowners',
    slug: 'for-homeowners',
    title: 'Life Insurance for Homeowners',
    seedFile: 'for-homeowners.json',
    level: 5,
    keyword: 'life insurance for homeowners',
    wordCount: '1,500–1,800',
    week: 11,
    type: 'demographic',
    linksTo: ['mortgage-protection', 'term--20-year', 'quotes'],
  },
  {
    path: 'over-50',
    slug: 'over-50',
    title: 'Life Insurance Over 50 Canada',
    seedFile: 'over-50.json',
    level: 5,
    keyword: 'life insurance over 50 canada',
    wordCount: '1,500–1,800',
    week: 11,
    type: 'demographic',
    linksTo: ['no-medical', 'whole-life', 'quotes'],
  },
  {
    path: 'self-employed',
    slug: 'self-employed',
    title: 'Life Insurance for Self-Employed Canadians',
    seedFile: 'self-employed.json',
    level: 5,
    keyword: 'life insurance self employed canada',
    wordCount: '1,500–1,800',
    week: 12,
    type: 'demographic',
    linksTo: ['disability', 'critical-illness', 'quotes'],
  },

  // ── Existing deep page (already written) ────────────────────
  {
    path: 'what-is-term-life-insurance',
    slug: 'what-is-term-life-insurance',
    title: 'What Is Term Life Insurance?',
    seedFile: 'what-is-term-life-insurance.json',
    level: 3,
    keyword: 'what is term life insurance',
    wordCount: '2,000–2,500',
    week: 4,
    type: 'product',
    linksTo: ['term', 'term--20-year', 'quotes', 'calculator'],
  },
]

export const TOTAL_PAGES = SEO_PAGES.length

/** Group pages by week for dashboard scheduling view */
export function pagesByWeek(): Record<number, SeoPlanPage[]> {
  return SEO_PAGES.reduce((acc, page) => {
    acc[page.week] = acc[page.week] ?? []
    acc[page.week].push(page)
    return acc
  }, {} as Record<number, SeoPlanPage[]>)
}
