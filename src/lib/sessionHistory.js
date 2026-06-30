/**
 * Supabase helpers for the interview_sessions table.
 * Uses the browser-side supabase client (anon key + user JWT via RLS).
 * All functions return null on error or when not authenticated / not configured.
 */
import { supabase } from "./supabase.js";

/**
 * Fetch the current user's interview sessions, newest first.
 * Returns full rows including summary_text and recommendations so the
 * detail view can render without a second fetch.
 *
 * @param {number} [limit=50]
 * @returns {Promise<object[]|null>}
 */
export async function fetchSessions(limit = 50) {
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("interview_sessions")
    .select(
      "id, role_id, interview_type, interviewer_id, question_count, lang, " +
      "overall, summary_text, recommendations, answered, skipped, per_type, completed_at"
    )
    .order("completed_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[sessionHistory] fetch error:", error.message);
    return null;
  }

  return data ?? [];
}

/**
 * Map a raw DB row to the shape expected by computeDashboard() and
 * the session list UI.  Extra fields (summaryText, recommendations, etc.)
 * pass through transparently — computeDashboard ignores unknown fields.
 *
 * @param {object} row
 * @returns {object}
 */
export function rowToHistoryEntry(row) {
  return {
    sessionId:       row.id,
    date:            new Date(row.completed_at).getTime(),
    roleId:          row.role_id,
    interviewType:   row.interview_type,
    interviewerId:   row.interviewer_id ?? "sarah",
    lang:            row.lang ?? "en",
    overall:         row.overall ?? 0,
    summaryText:     row.summary_text ?? "",
    recommendations: Array.isArray(row.recommendations) ? row.recommendations : [],
    answered:        row.answered ?? 0,
    skipped:         row.skipped ?? 0,
    perType:         (row.per_type && typeof row.per_type === "object") ? row.per_type : {},
    questionCount:   row.question_count ?? 0,
  };
}
