// ═══════════════════════════════════════════════════════════════
//  Quote Request Validation — Zod Schema
// ═══════════════════════════════════════════════════════════════

import { z } from "zod";

export const quoteRequestSchema = z.object({
  type: z.enum(["term", "whole", "mortgage", "critical"]),
  province: z.string().min(1, "Province is required"),
  gender: z.enum(["male", "female"]),
  tobacco: z.enum(["yes", "no"]),
  tobaccoType: z.enum(["cigarettes", "cannabis", "vaping", "other"]).optional(),
  meds: z.enum(["yes", "no"]),
  dui: z.enum(["yes", "no"]),
  heightFt: z.number().int().min(3).max(7).optional(),
  heightIn: z.number().int().min(0).max(11).optional(),
  weightLbs: z.number().int().min(75).max(500).optional(),
  heightCm: z.number().min(100).max(250).optional(),
  weightKg: z.number().min(30).max(300).optional(),
  familyHistory: z.enum(["yes", "no"]).optional(),
  coverage: z
    .number()
    .int("Coverage must be a whole number")
    .min(50_000, "Minimum coverage is $50,000")
    .max(2_000_000, "Maximum coverage is $2,000,000"),
  termLength: z
    .enum(["10", "15", "20", "25", "30"])
    .optional(),
  wholePay: z
    .enum(["100", "20", "10"])
    .optional(),
  dobDay: z
    .string()
    .regex(/^(0[1-9]|[12]\d|3[01])$/, "Day must be 01–31"),
  dobMonth: z
    .string()
    .regex(/^(0[1-9]|1[0-2])$/, "Month must be 01–12"),
  dobYear: z
    .string()
    .regex(/^(19|20)\d{2}$/, "Year must be 4 digits"),
  fullName: z
    .string()
    .min(2, "Name is too short")
    .max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(
      /^\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
      "Invalid phone number format",
    ),
  sessionId: z.string().uuid().optional(),
}).refine(
  (data) => data.tobacco === "no" || data.tobaccoType !== undefined,
  { message: "Tobacco type is required when tobacco use is yes", path: ["tobaccoType"] },
).refine(
  (data) => {
    // Validate the date is actually real (no Feb 30, etc.)
    const y = parseInt(data.dobYear, 10);
    const m = parseInt(data.dobMonth, 10) - 1; // JS months are 0-indexed
    const d = parseInt(data.dobDay, 10);
    const date = new Date(y, m, d);
    return date.getFullYear() === y && date.getMonth() === m && date.getDate() === d;
  },
  { message: "Invalid date of birth", path: ["dobDay"] },
).refine(
  (data) => {
    // Age must be between 18 and 85
    const y = parseInt(data.dobYear, 10);
    const m = parseInt(data.dobMonth, 10);
    const d = parseInt(data.dobDay, 10);
    const today = new Date();
    const birthday = new Date(today.getFullYear(), m - 1, d);
    const age = today.getFullYear() - y - (today < birthday ? 1 : 0);
    return age >= 18 && age <= 85;
  },
  { message: "Applicant must be between 18 and 85 years old", path: ["dobYear"] },
);

export type ValidatedQuoteRequest = z.infer<typeof quoteRequestSchema>;
