// ═══════════════════════════════════════════════════════════════
//  Carrier Service — Resolves WinQuote quotes → carrier logos
//  Reads from Supabase `carriers` table with in-memory cache.
//  Falls back to static data when the table doesn't exist yet.
// ═══════════════════════════════════════════════════════════════

import type { Carrier, CarrierRow } from "@/lib/types/carrier.types";
import type { QuoteResult } from "@/lib/types/quote.types";
import { CARRIERS } from "@/data/carriers";
import { getSupabase } from "@/lib/db/supabase";

// ── Cache ────────────────────────────────────────────────────

interface CarrierCache {
  byWqCode: Map<string, string>;    // WQ code (upper) → logoUrl
  byAlias: Map<string, string>;     // brand alias (lower) → logoUrl
  loadedAt: number;
}

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 h
let cache: CarrierCache | null = null;

// ── Public API ───────────────────────────────────────────────

/**
 * Enrich an array of QuoteResults with logo URLs by matching
 * each result's companyNameCode or brand name to a carrier.
 */
export async function enrichWithLogos(
  results: QuoteResult[],
): Promise<QuoteResult[]> {
  const lookup = await getCache();

  return results.map((r) => {
    const logoUrl = resolveLogoUrl(
      r.meta.companyNameCode,
      r.brand,
      lookup,
    );
    return logoUrl ? { ...r, logoUrl } : r;
  });
}

// ── Lookup ───────────────────────────────────────────────────

function resolveLogoUrl(
  wqCode: string,
  brand: string,
  lookup: CarrierCache,
): string | undefined {
  // 1 — exact WQ code match (fastest)
  if (wqCode) {
    const url = lookup.byWqCode.get(wqCode.toUpperCase());
    if (url) return url;
  }

  // 2 — brand alias substring match
  const normBrand = brand.toLowerCase().trim();
  for (const [alias, url] of lookup.byAlias) {
    if (normBrand.includes(alias) || alias.includes(normBrand)) {
      return url;
    }
  }

  return undefined;
}

// ── Cache Management ─────────────────────────────────────────

async function getCache(): Promise<CarrierCache> {
  if (cache && Date.now() - cache.loadedAt < CACHE_TTL) {
    return cache;
  }

  const carriers = await loadCarriers();
  cache = buildCache(carriers);
  return cache;
}

function buildCache(carriers: Carrier[]): CarrierCache {
  const byWqCode = new Map<string, string>();
  const byAlias = new Map<string, string>();

  for (const c of carriers) {
    for (const code of c.wqCodes) {
      byWqCode.set(code.toUpperCase(), c.logoUrl);
    }
    for (const alias of c.brandAliases) {
      byAlias.set(alias.toLowerCase(), c.logoUrl);
    }
  }

  return { byWqCode, byAlias, loadedAt: Date.now() };
}

// ── Data Loading ─────────────────────────────────────────────

async function loadCarriers(): Promise<Carrier[]> {
  // Try Supabase first
  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("carriers")
        .select("compulife_code, display_name, wq_codes, brand_aliases, logo_url")
        .eq("active", true);

      if (!error && data && data.length > 0) {
        return (data as CarrierRow[]).map(rowToCarrier);
      }
    }
  } catch {
    // Supabase unavailable — fall through to static data
  }

  // Fallback to static carrier data
  return CARRIERS;
}

function rowToCarrier(row: CarrierRow): Carrier {
  return {
    compulifeCode: row.compulife_code,
    displayName: row.display_name,
    wqCodes: row.wq_codes,
    brandAliases: row.brand_aliases,
    logoUrl: row.logo_url,
  };
}
