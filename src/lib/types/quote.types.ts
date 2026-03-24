// ═══════════════════════════════════════════════════════════════
//  PolicyScanner — Quote Type Definitions
// ═══════════════════════════════════════════════════════════════

/** Frontend form data sent to /api/quotes */
export interface QuoteRequest {
  type: "term" | "whole" | "mortgage" | "critical";
  province: string;
  gender: "male" | "female";
  tobacco: "yes" | "no";
  tobaccoType?: "cigarettes" | "cannabis" | "vaping" | "other";
  meds: "yes" | "no";
  dui: "yes" | "no";
  heightFt?: number;
  heightIn?: number;
  weightLbs?: number;
  heightCm?: number;
  weightKg?: number;
  familyHistory?: "yes" | "no";
  coverage: number;
  termLength?: string;  // "10" | "15" | "20" | "25" | "30" | "all"
  wholePay?: string;    // "100" | "20" | "10"
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  fullName: string;
  email: string;
  phone: string;
  sessionId?: string;
}

/** Normalized quote result returned to the frontend */
export interface QuoteResult {
  id: string;
  brand: string;
  product: string;
  tag: "best-value" | "no-medical" | "standard";
  tagLabel: string;
  basePrice: number;
  annualPrice: number;
  coverage: number;
  term: number;
  untilAge: number;
  riskClass: string;
  waiverOfPremium: number;    // monthly disability waiver cost ($0 if N/A)
  totalPayment: number;       // premium + waiver combined
  features: {
    included: string[];
    riders: string[];
  };
  logoUrl?: string;           // carrier logo from CompuLife (enriched by carrier service)
  meta: {
    companyNameCode: string;
    companyFileCode: string;
    companyUrl: string;
    contractUrl: string;
  };
}

/** Envelope returned by POST /api/quotes */
export interface QuoteApiResponse {
  success: boolean;
  results: QuoteResult[];
  meta: {
    totalFound: number;
    queryTimeMs: number;
    source: "live" | "mock";
    userRiskClass: string;
    sessionId?: string;
  };
  error?: string;
}

/** Single item from the WinQuote Rank Survey (raw / untyped) */
export interface WinQuoteRawItem {
  company?: string;
  companyNameCode?: string;
  companyFileCode?: string;
  product?: string;
  premium?: string | number;
  premiumText?: string;
  premiumAlt?: string | number;
  premiumAltText?: string;
  risk?: string;
  legend?: string;
  paymentMode?: string;
  minPremSymbol?: string;
  waiverOfPremium?: string | number;
  payment?: string | number;
  planNote?: string;
  companyUrl?: string;
  abbrContractFName?: string;
  [key: string]: unknown;
}

/** Internal param map used to build the WinQuote GET URL */
export interface WinQuoteParams {
  cc: string;
  pc: string;
  rt: string;
  qt: string;
  of: string;
  lang: string;
  lc: string;
  g: string;
  dob: string;
  fa: string;
  pg: string;
  pi: string;
  pm: string;
  r: string;
  tucgt?: string;
  tucgr?: string;
  tumrj?: string;
  tuvap?: string;
  fmt?: boolean;
  pnEXACT?: boolean;
  aEXACT?: boolean;
  faEXACT?: boolean;
  ceilp?: boolean;
  ceilrank?: string;
  rc?: string;
  skipLTYRT?: boolean;
  skipNRBIP?: boolean;
  skipMFNA?: boolean;
  eqrnk?: boolean;
  pfgp?: string;
  prewaiv2pay?: boolean;
  // Detail report params
  fn?: string;
  fp?: string;
  fyq?: string;
  pdcn?: string;
  pdpn?: string;
}
