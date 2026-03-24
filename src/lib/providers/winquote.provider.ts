// ═══════════════════════════════════════════════════════════════
//  WinQuote Provider — HTTP Adapter
//  Builds the WQ direct-call URL and executes the GET request.
//  All WinQuote-specific HTTP concerns are isolated here.
// ═══════════════════════════════════════════════════════════════

import type { WinQuoteParams } from "@/lib/types/quote.types";
import { WQ_BASE_URL, WQ_TIMEOUT_MS } from "@/lib/config/winquote.config";

/**
 * Call the WinQuote API with the provided parameter map.
 * Returns the raw parsed JSON body (shape varies by report type).
 */
export async function callWinQuote(params: WinQuoteParams): Promise<unknown> {
  const paramString = buildParamString(params);
  const url = `${WQ_BASE_URL}?dc=${encodeURIComponent(paramString)}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WQ_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: { Accept: "application/json" },
      // Next.js — never cache pricing responses
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new WinQuoteHttpError(res.status, res.statusText, body);
    }

    return (await res.json()) as unknown;
  } catch (err) {
    if (err instanceof WinQuoteHttpError) throw err;

    if (err instanceof DOMException && err.name === "AbortError") {
      throw new WinQuoteTimeoutError(WQ_TIMEOUT_MS);
    }

    throw new WinQuoteNetworkError(
      err instanceof Error ? err.message : "Unknown network error",
    );
  } finally {
    clearTimeout(timeout);
  }
}

// ── Parameter Serialiser ─────────────────────────────────────

/**
 * Convert our typed param map into the WinQuote `dc=` string.
 *
 * Boolean `true`  → flag only   (e.g. `-fmt`)
 * Boolean `false` → omitted
 * String          → key+value   (e.g. `-ccca`)
 * Undefined       → omitted
 */
function buildParamString(params: WinQuoteParams): string {
  const parts: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === false) continue;
    parts.push(value === true ? `-${key}` : `-${key}${value}`);
  }

  return parts.join(" ");
}

// ── Custom Error Classes ─────────────────────────────────────

export class WinQuoteHttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body: string,
  ) {
    super(`WinQuote HTTP ${status}: ${statusText}`);
    this.name = "WinQuoteHttpError";
  }
}

export class WinQuoteTimeoutError extends Error {
  constructor(public readonly ms: number) {
    super(`WinQuote request timed out after ${ms}ms`);
    this.name = "WinQuoteTimeoutError";
  }
}

export class WinQuoteNetworkError extends Error {
  constructor(detail: string) {
    super(`WinQuote network error: ${detail}`);
    this.name = "WinQuoteNetworkError";
  }
}
