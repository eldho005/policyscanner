// ── Shared sub-types ─────────────────────────────────────────────────────────

export interface BulletItem {
  bold?: string   // optional bold prefix, e.g. "Income replacement"
  text: string    // rest of the sentence
}

export interface FaqEntry {
  question: string
  answer: string  // plain text — no HTML
}

// ── Component discriminated union ────────────────────────────────────────────

export interface HeroComponent {
  component: 'hero_section'
  title: string
  description: string
}

export interface TrustBadgesComponent {
  component: 'trust_badges'
}

export interface ContentBlock {
  component: 'content_block'
  id: string                    // used as anchor id for TOC (required for TOC entries — use '' to skip TOC)
  heading: string               // plain text — no HTML tags
  heading_level?: 2 | 3        // defaults to 2
  paragraphs?: string[]         // plain text paragraphs
  bullets?: BulletItem[]        // unordered list
  ordered?: BulletItem[]        // ordered list
  image?: { src: string; alt: string }  // optional inline section image
}

export interface DefinitionBlock {
  component: 'definition_block'
  term: string
  definition: string
}

export interface CalloutBlock {
  component: 'callout'
  type: 'insight' | 'tip' | 'warning' | 'note'
  title?: string
  text: string
}

export interface ExampleCard {
  component: 'example_card'
  title: string
  paragraphs: string[]
}

export interface TableBlock {
  component: 'table'
  title?: string
  headers: string[]
  rows: string[][]
  footnote?: string
}

export interface FaqBlock {
  component: 'faq'
  items: FaqEntry[]
}

export interface CtaBanner {
  component: 'cta_banner'
  heading: string
  body?: string
  button_text: string
  url: string
}

export interface RateCalculator {
  component: 'rate_calculator'
  title?: string
}

// Union of all possible page components
export type InsurancePageComponent =
  | HeroComponent
  | TrustBadgesComponent
  | ContentBlock
  | DefinitionBlock
  | CalloutBlock
  | ExampleCard
  | TableBlock
  | FaqBlock
  | CtaBanner
  | RateCalculator

// ── Page data ────────────────────────────────────────────────────────────────

export interface InsurancePageData {
  title: string
  seo_description: string
  slug: string
  tag: string
  read_time: string
  prepared_by: string
  reviewed_by: string
  page_data: InsurancePageComponent[]
}
