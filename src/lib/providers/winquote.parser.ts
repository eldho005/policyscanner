// ═══════════════════════════════════════════════════════════════
//  WinQuote Response Parser / Normaliser
//  Converts raw WQ Rank Survey JSON into QuoteResult[].
//  All WQ-specific data interpretation lives here.
// ═══════════════════════════════════════════════════════════════

import type {
  QuoteResult,
  WinQuoteRawItem,
} from "@/lib/types/quote.types";
import { extractTermFromProduct } from "@/lib/config/winquote.config";

// ── Public API ───────────────────────────────────────────────

/**
 * Parse a raw WinQuote JSON body into a normalised QuoteResult[].
 *
 * @param raw       - The JSON body from WinQuote (shape varies)
 * @param coverage  - Requested face amount (to echo back)
 * @param userAge   - Calculated age of the applicant
 * @param defaultTerm - Fallback term when WQ product name has none
 */
export function parseWinQuoteResponse(
  raw: unknown,
  coverage: number,
  userAge: number,
  defaultTerm: number,
  policyType: string = "term",
): QuoteResult[] {
  const items = extractRecordArray(raw);
  if (!items.length) return [];

  const results: QuoteResult[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const monthly = toNumber(item.premium);
    const annual = toNumber(item.premiumAlt);

    // Skip error-coded premiums (>9 000 000 = disqualification)
    if (monthly > 9_000_000 || monthly <= 0) continue;

    const term = extractTermFromProduct(
      String(item.product ?? ""),
      defaultTerm,
    );

    const riskClass = String(item.risk ?? "R");
    const legend = String(item.legend ?? "");
    const planNote = String(item.planNote ?? "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"');
    const waiver = toNumber(item.waiverOfPremium);
    const totalPmt = toNumber(item.payment);

    results.push({
      id: String(i + 1),
      brand: cleanCompanyName(String(item.company ?? "Unknown")),
      product: cleanProductName(String(item.product ?? "Unknown")),
      tag: "standard",          // assigned later by service layer
      tagLabel: "Standard",
      basePrice: roundPrice(monthly),
      annualPrice: annual > 0 && annual < 9_000_000
        ? roundPrice(annual)
        : roundPrice(monthly * 11.5), // fallback: ~4% annual discount
      coverage,
      term,
      untilAge: userAge + term,
      riskClass,
      waiverOfPremium: roundPrice(waiver),
      totalPayment: totalPmt > 0 ? roundPrice(totalPmt) : roundPrice(monthly + waiver),
      features: deriveFeatures(String(item.product ?? ""), legend, riskClass, planNote, policyType),
      meta: {
        companyNameCode: String(item.companyNameCode ?? ""),
        companyFileCode: String(item.companyFileCode ?? ""),
        companyUrl: String(item.companyUrl ?? ""),
        contractUrl: String(item.abbrContractFName ?? ""),
      },
    });
  }

  return results;
}

// ── Record Extraction ────────────────────────────────────────
// WinQuote JSON varies by version/wrapper. Handle known shapes.

function extractRecordArray(raw: unknown): WinQuoteRawItem[] {
  if (!raw || typeof raw !== "object") return [];

  const obj = raw as Record<string, unknown>;

  // Shape 1 — top-level array
  if (Array.isArray(raw)) return raw as WinQuoteRawItem[];

  // Shape 2 — { records: [...] }
  if (Array.isArray(obj.records)) return obj.records as WinQuoteRawItem[];

  // Shape 3 — { results: { record: { recordSet: [...] } } }
  // This is the actual live WinQuote response shape.
  // Each element has a nested `recordSetHeading` that we flatten.
  const results = obj.results as Record<string, unknown> | undefined;
  if (results) {
    const record = results.record as Record<string, unknown> | undefined;
    if (record && Array.isArray(record.recordSet)) {
      return flattenRecordSetItems(record.recordSet);
    }
  }

  // Shape 4 — { wqResult: { recordSet: { record: [...] } } }
  const wqResult = obj.wqResult as Record<string, unknown> | undefined;
  if (wqResult) {
    const rs = wqResult.recordSet as Record<string, unknown> | undefined;
    if (rs && Array.isArray(rs.record)) return rs.record as WinQuoteRawItem[];
  }

  // Shape 5 — { rankSurvey: [...] }
  if (Array.isArray(obj.rankSurvey)) return obj.rankSurvey as WinQuoteRawItem[];

  // Shape 6 — { rankSurvey: { item: [...] } }
  const rsSurvey = obj.rankSurvey as Record<string, unknown> | undefined;
  if (rsSurvey && Array.isArray(rsSurvey.item))
    return rsSurvey.item as WinQuoteRawItem[];

  // Shape 7 — { data: [...] }
  if (Array.isArray(obj.data)) return obj.data as WinQuoteRawItem[];

  // Unknown shape — always log for diagnostics
  console.warn(
    "[WQ Parser] Unknown response shape. Top-level keys:",
    Object.keys(obj),
  );
  return [];
}

/**
 * Flatten recordSet items: merge `recordSetHeading` fields into the
 * parent record so downstream code can access companyNameCode, etc.
 */
function flattenRecordSetItems(
  items: unknown[],
): WinQuoteRawItem[] {
  return items.map((item) => {
    if (!item || typeof item !== "object") return item as WinQuoteRawItem;
    const rec = item as Record<string, unknown>;
    const heading = rec.recordSetHeading as Record<string, unknown> | undefined;
    if (heading) {
      // Spread heading fields into the record, record-level fields take priority
      const { recordSetHeading: _heading, ...rest } = rec;
      return { ...heading, ...rest } as WinQuoteRawItem;
    }
    return rec as WinQuoteRawItem;
  });
}

// ── Helpers ──────────────────────────────────────────────────

function toNumber(v: string | number | undefined): number {
  if (v === undefined || v === null || v === "") return 0;
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(/[$,]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function roundPrice(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Strip HTML entities and common WQ suffixes from company names */
function cleanCompanyName(name: string): string {
  return name
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s*(®|©|™)\s*/g, "")
    .replace(/\s*(Life\s*Insurance\s*Company\s*of\s*Canada)/i, " Life")
    .replace(/\s+/g, " ")
    .trim();
}

/** Strip tobacco markers [NT], [T], HTML entities, and clean whitespace */
function cleanProductName(name: string): string {
  return name
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s*\[NT\]/gi, "")
    .replace(/\s*\[T\]/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ── Feature Derivation ───────────────────────────────────────
// Without a Detail Report, we infer features from product name
// and legend codes.  This is deliberately conservative.

const LEGEND_MAP: Record<string, string> = {
  HW: "Height / Weight assessment",
  BP: "Blood pressure check",
  Chl: "Cholesterol screening",
  Alc: "Alcohol declaration",
  Drug: "Drug screening",
  FamHist: "Family history review",
};

function deriveFeatures(
  productName: string,
  legend: string,
  riskClass: string,
  planNote: string = "",
  policyType: string = "term",
): { included: string[]; riders: string[] } {
  const included: string[] = [];
  const riders: string[] = [];

  const lc = productName.toLowerCase();
  const pn = planNote.toLowerCase();

  if (policyType === "whole") {
    // Whole life features
    included.push("Guaranteed Cash Value");
    if (pn.includes("participating") || lc.includes("par"))
      included.push("Participating");
    else
      included.push("Non-Participating");
    if (pn.includes("level benefit") || !pn.includes("decreasing"))
      included.push("Level Benefit");
    if (lc.includes("paid up") || lc.includes("pay-up") || pn.includes("paid up"))
      included.push("Paid-Up Option");
  } else if (policyType === "critical") {
    // Critical illness features
    included.push("Lump Sum Payment");
    if (lc.includes("rop") || pn.includes("return of premium"))
      included.push("Return of Premium");
    if (pn.includes("level benefit") || !pn.includes("decreasing"))
      included.push("Level Benefit");
    if (lc.includes("renew") || pn.includes("renew"))
      included.push("Guaranteed Renewal");
  } else {
    // Term + Mortgage features
    if (lc.includes("renew") || lc.includes("renewable") || pn.includes("renew"))
      included.push("Guaranteed Renewal");
    if (lc.includes("convert") || lc.includes("conversion") || pn.includes("convert"))
      included.push("Term Conversion");
    if (!included.includes("Guaranteed Renewal"))
      included.push("Guaranteed Renewal");
    if (!included.includes("Term Conversion") && (lc.includes("term") || pn.includes("convert")))
      included.push("Term Conversion");
    if (pn.includes("level benefit"))
      included.push("Level Benefit");
    if (policyType === "mortgage" && (lc.includes("decreas") || pn.includes("decreas")))
      included.push("Decreasing Benefit");
  }

  // Risk-class based (all types)
  if (riskClass === "SP" || riskClass === "P")
    included.push("Preferred Rates");
  if (riskClass === "S" || riskClass === "G")
    included.push("Simplified Underwriting");

  // Riders vary by type
  if (policyType !== "critical") {
    riders.push("Accidental Death");
    riders.push("Critical Illness");
  }
  riders.push("Disability Waiver");
  if (policyType === "term" || policyType === "mortgage")
    riders.push("Child Coverage");

  // Underwriting requirements from legend
  if (legend) {
    const codes = legend.split(/[:\s,;]+/).filter(Boolean);
    for (const code of codes) {
      if (LEGEND_MAP[code] && !included.includes(LEGEND_MAP[code])) {
        included.push(LEGEND_MAP[code]);
      }
    }
  }

  return { included: included.slice(0, 5), riders: riders.slice(0, 4) };
}
