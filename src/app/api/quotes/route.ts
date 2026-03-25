// ═══════════════════════════════════════════════════════════════
//  POST /api/quotes — Quote Orchestration Endpoint
//  Thin controller: validate → service → persist session → respond.
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { quoteRequestSchema } from "@/lib/validation/quote.schema";
import { getQuotes } from "@/lib/services/quote.service";
import { getSupabase } from "@/lib/db/supabase";
import { createRateLimiter } from "@/lib/rate-limit";
const limiter = createRateLimiter("quotes", { maxRequests: 10, windowMs: 60_000 });

export async function POST(request: Request) {
  const limited = limiter.check(request);
  if (limited) return limited;

  try {
    // 1. Parse JSON body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    // 2. Validate with Zod
    const parsed = quoteRequestSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          fieldErrors,
        },
        { status: 400 },
      );
    }

    // 3. Delegate to service layer
    const result = await getQuotes(parsed.data);

    // 4. Persist quote session to database (non-blocking on failure)
    //    Skip if this is a re-fetch (sessionId already exists).
    let sessionId: string | undefined = parsed.data.sessionId;

    if (!sessionId) {
      try {
        const db = getSupabase();
        if (db) {
          const req = parsed.data;

          // Normalize height/weight to metric for consistent storage
          const heightCm = req.heightCm
            ? req.heightCm
            : req.heightFt
              ? Math.round((req.heightFt * 12 + (req.heightIn ?? 0)) * 2.54 * 10) / 10
              : null;
          const weightKg = req.weightKg
            ? req.weightKg
            : req.weightLbs
              ? Math.round((req.weightLbs / 2.2046) * 10) / 10
              : null;

          const { data, error } = await db.from("quote_sessions").insert({
            full_name: req.fullName,
            email: req.email,
            phone: req.phone,
            province: req.province,
            policy_type: req.type,
            gender: req.gender,
            dob: `${req.dobYear}-${req.dobMonth}-${req.dobDay}`,
            tobacco: req.tobacco,
            tobacco_type: req.tobaccoType ?? null,
            meds: req.meds,
            dui: req.dui,
            family_history: req.familyHistory ?? null,
            height_cm: heightCm,
            weight_kg: weightKg,
            coverage: req.coverage,
            term_length: req.termLength ?? null,
            user_risk_class: result.meta.userRiskClass,
            results_count: result.meta.totalFound,
            source: result.meta.source,
            query_time_ms: result.meta.queryTimeMs,
            results_snapshot: result.results,
          }).select("id").single();

          if (error) {
            console.error("[/api/quotes] DB insert error:", error.message);
          } else {
            sessionId = data.id;
          }
        }
      } catch (dbErr) {
        console.error("[/api/quotes] DB write failed:", dbErr);
        // Continue — quotes still return normally
      }
    }

    // Attach sessionId so the client can include it on re-fetches
    result.meta.sessionId = sessionId;

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    // Never expose internal details to the client
    console.error("[/api/quotes] Unhandled error:", err);

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      },
      { status: 500 },
    );
  }
}
