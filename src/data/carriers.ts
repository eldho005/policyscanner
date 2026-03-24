// ═══════════════════════════════════════════════════════════════
//  Static Carrier Data — WinQuote ↔ CompuLife Mapping
//  Used as seed data for the Supabase `carriers` table and as
//  a local fallback when the DB is unavailable.
// ═══════════════════════════════════════════════════════════════

import type { Carrier } from "@/lib/types/carrier.types";

const LOGO_BASE = "https://www.compulifeapi.com/images/logosapicanada";

export const CARRIERS: Carrier[] = [
  {
    compulifeCode: "ASSU",
    displayName: "Assumption Life",
    wqCodes: ["ASM"],
    brandAliases: ["assumption life", "assumption mutual"],
    logoUrl: `${LOGO_BASE}/ASSU-medium.png`,
  },
  {
    compulifeCode: "BENE",
    displayName: "Beneva",
    wqCodes: ["BEN", "SSQ"],
    brandAliases: ["beneva", "ssq life", "ssq"],
    logoUrl: `${LOGO_BASE}/BENE-medium.png`,
  },
  {
    compulifeCode: "BLUE",
    displayName: "Blue Cross",
    wqCodes: ["BLC", "BLU"],
    brandAliases: ["blue cross"],
    logoUrl: `${LOGO_BASE}/BLUE-medium.png`,
  },
  {
    compulifeCode: "BMOL",
    displayName: "BMO Life",
    wqCodes: ["BMO"],
    brandAliases: ["bmo life", "bmo"],
    logoUrl: `${LOGO_BASE}/BMOL-medium.png`,
  },
  {
    compulifeCode: "CANA",
    displayName: "Canada Life",
    wqCodes: ["CLA", "GWL", "CAN"],
    brandAliases: ["canada life", "great-west life", "great west life"],
    logoUrl: `${LOGO_BASE}/CANA-medium.png`,
  },
  {
    compulifeCode: "COOP",
    displayName: "Co-operators",
    wqCodes: ["COO", "COP"],
    brandAliases: ["co-operators", "cooperators"],
    logoUrl: `${LOGO_BASE}/COOP-medium.png`,
  },
  {
    compulifeCode: "DESJ",
    displayName: "Desjardins",
    wqCodes: ["DSJ", "DFS"],
    brandAliases: ["desjardins"],
    logoUrl: `${LOGO_BASE}/DESJ-medium.png`,
  },
  {
    compulifeCode: "EMPI",
    displayName: "Empire Life",
    wqCodes: ["EMP"],
    brandAliases: ["empire life"],
    logoUrl: `${LOGO_BASE}/EMPI-medium.png`,
  },
  {
    compulifeCode: "EQUI",
    displayName: "Equitable",
    wqCodes: ["EQL", "EQB"],
    brandAliases: ["equitable"],
    logoUrl: `${LOGO_BASE}/EQUI-medium.png`,
  },
  {
    compulifeCode: "FORE",
    displayName: "Foresters",
    wqCodes: ["FOR", "FLI"],
    brandAliases: ["foresters"],
    logoUrl: `${LOGO_BASE}/FORE-medium.png`,
  },
  {
    compulifeCode: "FORP",
    displayName: "Canada Protection Plan",
    wqCodes: ["CPP", "CPL"],
    brandAliases: ["canada protection plan", "cpp"],
    logoUrl: `${LOGO_BASE}/FORP-medium.png`,
  },
  {
    compulifeCode: "HUMA",
    displayName: "Humania",
    wqCodes: ["HUM"],
    brandAliases: ["humania"],
    logoUrl: `${LOGO_BASE}/HUMA-medium.png`,
  },
  {
    compulifeCode: "INDU",
    displayName: "iA Financial",
    wqCodes: ["IAG", "IAF", "IAL"],
    brandAliases: ["industrial alliance", "ia financial", "ia life"],
    logoUrl: `${LOGO_BASE}/INDU-medium.png`,
  },
  {
    compulifeCode: "MANU",
    displayName: "Manulife",
    wqCodes: ["MFC", "MAN"],
    brandAliases: ["manulife", "manufacturers life"],
    logoUrl: `${LOGO_BASE}/MANU-medium.png`,
  },
  {
    compulifeCode: "POLI",
    displayName: "PolicyMe",
    wqCodes: ["PLM", "PME"],
    brandAliases: ["policyme", "canadian premier"],
    logoUrl: `${LOGO_BASE}/POLI-medium.png`,
  },
  {
    compulifeCode: "PRIM",
    displayName: "Primerica",
    wqCodes: ["PRM"],
    brandAliases: ["primerica"],
    logoUrl: `${LOGO_BASE}/PRIM-medium.png`,
  },
  {
    compulifeCode: "RBCL",
    displayName: "RBC Insurance",
    wqCodes: ["RBC"],
    brandAliases: ["rbc life", "rbc insurance"],
    logoUrl: `${LOGO_BASE}/RBCL-medium.png`,
  },
  {
    compulifeCode: "SERE",
    displayName: "Serenia Life",
    wqCodes: ["SRN", "FTL"],
    brandAliases: ["serenia", "faithlife"],
    logoUrl: `${LOGO_BASE}/SERE-medium.png`,
  },
  {
    compulifeCode: "SHER",
    displayName: "Sherbrooke Life",
    wqCodes: ["SHR"],
    brandAliases: ["sherbrooke"],
    logoUrl: `${LOGO_BASE}/SHER-medium.png`,
  },
  {
    compulifeCode: "SUNL",
    displayName: "Sun Life",
    wqCodes: ["SLF", "SUN"],
    brandAliases: ["sun life"],
    logoUrl: `${LOGO_BASE}/SUNL-medium.png`,
  },
  {
    compulifeCode: "TRAN",
    displayName: "ivari",
    wqCodes: ["IVR", "TRA"],
    brandAliases: ["ivari", "transamerica"],
    logoUrl: `${LOGO_BASE}/TRAN-medium.png`,
  },
  {
    compulifeCode: "UVAS",
    displayName: "UV Insurance",
    wqCodes: ["UVA"],
    brandAliases: ["uv insurance"],
    logoUrl: `${LOGO_BASE}/UVAS-medium.png`,
  },
  {
    compulifeCode: "WAWA",
    displayName: "Wawanesa",
    wqCodes: ["WAW"],
    brandAliases: ["wawanesa"],
    logoUrl: `${LOGO_BASE}/WAWA-medium.png`,
  },
];
