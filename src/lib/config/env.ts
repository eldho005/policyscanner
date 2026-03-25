// ═══════════════════════════════════════════════════════════════
//  Environment Validation — Fail-fast on missing configuration
//
//  Import this module early (e.g. in layout.tsx or API routes)
//  to surface misconfiguration at startup rather than at runtime.
// ═══════════════════════════════════════════════════════════════

function optionalEnv(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

// ── Validated env config (evaluated once at module load) ─────

export const env = {
  /** WinQuote API profile code — required for live quotes */
  winquoteProfileCode: optionalEnv("WINQUOTE_PROFILE_CODE", ""),
  winquoteBaseUrl: optionalEnv(
    "WINQUOTE_BASE_URL",
    "https://www.winquote.net/cgi-bin/compete.pl",
  ),
  winquoteTimeoutMs: Number(optionalEnv("WINQUOTE_TIMEOUT_MS", "10000")),

  /** Supabase — optional; features degrade gracefully without it */
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",

  /** Admin auth */
  adminPassword: process.env.ADMIN_PASSWORD ?? "",
  sessionSecret: process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "",

  /** Email (SendGrid) */
  sendgridApiKey: process.env.SENDGRID_API_KEY ?? "",
  emailFrom: optionalEnv("EMAIL_FROM", "noreply@policyscanner.ca"),

  /** App base URL — used in email deep links */
  appUrl: optionalEnv("NEXT_PUBLIC_APP_URL", "https://policyscanner.ca"),

  /** Cron job authentication secret */
  cronSecret: process.env.CRON_SECRET ?? "",

  /** Node environment */
  nodeEnv: optionalEnv("NODE_ENV", "development"),
} as const;

// ── Startup warnings ─────────────────────────────────────────

if (!env.winquoteProfileCode) {
  console.warn(
    "[env] WINQUOTE_PROFILE_CODE not set — quote API will return mock data",
  );
}

if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
  console.warn(
    "[env] Supabase not configured — DB features (leads, sessions) disabled",
  );
}

if (!env.adminPassword) {
  console.warn("[env] ADMIN_PASSWORD not set — admin login disabled");
}

if (!env.sendgridApiKey) {
  console.warn(
    "[env] SENDGRID_API_KEY not set — emails will be logged to console only",
  );
}

if (!process.env.SESSION_SECRET) {
  console.warn(
    "[env] SESSION_SECRET not set — falling back to ADMIN_PASSWORD for HMAC signing. " +
    "Set a dedicated SESSION_SECRET in production.",
  );
}
