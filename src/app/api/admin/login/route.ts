// ═══════════════════════════════════════════════════════════════
//  POST /api/admin/login — Admin authentication
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { setAdminCookie } from "@/lib/auth/admin";
import crypto from "crypto";

// ── In-memory rate limiter ───────────────────────────────────
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const attempts = new Map<string, { count: number; firstAttempt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now - entry.firstAttempt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAttempt: now });
    return false;
  }
  entry.count++;
  return entry.count > MAX_ATTEMPTS;
}

function clearRateLimit(ip: string): void {
  attempts.delete(ip);
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many login attempts. Try again in 5 minutes." },
      { status: 429 },
    );
  }

  try {
    const { password } = await request.json();
    const expected = process.env.ADMIN_PASSWORD;

    if (!expected) {
      return NextResponse.json(
        { success: false, error: "Admin login not configured" },
        { status: 503 },
      );
    }

    // Constant-time comparison to prevent timing attacks
    const match =
      password &&
      typeof password === "string" &&
      password.length === expected.length &&
      crypto.timingSafeEqual(
        Buffer.from(password),
        Buffer.from(expected),
      );

    if (!match) {
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 },
      );
    }

    clearRateLimit(ip);
    await setAdminCookie();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 },
    );
  }
}

export async function DELETE() {
  const { clearAdminCookie } = await import("@/lib/auth/admin");
  await clearAdminCookie();
  return NextResponse.json({ success: true });
}
