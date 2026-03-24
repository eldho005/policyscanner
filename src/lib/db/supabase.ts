// ═══════════════════════════════════════════════════════════════
//  Supabase — Server-Side Client (Service Role)
//  Used exclusively in API routes. Never import from client code.
// ═══════════════════════════════════════════════════════════════

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

let _client: SupabaseClient | null = null;

/**
 * Returns a singleton Supabase client using the service role key.
 * Returns `null` if credentials are not configured (allows the app
 * to function without a database during development).
 */
export function getSupabase(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  if (!_client) {
    _client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return _client;
}
