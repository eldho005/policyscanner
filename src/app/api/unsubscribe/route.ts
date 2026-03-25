// ═══════════════════════════════════════════════════════════════
//  GET /api/unsubscribe — Email Opt-out Endpoint
//
//  Sets email_unsubscribed = TRUE for the given lead so they
//  are excluded from all future follow-up emails.
//
//  Query param:  ?token={leadId}
//  No auth required — the leadId acts as the opt-out token.
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/db/supabase";

const HTML_SUCCESS = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Unsubscribed — PolicyScanner</title>
  <style>
    body { margin: 0; padding: 0; background: #f5f4f2; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .card { max-width: 480px; margin: 80px auto; background: #fff; border-radius: 10px; padding: 40px 36px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); text-align: center; }
    h1 { font-size: 22px; font-weight: 700; color: #2b2520; margin: 0 0 12px; }
    p { font-size: 15px; color: #555; line-height: 1.6; margin: 0 0 16px; }
    a { color: #a0522d; text-decoration: none; }
    .brand { font-weight: 500; color: #2b2520; }
    .accent { font-weight: 700; color: #a0522d; }
  </style>
</head>
<body>
  <div class="card">
    <p style="font-size:20px;margin:0 0 20px"><span class="brand">Policy</span><span class="accent">Scanner</span></p>
    <h1>You've been unsubscribed</h1>
    <p>You'll no longer receive follow-up emails from PolicyScanner.</p>
    <p>If this was a mistake, <a href="/">visit our site</a> and submit a new quote request.</p>
  </div>
</body>
</html>`;

const HTML_ERROR = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Unsubscribe Error — PolicyScanner</title>
  <style>
    body { margin: 0; padding: 0; background: #f5f4f2; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .card { max-width: 480px; margin: 80px auto; background: #fff; border-radius: 10px; padding: 40px 36px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); text-align: center; }
    p { font-size: 15px; color: #555; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <p>This unsubscribe link is invalid or has already been used.</p>
  </div>
</body>
</html>`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") ?? "";

  // Basic validation — UUIDs are 36 characters
  if (!token || token.length < 10 || token.length > 64) {
    return new NextResponse(HTML_ERROR, {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const db = getSupabase();
  if (!db) {
    return new NextResponse(HTML_SUCCESS, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const { error } = await db
    .from("leads")
    .update({ email_unsubscribed: true })
    .eq("id", token);

  if (error) {
    console.error("[/api/unsubscribe] DB update error:", error.message);
  }

  // Always return success page — don't reveal whether the token exists
  return new NextResponse(HTML_SUCCESS, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
