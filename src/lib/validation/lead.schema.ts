// ═══════════════════════════════════════════════════════════════
//  Lead Request Validation — Zod Schema
// ═══════════════════════════════════════════════════════════════

import { z } from "zod";

export const leadRequestSchema = z.object({
  sessionId: z.string().uuid().optional(),
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  province: z.string().min(1),
  policyType: z.string().min(1),
  coverage: z.number().int().positive(),
  term: z.number().int().nonnegative(),
  userRiskClass: z.string().min(1),
  // Plan-specific fields — optional because leads are captured at form
  // submission before a specific plan is selected.
  periodSelected: z.enum(["monthly", "yearly"]).optional(),
  planBrand: z.string().min(1).optional(),
  planProduct: z.string().min(1).optional(),
  planPriceMonthly: z.number().nonnegative().optional(),
  planPriceAnnual: z.number().nonnegative().optional(),
  planRiskClass: z.string().min(1).optional(),
  planTag: z.string().min(1).optional(),
});
