// ═══════════════════════════════════════════════════════════════
//  Mock Fallback — Returns realistic mock data when WinQuote
//  is unavailable or not configured. Adapts to the user's
//  actual form selections so the UI still feels dynamic.
// ═══════════════════════════════════════════════════════════════

import type {
  QuoteRequest,
  QuoteResult,
} from "@/lib/types/quote.types";
import { calculateAge } from "@/lib/config/winquote.config";

/**
 * Generate mock results that respond to the user's form input.
 * Prices scale with coverage/term/tobacco; tags are pre-assigned.
 */
export function getMockResults(req: QuoteRequest, userRiskClass: string): QuoteResult[] {
  const coverage = req.coverage || 250_000;
  const isSmoker = req.tobacco === "yes";
  const age = calculateAge(req.dobMonth, req.dobDay, req.dobYear);
  const termFromReq = req.termLength ? parseInt(req.termLength, 10) : 0;
  const defaultTerm = req.type === "whole" ? 100 : (termFromReq >= 10 ? termFromReq : 20);

  const basePlans: Omit<QuoteResult, "coverage" | "term" | "untilAge" | "annualPrice" | "waiverOfPremium" | "totalPayment">[] = [
    {
      id: "1",
      brand: "ivari",
      product: `Term ${defaultTerm}`,
      tag: "best-value",
      tagLabel: "Best Value",
      basePrice: 10.04,
      riskClass: userRiskClass,
      features: {
        included: ["Term Conversion", "Transport Benefit", "Terminal Illness", "Guaranteed Renewal"],
        riders: ["Accidental Death", "Critical Illness", "Child Coverage", "Disability Waiver"],
      },
      meta: { companyNameCode: "IVR", companyFileCode: "", companyUrl: "", contractUrl: "" },
    },
    {
      id: "2",
      brand: "Assumption Life",
      product: `Simplified ${defaultTerm}`,
      tag: "no-medical",
      tagLabel: "No Medical",
      basePrice: 14.20,
      riskClass: "S",
      features: {
        included: ["Simplified Underwriting", "Auto Renewal", "Conversion Privilege", "Disability Benefit"],
        riders: ["Accidental Death", "Critical Illness", "Waiver of Premium", "Family Income"],
      },
      meta: { companyNameCode: "ASM", companyFileCode: "", companyUrl: "", contractUrl: "" },
    },
    {
      id: "3",
      brand: "Canada Protection Plan",
      product: `Term ${defaultTerm}`,
      tag: "standard",
      tagLabel: "Standard",
      basePrice: 18.50,
      riskClass: userRiskClass,
      features: {
        included: ["Guaranteed Renewal", "Term Conversion", "Waiver of Premium", "Living Benefits"],
        riders: ["Accidental Death", "Children's Term", "Critical Illness", "Disability Waiver"],
      },
      meta: { companyNameCode: "CPP", companyFileCode: "", companyUrl: "", contractUrl: "" },
    },
    {
      id: "4",
      brand: "Manulife",
      product: `Term ${defaultTerm}`,
      tag: "standard",
      tagLabel: "Standard",
      basePrice: 23.85,
      riskClass: userRiskClass,
      features: {
        included: ["Guaranteed Renewal", "Term Conversion", "Terminal Illness", "Worldwide Coverage"],
        riders: ["Accidental Death", "Critical Illness", "Disability Waiver", "Child Coverage"],
      },
      meta: { companyNameCode: "MFC", companyFileCode: "", companyUrl: "", contractUrl: "" },
    },
    {
      id: "5",
      brand: "Sun Life",
      product: `Guaranteed ${defaultTerm}`,
      tag: "no-medical",
      tagLabel: "No Medical",
      basePrice: 26.40,
      riskClass: "G",
      features: {
        included: ["Guaranteed Acceptance", "Auto Renewal", "Terminal Illness Benefit", "Premium Waiver"],
        riders: ["Accidental Death", "Children's Term", "Critical Illness", "Family Income"],
      },
      meta: { companyNameCode: "SLF", companyFileCode: "", companyUrl: "", contractUrl: "" },
    },
  ];

  // Scale prices based on user inputs
  const coverageFactor = coverage / 250_000;
  const smokerFactor = !isSmoker ? 1.0
    : (req.tobaccoType === "cannabis" || req.tobaccoType === "vaping") ? 1.25 : 1.65;
  const ageFactor = age > 50 ? 1.4 : age > 40 ? 1.15 : 1.0;
  const termFactor = defaultTerm >= 30 ? 1.9 : defaultTerm >= 25 ? 1.6 : defaultTerm >= 20 ? 1.4 : defaultTerm >= 15 ? 1.15 : 1.0;

  return basePlans.map((plan) => {
    const monthly = Math.round(
      plan.basePrice * coverageFactor * smokerFactor * ageFactor * termFactor * 100,
    ) / 100;

    return {
      ...plan,
      basePrice: monthly,
      annualPrice: Math.round(monthly * 11.5 * 100) / 100, // ~4% annual discount
      waiverOfPremium: 0,
      totalPayment: monthly,
      coverage,
      term: defaultTerm,
      untilAge: age + defaultTerm,
    };
  });
}
