// ═══════════════════════════════════════════════════════════════
//  PolicyScanner — Carrier Type Definitions
// ═══════════════════════════════════════════════════════════════

/** Carrier metadata — maps WinQuote codes to CompuLife logos */
export interface Carrier {
  compulifeCode: string;      // CompuLife CompCode (e.g. "MANU")
  displayName: string;        // Canonical display name (e.g. "Manulife")
  wqCodes: string[];          // WinQuote companyNameCode(s) this maps to
  brandAliases: string[];     // Cleaned brand name variants for fuzzy matching
  logoUrl: string;            // Medium-size CompuLife logo URL
}

/** Row shape in the Supabase `carriers` table */
export interface CarrierRow {
  compulife_code: string;
  display_name: string;
  wq_codes: string[];
  brand_aliases: string[];
  logo_url: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}
