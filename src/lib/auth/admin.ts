// ═══════════════════════════════════════════════════════════════
//  Admin session helpers — HMAC-signed cookie tokens
//  Server-only: never import from client components.
// ═══════════════════════════════════════════════════════════════

import "server-only";
import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "ps_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

function getSecret(): string {
  // Prefer a dedicated secret; fall back to ADMIN_PASSWORD for backwards compat
  const secret = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("SESSION_SECRET (or ADMIN_PASSWORD) env var is not set");
  return secret;
}

/** Create a signed token: `expiry.hmac(expiry)` */
export function createSessionToken(): string {
  const expiry = Date.now() + MAX_AGE_SECONDS * 1000;
  const hmac = crypto
    .createHmac("sha256", getSecret())
    .update(String(expiry))
    .digest("hex");
  return `${expiry}.${hmac}`;
}

/** Verify a signed token — checks HMAC and expiry */
export function verifySessionToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [expiryStr, providedHmac] = parts;
  const expiry = Number(expiryStr);
  if (Number.isNaN(expiry) || Date.now() > expiry) return false;

  const expectedHmac = crypto
    .createHmac("sha256", getSecret())
    .update(expiryStr)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(providedHmac, "hex"),
    Buffer.from(expectedHmac, "hex"),
  );
}

/** Set the admin session cookie (call after successful login) */
export async function setAdminCookie(): Promise<void> {
  const token = createSessionToken();
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

/** Check if current request has a valid admin session */
export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const jar = await cookies();
    const token = jar.get(COOKIE_NAME)?.value;
    if (!token) return false;
    return verifySessionToken(token);
  } catch {
    return false;
  }
}

/** Clear the admin session cookie */
export async function clearAdminCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
