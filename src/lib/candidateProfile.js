/**
 * Supabase helpers for the candidate_profiles table.
 * All functions return null / { ok: true } / { error, code } — never throw.
 * They are no-ops (return null) when Supabase is not configured.
 */
import { supabase } from "./supabase.js";

/**
 * Load the current user's candidate profile row.
 * @returns {Promise<object|null>} profile row or null (not found / not configured)
 */
export async function loadCandidateProfile() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("candidate_profiles")
    .select("*")
    .maybeSingle();
  if (error) {
    console.error(
      "[candidateProfile] load error\n",
      "  code:", error.code, "\n",
      "  message:", error.message, "\n",
      "  details:", error.details, "\n",
      "  hint:", error.hint,
    );
    return null;
  }
  return data ?? null;
}

/**
 * Upsert the current user's candidate profile.
 * @param {{ resumeText: string, skills?: any, experience?: any, education?: any, languages?: any }} payload
 * @returns {Promise<{ ok: true }|{ error: string, code: string }|null>}
 */
export async function saveCandidateProfile({
  resumeText,
  skills = null,
  experience = null,
  education = null,
  languages = null,
}) {
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "not_authenticated", code: "AUTH" };

  const { error } = await supabase
    .from("candidate_profiles")
    .upsert(
      {
        user_id: user.id,
        resume_text: resumeText,
        skills,
        experience,
        education,
        languages,
      },
      { onConflict: "user_id" }
    );

  if (error) {
    // Common codes: 42P01 = table does not exist, 42501 = RLS violation
    console.error(
      "[candidateProfile] save error\n",
      "  code:", error.code, "\n",
      "  message:", error.message, "\n",
      "  details:", error.details, "\n",
      "  hint:", error.hint,
    );
    return { error: error.message, code: error.code };
  }

  return { ok: true };
}

/**
 * Delete the current user's candidate profile row entirely.
 * Called when the user clicks "Clear" — ensures refresh does not restore stale data.
 * @returns {Promise<{ ok: true }|{ error: string, code: string }|null>}
 */
export async function deleteCandidateProfile() {
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "not_authenticated", code: "AUTH" };

  const { error } = await supabase
    .from("candidate_profiles")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    console.error(
      "[candidateProfile] delete error\n",
      "  code:", error.code, "\n",
      "  message:", error.message,
    );
    return { error: error.message, code: error.code };
  }

  return { ok: true };
}
