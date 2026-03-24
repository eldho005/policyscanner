export interface InsuranceType {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  metaDescription: string;
  features: string[];
  idealFor: string[];
}

export const insuranceTypes: Record<string, InsuranceType> = {
  "term-life": {
    slug: "term-life",
    title: "Term Life Insurance",
    tagline: "Affordable protection for the years that matter most",
    description:
      "Term life insurance provides coverage for a specific period — typically 10, 20, or 30 years. If you pass away during the term, your beneficiaries receive a tax-free death benefit. It's the most affordable type of life insurance and is ideal for covering temporary financial obligations like a mortgage, childcare costs, or income replacement during your working years.",
    metaDescription:
      "Compare term life insurance quotes from 20+ Canadian insurers. Affordable coverage for 10, 20, or 30 years — get your free quote in 2 minutes.",
    features: [
      "Fixed premiums for the entire term",
      "Tax-free death benefit to your beneficiaries",
      "Convertible to permanent coverage with most carriers",
      "Coverage amounts from $100K to $10M+",
      "Most affordable type of life insurance",
    ],
    idealFor: [
      "Young families with a mortgage",
      "Parents with dependent children",
      "Anyone with income to replace",
      "Business owners covering key-person risk",
    ],
  },
  "whole-life": {
    slug: "whole-life",
    title: "Whole Life Insurance",
    tagline: "Permanent protection with guaranteed cash value",
    description:
      "Whole life insurance covers you for your entire lifetime, as long as premiums are paid. It combines a guaranteed death benefit with a cash value component that grows over time on a tax-advantaged basis. Whole life premiums are higher than term, but the policy never expires and builds equity you can borrow against or withdraw.",
    metaDescription:
      "Compare whole life insurance quotes from Canadian insurers. Permanent coverage with cash value — get your free quote in 2 minutes.",
    features: [
      "Coverage for your entire lifetime",
      "Guaranteed cash value that grows tax-deferred",
      "Level premiums that never increase",
      "Potential to earn policy dividends (participating policies)",
      "Can be used as collateral for loans",
    ],
    idealFor: [
      "Estate planning and wealth transfer",
      "Covering final expenses and taxes",
      "Supplementing retirement income",
      "Leaving a guaranteed inheritance",
    ],
  },
  mortgage: {
    slug: "mortgage",
    title: "Mortgage Insurance",
    tagline: "Keep your family in their home, no matter what",
    description:
      "Mortgage life insurance pays off your remaining mortgage balance if you pass away, so your family isn't left with the burden of mortgage payments. Unlike bank-offered mortgage insurance, a policy through an independent broker is portable, personally owned, and pays the benefit to your family — not the lender.",
    metaDescription:
      "Compare mortgage life insurance in Canada. Protect your family from mortgage debt — independent coverage from 20+ insurers. Free quotes in 2 minutes.",
    features: [
      "Benefit goes to your family, not the bank",
      "Policy stays with you if you switch lenders",
      "Level or decreasing coverage options",
      "Often cheaper than bank-offered mortgage insurance",
      "Underwritten at time of purchase — no claims surprises",
    ],
    idealFor: [
      "New homeowners and first-time buyers",
      "Families refinancing their mortgage",
      "Anyone currently paying for bank mortgage insurance",
      "Co-signers on a mortgage",
    ],
  },
  "critical-illness": {
    slug: "critical-illness",
    title: "Critical Illness Insurance",
    tagline: "A financial safety net when health takes an unexpected turn",
    description:
      "Critical illness insurance provides a tax-free lump-sum payment if you're diagnosed with a covered condition such as cancer, heart attack, or stroke. The money is yours to use however you need — whether that's covering treatment costs, replacing lost income, or making lifestyle adjustments during recovery.",
    metaDescription:
      "Compare critical illness insurance in Canada. Tax-free lump-sum payout on diagnosis of cancer, heart attack, stroke & more. Free quotes in 2 minutes.",
    features: [
      "Tax-free lump-sum payout upon diagnosis",
      "Covers 25+ critical conditions with most carriers",
      "Use the money however you choose",
      "Available as standalone or as a rider on life insurance",
      "Return-of-premium option available",
    ],
    idealFor: [
      "Self-employed individuals without group benefits",
      "Families with a single income earner",
      "Anyone with a family history of critical illness",
      "Supplementing existing health coverage",
    ],
  },
};

export const insuranceTypeSlugs = Object.keys(insuranceTypes);
