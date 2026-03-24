// ═══════════════════════════════════════════════════════════════
//  Risk Assessment — Business logic for risk classification
//  and age calculation.
// ═══════════════════════════════════════════════════════════════

/**
 * Derive the WinQuote risk class flag from a comprehensive health profile.
 *
 * Hard rules (immediate Regular):
 *  - Cigarette / other tobacco smoker → R
 *  - BMI > 35 → R
 *
 * Factor-counting (moderate flags):
 *  - Cannabis or vaping user      (+1)
 *  - Prescribed meds (BP/chol/diab) (+1)
 *  - DUI in past 5 years          (+1)
 *  - BMI < 18.5 or BMI ≥ 30       (+1)
 *  - Family history of illness     (+1)
 *
 * 0 factors → SP (Elite)  |  1-2 factors → P (Preferred)  |  3+ → R (Regular)
 */
export function deriveRiskClass(
  tobacco: "yes" | "no",
  tobaccoType: string | undefined,
  meds: "yes" | "no",
  dui: "yes" | "no",
  bmi: number,
  familyHistory: "yes" | "no",
): string {
  // Hard rules — immediate Regular
  if (tobacco === "yes" && tobaccoType !== "cannabis" && tobaccoType !== "vaping") {
    return "R";
  }
  if (bmi > 35) return "R";

  // Count moderate factors
  let factors = 0;
  if (tobacco === "yes" && (tobaccoType === "cannabis" || tobaccoType === "vaping")) factors++;
  if (meds === "yes") factors++;
  if (dui === "yes") factors++;
  if (bmi > 0 && (bmi < 18.5 || bmi >= 30)) factors++;
  if (familyHistory === "yes") factors++;

  if (factors === 0) return "SP";
  if (factors <= 2) return "P";
  return "R";
}

/**
 * Calculate age from DOB components.
 */
export function calculateAge(
  month: string,
  day: string,
  year: string,
): number {
  const m = parseInt(month, 10) || 1;
  const d = parseInt(day, 10) || 1;
  const y = parseInt(year, 10) || 1990;
  const today = new Date();
  const birthday = new Date(today.getFullYear(), m - 1, d);
  return today.getFullYear() - y - (today < birthday ? 1 : 0);
}
