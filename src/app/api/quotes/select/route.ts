// ═══════════════════════════════════════════════════════════════
//  POST /api/quotes/select — Customer selects a plan
//  Public endpoint called from the results page when a user
//  clicks "Get a Quote" on a specific plan card.
//  Triggers the T2 (plan details) email via the comms service.
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { z } from "zod";
import { comms } from "@/lib/communication/communication.service";
import { createRateLimiter } from "@/lib/rate-limit";

const limiter = createRateLimiter("quote-select", {
  maxRequests: 5,
  windowMs: 60_000,
});

const selectSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  sessionId: z.string().optional(),
  planBrand: z.string().min(1),
  planProduct: z.string().min(1),
  priceMonthly: z.number().nonnegative(),
  priceAnnual: z.number().nonnegative(),
  coverage: z.number().int().positive(),
  term: z.number().int().nonnegative(),
  policyType: z.string().min(1),
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

    const parsed = selectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    // Fire T2 email — non-blocking for the response
    comms.onQuoteSelected(parsed.data).catch((err) => {
      console.error("[/api/quotes/select] comms.onQuoteSelected failed:", err);
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/quotes/select] Unhandled error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
