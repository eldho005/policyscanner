// ═══════════════════════════════════════════════════════════════
//  Quote Detail Service — Fetches renewal schedule & plan
//  descriptions for a specific plan from the Rank Survey.
// ═══════════════════════════════════════════════════════════════

import type { WinQuoteParams } from "@/lib/types/quote.types";
import {
  WQ_PROFILE_CODE,
  PROVINCE_CODES,
  PRODUCT_MAPPING,
  TERM_ITEM_CODES,
  GENDER_CODES,
} from "@/lib/config/winquote.config";
import { callWinQuote } from "@/lib/providers/winquote.provider";

interface DetailRequest {
  companyNameCode: string;
  companyFileCode: string;
  premium: number;
  companyName: string;
  productName: string;
  gender: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  coverage: number;
  province: string;
  type: string;
  termLength?: string;
}

export interface RenewalRow {
  year: number;
  age: number;
  premium: number;
  cumulative: number;
}

export interface DetailResponse {
  success: boolean;
  renewalSchedule: RenewalRow[];
  planDescription: string;
  error?: string;
}

export async function getQuoteDetail(
  req: DetailRequest,
): Promise<DetailResponse> {
  if (!WQ_PROFILE_CODE) {
    return { success: false, renewalSchedule: [], planDescription: "", error: "API not configured" };
  }

  const product = PRODUCT_MAPPING[req.type] ?? PRODUCT_MAPPING.term;
  const locationCode = PROVINCE_CODES[req.province] ?? PROVINCE_CODES.ontario;
  let productItem = product.pi;
  if (req.type === "term" && req.termLength && req.termLength !== "all") {
    productItem = TERM_ITEM_CODES[req.termLength] ?? product.pi;
  }
  const dob = `${req.dobMonth}${req.dobDay}${req.dobYear}`;

  // Fetch renewal schedule (-rt1) and plan description (-rtP) in parallel
  const [renewalResult, planDescResult] = await Promise.allSettled([
    fetchRenewalSchedule(req, dob, locationCode, product.pg, productItem),
    fetchPlanDescription(req, dob, locationCode, product.pg, productItem),
  ]);

  const renewalSchedule = renewalResult.status === "fulfilled" ? renewalResult.value : [];
  const planDescription = planDescResult.status === "fulfilled" ? planDescResult.value : "";

  // If both fetches failed, report as unsuccessful
  if (renewalResult.status === "rejected" && planDescResult.status === "rejected") {
    console.error("[QuoteDetail] Both renewal and description fetches failed");
    return {
      success: false,
      renewalSchedule: [],
      planDescription: "",
      error: "Unable to fetch plan details",
    };
  }

  return {
    success: true,
    renewalSchedule,
    planDescription,
  };
}

async function fetchRenewalSchedule(
  req: DetailRequest,
  dob: string,
  locationCode: string,
  pg: string,
  pi: string,
): Promise<RenewalRow[]> {
  const params: WinQuoteParams = {
    cc: "ca",
    pc: WQ_PROFILE_CODE,
    rt: "1",                    // Detail Renewal Schedule
    qt: "0",
    of: "json",
    lang: "en",
    lc: locationCode,
    g: GENDER_CODES[req.gender] ?? "1",
    dob,
    fa: String(req.coverage),
    pg,
    pi,
    pm: "3:0",
    r: "R",                     // Use broad risk for detail
    fmt: true,
  };

  // Required for detail reports: company code, file code, first-year premium
  params.fn = req.companyNameCode;
  params.fp = req.companyFileCode;
  params.fyq = String(req.premium);

  try {
    const raw = await callWinQuote(params);
    return parseRenewalSchedule(raw);
  } catch {
    return [];
  }
}

async function fetchPlanDescription(
  req: DetailRequest,
  dob: string,
  locationCode: string,
  pg: string,
  pi: string,
): Promise<string> {
  const params: WinQuoteParams = {
    cc: "ca",
    pc: WQ_PROFILE_CODE,
    rt: "P",                    // Plan Description
    qt: "0",
    of: "json",
    lang: "en",
    lc: locationCode,
    g: GENDER_CODES[req.gender] ?? "1",
    dob,
    fa: String(req.coverage),
    pg,
    pi,
    pm: "3:0",
    r: "R",
    fmt: true,
  };

  // Required: company name + product name
  params.fn = req.companyNameCode;
  params.fp = req.companyFileCode;
  params.fyq = String(req.premium);
  params.pdcn = `'${req.companyName}'`;
  params.pdpn = `'${req.productName}'`;

  try {
    const raw = await callWinQuote(params);
    return extractPlanDescription(raw);
  } catch {
    return "";
  }
}

// ── Parsers ──────────────────────────────────────────────────

function parseRenewalSchedule(raw: unknown): RenewalRow[] {
  if (!raw || typeof raw !== "object") return [];
  const obj = raw as Record<string, unknown>;

  // Try multiple possible response shapes for detail report
  let records: unknown[] = [];

  // Shape: { results: { record: { recordSet: [...] } } }
  const results = obj.results as Record<string, unknown> | undefined;
  if (results) {
    const record = results.record as Record<string, unknown> | undefined;
    if (record) {
      if (Array.isArray(record.recordSet)) {
        records = record.recordSet;
      } else if (Array.isArray(record.renewalSchedule)) {
        records = record.renewalSchedule;
      }
    }
    if (Array.isArray(results.renewalSchedule)) {
      records = results.renewalSchedule;
    }
  }

  // Shape: { renewalSchedule: [...] }
  if (!records.length && Array.isArray(obj.renewalSchedule)) {
    records = obj.renewalSchedule;
  }

  // Shape: { data: [...] }
  if (!records.length && Array.isArray(obj.data)) {
    records = obj.data;
  }

  if (!records.length) return [];

  let cumulative = 0;
  return records.map((item, i) => {
    const rec = item as Record<string, unknown>;
    const premium = toNum(rec.premium ?? rec.annualPremium ?? rec.renewalPremium);
    cumulative += premium;
    return {
      year: toNum(rec.year ?? rec.policyYear) || i + 1,
      age: toNum(rec.age ?? rec.attainedAge),
      premium,
      cumulative: Math.round(cumulative * 100) / 100,
    };
  });
}

function extractPlanDescription(raw: unknown): string {
  if (!raw || typeof raw !== "object") return "";
  const obj = raw as Record<string, unknown>;

  // Try multiple shapes
  if (typeof obj.description === "string") return obj.description;
  if (typeof obj.planDescription === "string") return obj.planDescription;

  const results = obj.results as Record<string, unknown> | undefined;
  if (results) {
    if (typeof results.description === "string") return results.description;
    if (typeof results.planDescription === "string") return results.planDescription;
    // Some responses wrap text in an array of lines
    if (Array.isArray(results.text)) return results.text.join("\n");
  }

  // Fallback: stringify the first 500 chars of the response for debugging
  return "";
}

function toNum(v: unknown): number {
  if (v === undefined || v === null || v === "") return 0;
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(/[$,]/g, ""));
  return Number.isFinite(n) ? n : 0;
}
