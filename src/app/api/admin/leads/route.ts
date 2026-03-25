// ═══════════════════════════════════════════════════════════════
//  GET /api/admin/leads — Fetch leads for the admin dashboard
//  Requires valid admin session cookie.
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { getSupabase } from "@/lib/db/supabase";

export const dynamic = "force-dynamic";

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 200;

export async function GET(request: NextRequest) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const db = getSupabase();
  if (!db) {
    return NextResponse.json(
      { success: false, error: "Database not configured" },
      { status: 503 },
    );
  }

  const params = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1);
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(params.get("pageSize") ?? String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE),
  );
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await db
    .from("leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("[/api/admin/leads] DB error:", error.message);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leads" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    leads: data,
    pagination: {
      page,
      pageSize,
      total: count ?? 0,
      totalPages: count ? Math.ceil(count / pageSize) : 0,
    },
  });
}

export async function DELETE(request: NextRequest) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const db = getSupabase();
  if (!db) {
    return NextResponse.json(
      { success: false, error: "Database not configured" },
      { status: 503 },
    );
  }

  const { id } = await request.json().catch(() => ({})) as { id?: string };
  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { success: false, error: "Missing lead id" },
      { status: 400 },
    );
  }

  const { error } = await db.from("leads").delete().eq("id", id);
  if (error) {
    console.error("[/api/admin/leads] Delete error:", error.message);
    return NextResponse.json(
      { success: false, error: "Failed to delete lead" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
