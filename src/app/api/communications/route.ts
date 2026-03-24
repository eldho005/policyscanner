// ═══════════════════════════════════════════════════════════════
//  POST /api/communications — Trigger communications manually
//  Used by the admin dashboard or external systems to send
//  emails, SMS, or trigger follow-ups for specific leads.
//  Requires admin authentication.
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { comms } from "@/lib/communication/communication.service";
import { z } from "zod";

const followUpSchema = z.object({
  action: z.literal("follow_up"),
  leadId: z.string().uuid(),
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  daysSinceQuote: z.number().int().nonnegative(),
});

const quoteSelectedSchema = z.object({
  action: z.literal("quote_selected"),
  leadId: z.string().uuid().optional(),
  sessionId: z.string().uuid().optional(),
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  planBrand: z.string().min(1),
  planProduct: z.string().min(1),
  priceMonthly: z.number().nonnegative(),
  priceAnnual: z.number().nonnegative(),
  coverage: z.number().int().positive(),
  term: z.number().int().nonnegative(),
  policyType: z.string().min(1),
});

const requestSchema = z.discriminatedUnion("action", [
  followUpSchema,
  quoteSelectedSchema,
]);

export async function POST(request: Request) {
  // Auth check — admin only
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

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

    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const data = parsed.data;

    if (data.action === "follow_up") {
      await comms.onFollowUpDue({
        leadId: data.leadId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        daysSinceQuote: data.daysSinceQuote,
      });
      return NextResponse.json({ success: true, action: "follow_up" });
    }

    if (data.action === "quote_selected") {
      await comms.onQuoteSelected({
        leadId: data.leadId,
        sessionId: data.sessionId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        planBrand: data.planBrand,
        planProduct: data.planProduct,
        priceMonthly: data.priceMonthly,
        priceAnnual: data.priceAnnual,
        coverage: data.coverage,
        term: data.term,
        policyType: data.policyType,
      });
      return NextResponse.json({ success: true, action: "quote_selected" });
    }

    return NextResponse.json(
      { success: false, error: "Unknown action" },
      { status: 400 },
    );
  } catch (err) {
    console.error("[/api/communications] Unhandled error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
