// ============================================================
// POLICYSCANNER — SEMANTIC KEYWORD WRITING GUIDE
// Displayed in the admin dashboard alongside each seed file.
// Writers should keep this open while drafting content.
// ============================================================

export interface KeywordSet {
  primary: string
  synonyms: string[]
  lsiTerms: string[]
  entityKeywords: string[]
  actionKeywords: string[]
  densityRule: string
}

export interface WritingRule {
  rule: string
  bad?: string
  good?: string
  explanation: string
}

export interface SectionTemplate {
  name: string
  paragraphs: {
    label: string
    instruction: string
    keywordsToUse: string[]
  }[]
  checklist: string[]
}

// ── Keyword Sets ─────────────────────────────────────────────────

export const KEYWORD_SETS: Record<string, KeywordSet> = {
  "life-insurance": {
    primary: "life insurance",
    synonyms: ["life coverage", "life insurance policy", "life insurance plan", "life protection"],
    lsiTerms: ["death benefit", "beneficiary", "premium", "coverage amount", "policyholder", "insurer", "underwriting", "term length", "cash value"],
    entityKeywords: ["Ontario life insurance", "FSRA", "Ontario insurance regulations", "GTA", "Brampton", "Mississauga", "Toronto", "Canadian life insurance"],
    actionKeywords: ["buy life insurance", "get life insurance", "apply for life insurance", "compare life insurance", "secure coverage"],
    densityRule: "Use 'life insurance' 3–5 times per 500 words. Vary with synonyms for all other uses.",
  },
  "term-life-insurance": {
    primary: "term life insurance",
    synonyms: ["term life coverage", "term insurance", "term life policy", "temporary life insurance", "fixed-term coverage"],
    lsiTerms: ["term length", "renewable term", "convertible term", "level term", "decreasing term", "return of premium", "death benefit", "fixed premiums"],
    entityKeywords: ["Ontario", "FSRA", "Canadian insurers", "GTA families"],
    actionKeywords: ["buy term life", "get term coverage", "compare term rates", "apply for term life"],
    densityRule: "Use 'term life insurance' 3–4 times per 500 words. Use 'term coverage' and 'term policy' as natural variations.",
  },
  "whole-life-insurance": {
    primary: "whole life insurance",
    synonyms: ["whole life coverage", "whole life policy", "permanent life insurance", "lifetime coverage", "permanent protection"],
    lsiTerms: ["cash value", "guaranteed death benefit", "participating whole life", "dividends", "paid-up insurance", "fixed premiums", "tax-deferred growth", "policy loan"],
    entityKeywords: ["Ontario", "Canadian insurers", "Sun Life", "Manulife", "Canada Life", "Equitable Life"],
    actionKeywords: ["buy whole life", "get permanent coverage", "compare whole life rates", "build cash value"],
    densityRule: "Use 'whole life insurance' 3–4 times per 500 words. Alternate with 'permanent insurance' and 'whole life policy'.",
  },
  "life-insurance-quotes": {
    primary: "life insurance quotes",
    synonyms: ["life insurance rates", "insurance quotes", "coverage quotes", "premium quotes", "life insurance pricing"],
    lsiTerms: ["compare quotes", "free quote", "instant quote", "personalized quote", "quote comparison", "multiple insurers", "best rate"],
    entityKeywords: ["Ontario", "Canadian insurers", "FSRA licensed", "20+ insurers"],
    actionKeywords: ["compare quotes", "get a quote", "request a quote", "compare rates", "save money"],
    densityRule: "Use 'life insurance quotes' 2–3 times. Vary heavily with 'rates', 'pricing', 'premium quotes' to avoid stuffing.",
  },
  "life-insurance-cost": {
    primary: "life insurance cost",
    synonyms: ["life insurance price", "premium cost", "insurance rates", "monthly premium", "coverage cost"],
    lsiTerms: ["affordable coverage", "rates by age", "average cost", "competitive rates", "pricing factors", "annual premium", "how much does life insurance cost"],
    entityKeywords: ["Ontario", "Canadian insurers"],
    actionKeywords: ["calculate cost", "compare rates", "save on premiums", "find affordable coverage"],
    densityRule: "Rarely repeat 'cost' exactly — instead show cost using $ amounts, 'pays', 'rates', 'premiums' naturally.",
  },
}

// ── Writing Rules ─────────────────────────────────────────────────

export const WRITING_RULES: WritingRule[] = [
  {
    rule: "First mention = exact keyword",
    explanation: "Use the exact primary keyword in the first sentence of each section. After that, vary with synonyms.",
    bad: "Life insurance ontario is important. Ontario life insurance helps families. Get life insurance Ontario today.",
    good: "Life insurance in Ontario provides essential protection for families. Coverage options range from affordable term policies to permanent whole life plans. Ontario residents can compare quotes from 20+ insurers to find the best rates.",
  },
  {
    rule: "Use the related term ecosystem",
    explanation: "Google sees comprehensive coverage when you use premium, beneficiary, death benefit, underwriting, insurer — not just the headline keyword repeated.",
    bad: "Life insurance is great. Life insurance protects your family. Life insurance pays a benefit.",
    good: "Life insurance is a contract between you and an insurer. You pay monthly premiums; the insurer pays a tax-free death benefit to your beneficiaries.",
  },
  {
    rule: "Include Ontario/FSRA entity keywords",
    explanation: "Mentioning FSRA, Ontario, GTA cities (Mississauga, Brampton, Toronto) signals to Google this is local Ontario content — critical for local SEO rankings.",
  },
  {
    rule: "Use real names, specific $ amounts, Ontario cities",
    explanation: "Specificity creates semantic richness. 'Michael, 38, from Mississauga, needed $750,000 of coverage' is far stronger than 'a customer needed coverage'.",
  },
  {
    rule: "Read it aloud before submitting",
    explanation: "If it sounds robotic or any phrase feels repeated, rewrite. Natural speech = good semantic SEO.",
  },
  {
    rule: "Never keyword-stuff",
    explanation: "If you use the exact keyword more than 5 times per 500 words, it reads like spam and Google penalises it. Vary every second use.",
  },
]

// ── Density Guidelines ────────────────────────────────────────────

export const DENSITY_GUIDELINES = {
  primaryKeyword: { min: 3, max: 5, per: 500, label: "Primary keyword (exact)" },
  synonyms: { min: 5, max: 8, per: 500, label: "Synonyms combined" },
  relatedTerms: { min: 10, max: 15, per: 500, label: "LSI/related terms combined" },
  note: "Total keyword ecosystem should cover ~25–30% of content. Anything more feels stuffed.",
}

// ── Section Template ──────────────────────────────────────────────

export const SECTION_TEMPLATE: SectionTemplate = {
  name: "Universal Section Template",
  paragraphs: [
    {
      label: "Paragraph 1 — Introduction",
      instruction: "Use the primary keyword in the first sentence. Establish context with 2–3 related terms. Include one specific example or number.",
      keywordsToUse: ["primary keyword (exact)", "one related term", "one specific number or example"],
    },
    {
      label: "Paragraph 2 — Explanation",
      instruction: "Use a synonym for the main keyword. Explain using the related terminology ecosystem. Add an Ontario-specific reference if relevant.",
      keywordsToUse: ["one synonym", "2–3 related/LSI terms", "Ontario/FSRA if relevant"],
    },
    {
      label: "Paragraph 3 — Details / Examples",
      instruction: "Use another synonym or variation. Include specific numbers, dollar amounts, and named examples. Use action verbs (get, compare, choose, protect).",
      keywordsToUse: ["another synonym", "specific $ amounts", "action keyword (get/compare/buy)"],
    },
    {
      label: "Paragraph 4 — Conclusion / CTA",
      instruction: "Summarise with a keyword variation. Include a clear next step. Link to related content.",
      keywordsToUse: ["keyword variation", "action CTA", "internal link"],
    },
  ],
  checklist: [
    "Primary keyword used 3–5 times per 500 words",
    "At least 3 different synonyms used",
    "5+ related/LSI terms included",
    "Natural flow — reads aloud without awkwardness",
    "Question patterns addressed (people also ask)",
    "Ontario / FSRA entity keywords where relevant",
    "Action words included (get, compare, buy, apply)",
    "Specific $ amounts and real examples included",
    "Clear CTA at end of section",
  ],
}

// ── Full Written Sample (reference quality) ──────────────────────

export const SAMPLE_SECTION = {
  heading: "What is Life Insurance?",
  targetWords: 180,
  content: `Life insurance is a contract between you and an insurance company that provides financial protection for your family when you die. Here's how it works: you pay monthly or annual premiums to keep your policy active. In return, when you die, the insurer pays a tax-free death benefit to your designated beneficiaries.

Your beneficiaries can use this money for any purpose — paying off your mortgage, covering daily living expenses, funding children's education, or settling outstanding debts. There are no restrictions on how the death benefit is used.

In Ontario, life insurance is regulated by the Financial Services Regulatory Authority (FSRA), which ensures insurance companies operate fairly and protect consumer rights. All policies sold in Ontario must comply with provincial regulations, giving you peace of mind that your coverage is secure.

The amount of coverage you need depends on your income, debts, and family situation. Most financial experts recommend 10–15 times your annual income to adequately protect your loved ones.`,
  keywordAnalysis: {
    primary: { term: "life insurance", count: 4, density: "2.2%" },
    synonyms: ["insurance (3x)", "coverage (2x)", "policy/policies (2x)", "protection (2x)"],
    related: ["death benefit (2x)", "beneficiaries (2x)", "premiums (1x)", "insurer (1x)", "contract (1x)"],
    entity: ["Ontario (2x)", "FSRA (1x)", "provincial (1x)"],
    score: "9.5/10",
  },
}
