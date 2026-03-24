// ═══════════════════════════════════════════════════════════════
//  POST /api/leads — Lead Capture Endpoint
//  Stores user contact info + optional plan selection.
//  Called at form submission ("Get My Quotes" click).
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { leadRequestSchema } from "@/lib/validation/lead.schema";
import { getSupabase } from "@/lib/db/supabase";
import { comms } from "@/lib/communication/communication.service";
import { createRateLimiter } from "@/lib/rate-limit";

const limiter = createRateLimiter("leads", { maxRequests: 5, windowMs: 60_000 });

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

    const parsed = leadRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed" },
        { status: 400 },
      );
    }

    const db = getSupabase();
    if (!db) {
      console.warn("[/api/leads] Database not configured — lead not persisted");
      return NextResponse.json(
        { success: false, error: "Service temporarily unavailable" },
        { status: 503 },
      );
    }

    const d = parsed.data;
    const { data, error } = await db.from("leads").insert({
      session_id: d.sessionId ?? null,
      full_name: d.fullName,
      email: d.email,
      phone: d.phone,
      province: d.province,
      policy_type: d.policyType,
      coverage: d.coverage,
      term: d.term,
      user_risk_class: d.userRiskClass,
      period_selected: d.periodSelected ?? null,
      plan_brand: d.planBrand ?? null,
      plan_product: d.planProduct ?? null,
      plan_price_monthly: d.planPriceMonthly ?? null,
      plan_price_annual: d.planPriceAnnual ?? null,
      plan_risk_class: d.planRiskClass ?? null,
      plan_tag: d.planTag ?? null,
    }).select("id").single();

    if (error) {
      console.error("[/api/leads] DB insert error:", error.message);
      return NextResponse.json(
        { success: false, error: "Failed to save lead" },
        { status: 500 },
      );
    }

    // Fire communications (non-blocking — never delays the response)
    comms.onLeadCaptured({
      leadId: data.id,
      sessionId: d.sessionId,
      fullName: d.fullName,
      email: d.email,
      phone: d.phone,
      province: d.province,
      policyType: d.policyType,
      coverage: d.coverage,
      term: d.term,
      userRiskClass: d.userRiskClass,
    }).catch((err) => console.error("[/api/leads] Comms error:", err));

    return NextResponse.json(
      { success: true, leadId: data.id },
      { status: 200 },
    );
  } catch (err) {
    console.error("[/api/leads] Unhandled error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
