// ═══════════════════════════════════════════════════════════════
//  POST /api/quotes/detail — Plan Detail & Renewal Schedule
//  Fetches the WinQuote Detail Renewal (-rt1) and Plan
//  Description (-rtP) for a specific plan from the Rank Survey.
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { z } from "zod";
import { getQuoteDetail } from "@/lib/services/quote-detail.service";
import { createRateLimiter } from "@/lib/rate-limit";

const limiter = createRateLimiter("quote-detail", { maxRequests: 20, windowMs: 60_000 });

const detailRequestSchema = z.object({
  companyNameCode: z.string().min(1),
  companyFileCode: z.string().min(1),
  premium: z.number().positive(),
  companyName: z.string().min(1),
  productName: z.string().min(1),
  // Original quote params needed to re-derive the WQ base params
  gender: z.enum(["male", "female"]),
  dobDay: z.string(),
  dobMonth: z.string(),
  dobYear: z.string(),
  coverage: z.number().positive(),
  province: z.string().min(1),
  type: z.string().min(1),
  termLength: z.string().optional(),
});

export async function POST(request: Request) {
  const limited = limiter.check(request);
  if (limited) return limited;

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const parsed = detailRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const result = await getQuoteDetail(parsed.data);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("[/api/quotes/detail] Unhandled error:", err);
    return NextResponse.json(
      { success: false, error: "Unable to fetch plan details. Please try again." },
      { status: 500 },
    );
  }
}
