// ═══════════════════════════════════════════════════════════════
//  WinQuote API — Configuration & Mapping Constants
// ═══════════════════════════════════════════════════════════════

// ── Env-driven settings ──────────────────────────────────────

export const WQ_BASE_URL =
  process.env.WINQUOTE_BASE_URL ?? "https://www.winquote.net/cgi-bin/compete.pl";

export const WQ_PROFILE_CODE = process.env.WINQUOTE_PROFILE_CODE ?? "";

export const WQ_TIMEOUT_MS =
  Number(process.env.WINQUOTE_TIMEOUT_MS) || 10_000;

// ── Province → WinQuote Location Code ────────────────────────

export const PROVINCE_CODES: Record<string, string> = {
  alberta: "1",
  "british-columbia": "2",
  manitoba: "3",
  "new-brunswick": "4",
  newfoundland: "5",
  "nova-scotia": "6",
  ontario: "7",
  pei: "8",
  quebec: "9",
  saskatchewan: "10",
  nwt: "11",
  yukon: "12",
  all: "13",
};

// ── Policy Type → WinQuote Product Group (-pg) + Item (-pi) ─

export const PRODUCT_MAPPING: Record<
  string,
  { pg: string; pi: string }
> = {
  term:     { pg: "0", pi: "13" },   // Term → All Term products
  whole:    { pg: "3", pi: "10" },   // Whole Life → All WL
  mortgage: { pg: "0", pi: "6" },    // Decreasing Term (mortgage replacement)
  critical: { pg: "5", pi: "0" },    // Critical Illness → CI T10 (most common)
};

// ── Specific Term Length → WinQuote Product Item (-pi) ───────

export const TERM_ITEM_CODES: Record<string, string> = {
  "5":   "1",    // Term 5
  "10":  "2",    // Term 10
  "15":  "3",    // Term 15
  "20":  "4",    // Term 20
  "25":  "5",    // Term 25
  "30":  "6",    // Term 30
  "35":  "7",    // Term 35
  "40":  "8",    // Term 40
  "65":  "9",    // Term to 65
  "all": "13",   // All Term products
};

// ── Whole Life Pay Period → WinQuote Product Item (-pi) ──────

export const WL_PAY_CODES: Record<string, string> = {
  "100": "6",    // Life Pay (Pay to 100)
  "20":  "3",    // 20-Pay
  "10":  "5",    // 10-Pay
};

// ── Gender → WinQuote Code ───────────────────────────────────

export const GENDER_CODES: Record<string, string> = {
  male: "1",
  female: "2",
};

// ── Risk Utilities (pure functions, no side effects) ─────────

export { deriveRiskClass, calculateAge } from "@/lib/utils/risk-assessment";

// ── Term extraction from product name ────────────────────────

const TERM_RE = /(?:Term|T)[\s-]*(\d+)/i;
const WL_RE   = /(?:WL|Whole\s*Life)[\s-]*(\d+)/i;

/**
 * Extract the policy term (in years) from a WinQuote product name.
 * Falls back to `defaultTerm` when no recognisable pattern is found.
 */
export function extractTermFromProduct(
  productName: string,
  defaultTerm: number,
): number {
  const termMatch = productName.match(TERM_RE);
  if (termMatch) return parseInt(termMatch[1], 10);

  const wlMatch = productName.match(WL_RE);
  if (wlMatch) return parseInt(wlMatch[1], 10);

  return defaultTerm;
}
