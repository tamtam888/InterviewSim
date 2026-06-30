/**
 * Supabase helpers for the job_matches table.
 * All functions return null / { ok: true, id } / { error, code } — never throw.
 * No-ops (return null) when Supabase is not configured or user is not authenticated.
 */
import { supabase } from "./supabase.js";

/**
 * Save a job match result to Supabase.
 * @param {{
 *   jobDescription: string,
 *   candidateProfileId?: string|null,
 *   matchScore: number,
 *   strengths: string[],
 *   gaps: string[],
 *   recommendedTopics: string[],
 *   preparationPlan: string[],
 *   tailoredFocus: string,
 *   source: "ai"|"local",
 * }} payload
 * @returns {Promise<{ ok: true, id: string }|{ error: string, code: string }|null>}
 */
export async function saveJobMatch({
  jobDescription,
  candidateProfileId = null,
  matchScore,
  strengths,
  gaps,
  recommendedTopics,
  preparationPlan,
  tailoredFocus,
  source,
}) {
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null; // not authenticated — silent no-op

  const { data, error } = await supabase
    .from("job_matches")
    .insert({
      user_id: user.id,
      candidate_profile_id: candidateProfileId ?? null,
      job_description: jobDescription,
      match_score: matchScore ?? null,
      missing_skills: gaps ?? null,
      strengths: strengths ?? null,
      interview_focus_areas: recommendedTopics ?? null,
      analysis: {
        preparationPlan: preparationPlan ?? [],
        tailoredFocus: tailoredFocus ?? "",
        source,
      },
    })
    .select("id")
    .single();

  if (error) {
    console.error(
      "[jobMatch] save error\n",
      "  code:", error.code, "\n",
      "  message:", error.message,
    );
    return { error: error.message, code: error.code };
  }

  return { ok: true, id: data.id };
}

/**
 * Fetch the current user's saved job match results, newest first.
 * @param {number} [limit=20]
 * @returns {Promise<object[]|null>}
 */
export async function fetchJobMatches(limit = 20) {
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("job_matches")
    .select("id, job_description, match_score, missing_skills, strengths, interview_focus_areas, analysis, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[jobMatch] fetch error\n", "  message:", error.message);
    return null;
  }

  return data ?? null;
}
