/**
 * Shared data constants ported from PHP Helpers.php
 */

export const COVERAGE_OPTIONS: Record<string, string> = {
  '50000': '50,000',
  '100000': '100,000',
  '250000': '250,000',
  '500000': '500,000',
  '750000': '750,000',
  '1000000': '1M',
  '1500000': '1.5M',
  '2000000': '2M',
}

export function coverageLabel(key: string): string {
  return COVERAGE_OPTIONS[key] || key
}

/** Term Life product codes that require a medical exam */
export const TERM_LIFE_WITH_MED_COMP_IDS = [
  'ASSUASST', 'BENESSQA', 'BENEAXAA', 'BENECAPP', 'BMOLAMEM', 'BMOLBMTR',
  'CANACCNA', 'COOPCUNI', 'DESJLAUF', 'DESJLAUU', 'DESJDESJ', 'EMPIEMCP',
  'EQUIEQET', 'EQUIEQWT', 'EQUIEQTU', 'FORPFOPI', 'INDUINDU', 'INDUINPU',
  'INDUINQU', 'INDUINRU', 'RBCLRBAL', 'RBCLRBBL', 'RBCLRBCL', 'RBCLRBDL',
  'RBCLRBEL', 'RBCLWETA', 'SERESERE', 'SUNLSUTO', 'SUNLSUTL', 'SUNLSUUL',
  'TRANTRAE',
]

/** Term Life product codes with NO medical exam required */
export const TERM_LIFE_WITHOUT_MED_COMP_IDS = [
  'ASSUASPL', 'BENESQSI', 'FORPFOXE', 'HUMAHUGO', 'UVASUVEX',
]

/** Universal Life regular companies */
export const UL_COMP_REGULAR = [
  'MANULIFE', 'IVARI', 'IAFINANC', 'CANADALI', 'DESJARDI',
  'SUNLIFE', 'CO-OPERA', 'EQUITABL', 'BENEVA',
]

/** Slugify a display name for logo file paths */
export function companySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Convert slug to title case text */
export function slugToText(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/** Calculate insurance age (age nearest birthday) */
export function calculateInsuranceAge(dobDay: number, dobMonth: number, dobYear: number): number | null {
  const today = new Date()
  const birthDate = new Date(dobYear, dobMonth - 1, dobDay)

  if (isNaN(birthDate.getTime())) return null

  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  // Insurance "nearest birthday" — if next birthday is within 6 months, use age + 1
  const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
  if (nextBirthday < today) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
  }
  const daysUntilNext = Math.floor((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (daysUntilNext <= 182) {
    age++
  }

  return age
}
