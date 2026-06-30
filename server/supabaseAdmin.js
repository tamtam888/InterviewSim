/**
 * Server-side Supabase admin client.
 * Uses SUPABASE_SERVICE_ROLE_KEY — a secret that must NEVER be prefixed
 * with VITE_ or shipped to the browser. It bypasses Row Level Security
 * so it is only used for JWT verification, never for open data queries.
 *
 * Exports null when env vars are absent → auth endpoints return 503.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = url && key
  ? createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;
