/**
 * Browser-side Supabase client.
 * VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are intentionally public —
 * the anon key is designed to be exposed; Row Level Security enforces isolation.
 * Exports null when env vars are absent → guest-only mode, no errors.
 */
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;

if (!supabase && import.meta.env.DEV) {
  console.warn(
    "[InterviewSim] Supabase is not configured.\n" +
    "Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file to enable auth.\n" +
    "See .env.example for details. Guest mode is active — all features work locally."
  );
}
