// ═══════════════════════════════════════════════════════════════
//  Quote Service — Business Logic Orchestrator
//  Translates a validated QuoteRequest into QuoteResult[].
//  Owns risk mapping, provider delegation, tagging & sorting.
// ═══════════════════════════════════════════════════════════════

import type {
  QuoteRequest,
  QuoteResult,
  QuoteApiResponse,
  WinQuoteParams,
} from "@/lib/types/quote.types";
import {
  WQ_PROFILE_CODE,
  PROVINCE_CODES,
  PRODUCT_MAPPING,
  TERM_ITEM_CODES,
  WL_PAY_CODES,
  GENDER_CODES,
  deriveRiskClass,
  calculateAge,
} from "@/lib/config/winquote.config";
import { callWinQuote } from "@/lib/providers/winquote.provider";
import {
  WinQuoteHttpError,
  WinQuoteTimeoutError,
  WinQuoteNetworkError,
} from "@/lib/providers/winquote.provider";
import { parseWinQuoteResponse } from "@/lib/providers/winquote.parser";
import { getMockResults } from "@/lib/services/mock-fallback";
import { enrichWithLogos } from "@/lib/services/carrier.service";

// ── Public Entry Point ───────────────────────────────────────

export async function getQuotes(
  req: QuoteRequest,
): Promise<QuoteApiResponse> {
  const start = Date.now();

  // Compute user's risk class from health profile (used in response meta)
  const userHeightM = req.heightCm
    ? req.heightCm / 100
    : req.heightFt ? (req.heightFt * 12 + (req.heightIn ?? 0)) * 0.0254 : 0;
  const userWeightKg = req.weightKg
    ? req.weightKg
    : req.weightLbs ? req.weightLbs / 2.2046 : 0;
  let userBmi = 0;
  if (userHeightM > 0 && userWeightKg > 0) {
    userBmi = userWeightKg / (userHeightM * userHeightM);
  }
  const userRiskClass = deriveRiskClass(
    req.tobacco,
    req.tobaccoType,
    req.meds,
    req.dui,
    userBmi,
    req.familyHistory ?? "no",
  );

  // If WQ credentials are missing, return mock data immediately
  if (!WQ_PROFILE_CODE) {
    console.warn("[QuoteService] WINQUOTE_PROFILE_CODE not set — using mock data");
    return buildMockResponse(req, start, userRiskClass);
  }

  try {
    const params = buildWinQuoteParams(req, userRiskClass);
    const rawResponse = await callWinQuote(params);

    const userAge = calculateAge(req.dobMonth, req.dobDay, req.dobYear);
    const requestedTerm = req.termLength ? parseInt(req.termLength, 10) : 0;
    const defaultTerm = req.type === "whole" ? 100 : (requestedTerm >= 10 ? requestedTerm : 20);

    let results = parseWinQuoteResponse(
      rawResponse,
      req.coverage,
      userAge,
      defaultTerm,
      req.type,
    );

    if (results.length === 0) {
      console.warn("[QuoteService] WinQuote returned 0 qualifying results — falling back to mock");
      return buildMockResponse(req, start, userRiskClass);
    }

    results = sortByPrice(results);
    results = deduplicateByBrand(results);
    results = assignTags(results);
    results = await enrichWithLogos(results);

    return {
      success: true,
      results,
      meta: {
        totalFound: results.length,
        queryTimeMs: Date.now() - start,
        source: "live",
        userRiskClass,
      },
    };
  } catch (err) {
    console.error("[QuoteService] WinQuote call failed:", err);

    // Graceful degradation — return mock data on provider failure
    if (
      err instanceof WinQuoteTimeoutError ||
      err instanceof WinQuoteNetworkError ||
      err instanceof WinQuoteHttpError
    ) {
      return buildMockResponse(req, start, userRiskClass);
    }

    throw err; // unexpected errors bubble up
  }
}

// ── Param Builder ────────────────────────────────────────────

function buildWinQuoteParams(req: QuoteRequest, riskClass: string): WinQuoteParams {
  const product = PRODUCT_MAPPING[req.type] ?? PRODUCT_MAPPING.term;
  const locationCode = PROVINCE_CODES[req.province] ?? PROVINCE_CODES.ontario;

  // Use specific term item code when user selected a term length
  let productItem = product.pi;
  if (req.type === "term" && req.termLength && req.termLength !== "all") {
    productItem = TERM_ITEM_CODES[req.termLength] ?? product.pi;
  }

  // Use specific WL pay period code when user selected a pay period
  if (req.type === "whole" && req.wholePay) {
    productItem = WL_PAY_CODES[req.wholePay] ?? product.pi;
  }

  // DOB format for WQ: MMDDYYYY
  const dob = `${req.dobMonth}${req.dobDay}${req.dobYear}`;

  const params: WinQuoteParams = {
    cc: "ca",
    pc: WQ_PROFILE_CODE,
    rt: "0",                    // Rank Survey
    qt: "0",                    // Single Life — Independent
    of: "json",                 // JSON output
    lang: "en",
    lc: locationCode,
    g: GENDER_CODES[req.gender] ?? "1",
    dob,
    fa: String(req.coverage),
    pg: product.pg,
    pi: productItem,
    pm: "3:0",                  // Monthly (primary) : Annual (secondary)
    r: riskClass,
    fmt: true,                  // Format text values
    pnEXACT: true,              // Strip [NT]/[T] from plan names
    aEXACT: true,               // Only plans qualifying at exact age
    faEXACT: true,              // Only plans qualifying at exact face amount
    ceilp: true,                // Remove error-coded premiums
    ceilrank: "50",             // Limit to top 50 results (ensures all brands survive dedup)
    // Term-specific quality filters (R&C, LT-YRT, NRBIP apply to term & mortgage/decreasing)
    ...(req.type === "term" || req.type === "mortgage" ? {
      rc: "3",                  // Only renewable AND convertible plans
      skipLTYRT: true,          // Remove Level-to-YRT plans (surprise renewals)
      skipNRBIP: true,          // Remove non-renewable-beyond-initial plans
    } : {}),
    skipMFNA: true,             // Skip plans with unavailable modal factors
    eqrnk: true,                // Include tied premiums in ceiling count
    // Waiver of premium only applies to life insurance products, not CI
    ...(req.type !== "critical" ? { prewaiv2pay: true } : {}),
  };

  // Tobacco detail: map specific tobacco type to WQ params
  if (req.tobacco === "yes") {
    if (req.tobaccoType === "cannabis") {
      params.tumrj = "0";        // Marijuana use in last 12 months
    } else if (req.tobaccoType === "vaping") {
      params.tuvap = "0";        // Vaping use in last 12 months
    } else {
      params.tucgt = "0";        // Cigarettes / other — last 12 months
    }
  }

  // Whole Life: show only fully guaranteed products
  if (req.type === "whole") {
    params.pfgp = "0";
  }

  return params;
}

// ── Tag Assignment ───────────────────────────────────────────

function assignTags(results: QuoteResult[]): QuoteResult[] {
  if (results.length === 0) return results;

  const isNoMedical = (r: QuoteResult) =>
    r.riskClass === "S" ||
    r.riskClass === "G" ||
    r.product.toLowerCase().includes("simplified") ||
    r.product.toLowerCase().includes("guaranteed");

  // "Best value" goes to cheapest fully-underwritten plan
  const sorted = [...results].sort((a, b) => a.basePrice - b.basePrice);
  const cheapestId = sorted.find((r) => !isNoMedical(r))?.id;

  return results.map((r) => {
    if (isNoMedical(r)) {
      return { ...r, tag: "no-medical" as const, tagLabel: "No Medical" };
    }
    if (r.id === cheapestId) {
      return { ...r, tag: "best-value" as const, tagLabel: "Best Value" };
    }
    return { ...r, tag: "standard" as const, tagLabel: "Standard" };
  });
}

// ── Sorting ──────────────────────────────────────────────────

function sortByPrice(results: QuoteResult[]): QuoteResult[] {
  return results.sort((a, b) => a.basePrice - b.basePrice);
}

// ── Deduplication ────────────────────────────────────────────
// Keep only the cheapest plan per company. Called after sortByPrice so the
// first occurrence of each brand is always the lowest-priced option.
// Also collapses "X underwritten by Y" into Y when Y already appears,
// since these are the same underlying product at the same price.
const UNDERWRITTEN_RE = /underwritten\s+by\s+(.+)/i;
const BRAND_SUFFIXES = /\s+(financial|life|insurance|group|assurance|inc\.?)$/i;

function normalizeBrandKey(brand: string): string {
  return brand.toLowerCase().trim().replace(BRAND_SUFFIXES, "").trim();
}

function deduplicateByBrand(results: QuoteResult[]): QuoteResult[] {
  const seen = new Set<string>();
  return results.filter((r) => {
    let raw = r.brand.toLowerCase().trim();

    // Collapse "X underwritten by Y" → treat as Y
    const uwMatch = raw.match(UNDERWRITTEN_RE);
    if (uwMatch) raw = uwMatch[1].trim();

    const key = normalizeBrandKey(raw);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── Mock Fallback ────────────────────────────────────────────

async function buildMockResponse(
  req: QuoteRequest,
  startTime: number,
  userRiskClass: string,
): Promise<QuoteApiResponse> {
  let results = getMockResults(req, userRiskClass);
  results = await enrichWithLogos(results);

  return {
    success: true,
    results,
    meta: {
      totalFound: results.length,
      queryTimeMs: Date.now() - startTime,
      source: "mock",
      userRiskClass,
    },
  };
}
