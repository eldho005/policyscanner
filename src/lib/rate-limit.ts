// ═══════════════════════════════════════════════════════════════
//  In-Memory Rate Limiter — Per-IP Sliding Window
//  Used to protect public API routes from abuse.
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  firstRequest: number;
}

interface RateLimiterOptions {
  /** Maximum requests allowed within the window */
  maxRequests: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

const stores = new Map<string, Map<string, RateLimitEntry>>();

/**
 * Create a rate limiter for a specific route.
 * Each route gets its own isolated store keyed by a namespace.
 */
export function createRateLimiter(namespace: string, opts: RateLimiterOptions) {
  if (!stores.has(namespace)) {
    stores.set(namespace, new Map());
  }
  const store = stores.get(namespace)!;

  return {
    /**
     * Check if the request should be rate-limited.
     * Returns a 429 NextResponse if limited, or `null` if allowed.
     */
    check(request: Request): NextResponse | null {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "unknown";

      const now = Date.now();
      const entry = store.get(ip);

      if (!entry || now - entry.firstRequest > opts.windowMs) {
        store.set(ip, { count: 1, firstRequest: now });
        return null;
      }

      entry.count++;
      if (entry.count > opts.maxRequests) {
        return NextResponse.json(
          { success: false, error: "Too many requests. Please try again later." },
          { status: 429 },
        );
      }

      return null;
    },
  };
}
