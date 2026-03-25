// ═══════════════════════════════════════════════════════════════
//  GET /api/cron/follow-up — Automated Follow-up Email Job (T3)
//
//  Queries leads that are 7+ days old with no plan selected and
//  no follow-up sent yet, fires a re-engagement email to each,
//  then marks them as sent.
//
//  Protected by Authorization: Bearer {CRON_SECRET} header.
//  Schedule via vercel.json:  "0 10 * * *"  (10am UTC daily)
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/db/supabase";
import { comms } from "@/lib/communication";
import { env } from "@/lib/config/env";

export async function GET(request: Request) {
  // ── Auth ──────────────────────────────────────────────────
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!env.cronSecret || token !== env.cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Query eligible leads ──────────────────────────────────
  const db = getSupabase();
  if (!db) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );
  }

  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: leads, error } = await db
    .from("leads")
    .select("id, full_name, email, created_at")
    .lt("created_at", cutoff)
    .is("plan_brand", null)
    .or("follow_up_sent.is.null,follow_up_sent.eq.false")
    .or("email_unsubscribed.is.null,email_unsubscribed.eq.false")
    .limit(100);

  if (error) {
    console.error("[/api/cron/follow-up] DB query error:", error.message);
    return NextResponse.json({ error: "DB query failed" }, { status: 500 });
  }

  if (!leads || leads.length === 0) {
    return NextResponse.json({ processed: 0 });
  }

  // ── Send follow-up emails ─────────────────────────────────
  let processed = 0;

  for (const lead of leads) {
    const daysSinceQuote = Math.floor(
      (Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24),
    );

    try {
      await comms.onFollowUpDue({
        leadId: lead.id,
        fullName: lead.full_name,
        email: lead.email,
        daysSinceQuote,
      });

      // Mark as sent
      await db
        .from("leads")
        .update({ follow_up_sent: true, follow_up_sent_at: new Date().toISOString() })
        .eq("id", lead.id);

      processed++;
    } catch (err) {
      console.error(`[/api/cron/follow-up] Failed for lead ${lead.id}:`, err);
    }
  }

  console.log(`[/api/cron/follow-up] Processed ${processed}/${leads.length} leads`);
  return NextResponse.json({ processed });
}
