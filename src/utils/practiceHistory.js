/**
 * Practice history — a thin localStorage layer that records a compact
 * summary of each finished session and derives dashboard stats.
 * Display/experience layer only: it never influences questions or scoring.
 * Fails silently where storage is unavailable (SSR, private mode).
 */

import { supabase } from "../lib/supabase.js";

const KEY = "interviewsim.history.v1";
const MAX_RECORDS = 50;

function storageAvailable() {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
}

export function getHistory() {
  if (!storageAvailable()) return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * record: { sessionId, date, roleId, interviewType, overall,
 *           answered, skipped, perType: {technical?, hr?, behavioral?} }
 * Idempotent per sessionId.
 */
export function recordSession(record) {
  if (!storageAvailable() || !record?.sessionId) return;
  try {
    const history = getHistory();
    const idx = history.findIndex((r) => r.sessionId === record.sessionId);
    if (idx >= 0) {
      // Upsert: merge new fields over the existing record so a later AI-gated
      // write (with summary.overall, summaryText, recommendations) overwrites
      // the preliminary local-calculation fields written by the early-mount effect.
      history[idx] = { ...history[idx], ...record };
    } else {
      history.push(record);
    }
    window.localStorage.setItem(KEY, JSON.stringify(history.slice(-MAX_RECORDS)));
  } catch {
    /* storage full / blocked — history is a nice-to-have */
  }
}

/** Average per-question-type scores for one session's results. */
export function perTypeScores(results) {
  const sums = {};
  const counts = {};
  for (const r of results) {
    if (r.feedback.skipped) continue;
    const type = r.question.type;
    sums[type] = (sums[type] ?? 0) + r.feedback.score;
    counts[type] = (counts[type] ?? 0) + 1;
  }
  const out = {};
  for (const type of Object.keys(sums)) {
    out[type] = Math.round(sums[type] / counts[type]);
  }
  return out;
}

function dayKey(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/**
 * Step back one calendar day in local time.
 * Using local midnight avoids the DST hazard of subtracting a fixed 86 400 000 ms:
 * across a DST boundary a "day" is 23 h or 25 h, so fixed subtraction can land on
 * the same calendar date twice or skip one entirely.
 */
function prevCalendarDay(ts) {
  const d = new Date(ts);
  // Local midnight of the current calendar day, then back 1 ms → previous day
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime() - 1;
}

/** Consecutive practice days ending today (or yesterday). */
export function computeStreak(history, now = Date.now()) {
  if (history.length === 0) return 0;
  const days = new Set(history.map((r) => dayKey(r.date)));

  let cursor = now;
  // A streak may end today or yesterday and still count.
  if (!days.has(dayKey(cursor))) {
    cursor = prevCalendarDay(cursor);
    if (!days.has(dayKey(cursor))) return 0;
  }
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor = prevCalendarDay(cursor);
  }
  return streak;
}

// ── Category insight helpers ──────────────────────────────────────────────────

/** Simple mean of a numeric array. Returns 0 for empty arrays. */
function avgArr(arr) {
  if (!arr.length) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

/**
 * The three question types tracked in the insight layer.
 * "mixed" is a session-level interview type, not a question type, so it is
 * intentionally excluded — questions inside a mixed session are still tagged
 * technical / behavioral / hr individually.
 */
const TRACKED_TYPES = ["technical", "behavioral", "hr"];

/**
 * Derive a rich coaching insight for one category type from the scoreable
 * session list.  Uses a per-category window of the last 10 sessions that
 * contained that type, split in half for trend computation.
 *
 * Returned shape:
 *   { type, recentAvg, trendDelta, trend, sessionCount, daysSinceLast, lastKnownAvg }
 *
 * trend values:
 *   "none"      — category never practiced (no perType data at all)
 *   "stale"     — category exists in history but not in the last 10 global scoreable sessions
 *   "new"       — fewer than 3 sessions in the per-category window (not enough for trend)
 *   "improving" — trendDelta >= +4
 *   "stable"    — |trendDelta| < 4
 *   "declining" — trendDelta <= -4
 */
function computeCategoryInsight(type, scoreable) {
  // All scoreable sessions that contain data for this category, oldest first.
  const allWithType = scoreable.filter((r) => r.perType?.[type] !== undefined);

  // Category never practiced.
  if (allWithType.length === 0) {
    return { type, trend: "none", recentAvg: null, trendDelta: null,
             sessionCount: 0, daysSinceLast: Infinity, lastKnownAvg: null };
  }

  const lastSession    = allWithType[allWithType.length - 1];
  const daysSinceLast  = Math.round((Date.now() - lastSession.date) / 86_400_000);

  // Stale: the category hasn't appeared in the last 10 *global* scoreable sessions.
  // Use global window so a user who switched to only technical practice sees HR
  // correctly flagged as stale even if they have HR data in older sessions.
  const globalWindow10 = scoreable.slice(-10);
  const inRecentWindow = globalWindow10.some((r) => r.perType?.[type] !== undefined);

  if (!inRecentWindow) {
    const lastKnownAvg = Math.round(avgArr(allWithType.map((r) => r.perType[type])));
    return { type, trend: "stale", recentAvg: null, trendDelta: null,
             sessionCount: allWithType.length, daysSinceLast, lastKnownAvg };
  }

  // Per-category window: last 10 sessions that had this type.
  const catWindow = allWithType.slice(-10);

  // Not enough data for trend.
  if (catWindow.length < 3) {
    const recentAvg = Math.round(avgArr(catWindow.map((r) => r.perType[type])));
    return { type, trend: "new", recentAvg, trendDelta: null,
             sessionCount: catWindow.length, daysSinceLast, lastKnownAvg: null };
  }

  // Split window: older half = prior, newer half = recent.
  // Math.floor gives the larger slice to the recent half when odd-length.
  const splitIdx  = Math.floor(catWindow.length / 2);
  const prior     = catWindow.slice(0, splitIdx);
  const recent    = catWindow.slice(splitIdx);

  const recentMean = avgArr(recent.map((r) => r.perType[type]));
  const priorMean  = avgArr(prior.map((r) => r.perType[type]));
  const trendDelta = Math.round(recentMean - priorMean);

  const trend =
    trendDelta >= 4  ? "improving" :
    trendDelta <= -4 ? "declining" :
                       "stable";

  const recentAvg = Math.round(avgArr(catWindow.map((r) => r.perType[type])));

  return { type, trend, recentAvg, trendDelta,
           sessionCount: catWindow.length, daysSinceLast, lastKnownAvg: null };
}

/**
 * Numeric urgency score for a category insight.
 * Higher = more urgently needs practice.
 * Returns -1 for "none" (never practiced) to avoid forcing an untried type.
 */
function categoryRecommendationScore(insight) {
  if (insight.trend === "none") return -1;
  if (insight.trend === "stale") {
    return insight.daysSinceLast > 7 ? 60 : 20;
  }
  if (insight.recentAvg === null) return 0;
  let score = (100 - insight.recentAvg) * 2;        // lower score = higher need
  if (insight.trend === "declining") score += 30;    // actively worsening
  if (insight.trend === "new")       score += 15;    // no baseline yet
  if (insight.daysSinceLast > 14)    score += 20;    // fading without practice
  return score;
}

/**
 * Human-readable coaching reason explaining WHY this category is recommended.
 * First matching rule wins.
 */
function categoryRecommendationReason(insight, allInsights) {
  const { type, trend, trendDelta, recentAvg, daysSinceLast, sessionCount } = insight;
  const ranked = allInsights
    .filter((i) => i.recentAvg !== null)
    .sort((a, b) => a.recentAvg - b.recentAvg);
  const isLowest = ranked.length > 0 && ranked[0].type === type;

  if (trend === "stale") {
    const days = isFinite(daysSinceLast) ? `${daysSinceLast} days` : "a while";
    return `You haven't done a ${type} session in ${days}. Skills fade without practice — time for a refresh.`;
  }
  if (trend === "declining" && isLowest) {
    return `${type} dropped ${Math.abs(trendDelta)} points recently and is currently your weakest area. Focused practice now recovers this fastest.`;
  }
  if (trend === "declining") {
    return `${type} dropped ${Math.abs(trendDelta)} points in your last sessions. Focused practice now stops the decline before it becomes a gap.`;
  }
  if (trend === "new") {
    return `You've only done ${sessionCount} ${type} session${sessionCount === 1 ? "" : "s"} recently. Build a baseline to understand where you really stand.`;
  }
  if (isLowest && recentAvg !== null) {
    return `${type} is your lowest recent average at ${recentAvg}. Bringing it up gives your overall score the biggest lift.`;
  }
  return `Practice ${type} next to keep improving your balance across all categories.`;
}

/** Everything the dashboard needs, derived in one pass. */
export function computeDashboard(history, now = Date.now()) {
  const sorted = [...history].sort((a, b) => a.date - b.date);
  const sessions = sorted.length;

  if (sessions === 0) {
    return { sessions: 0 };
  }

  const last = sorted[sessions - 1];
  const totalAnswered = sorted.reduce((s, r) => s + (r.answered ?? 0), 0);

  const scoreable = sorted.filter((r) => (r.answered ?? 0) > 0);
  const avgOverall = scoreable.length > 0
    ? Math.round(scoreable.reduce((s, r) => s + (r.overall ?? 0), 0) / scoreable.length)
    : 0;

  const typeSums = {};
  const typeCounts = {};
  for (const r of scoreable) {
    for (const [type, score] of Object.entries(r.perType ?? {})) {
      typeSums[type] = (typeSums[type] ?? 0) + score;
      typeCounts[type] = (typeCounts[type] ?? 0) + 1;
    }
  }
  const lifetimeTypeAverages = Object.fromEntries(
    Object.keys(typeSums).map((t) => [t, Math.round(typeSums[t] / typeCounts[t])])
  );

  const recentWindow = scoreable.slice(-10);
  const recentTypeSums = {};
  const recentTypeCounts = {};
  for (const r of recentWindow) {
    for (const [type, score] of Object.entries(r.perType ?? {})) {
      recentTypeSums[type] = (recentTypeSums[type] ?? 0) + score;
      recentTypeCounts[type] = (recentTypeCounts[type] ?? 0) + 1;
    }
  }
  const recentTypeAverages = Object.fromEntries(
    Object.keys(recentTypeSums).map((t) => [t, Math.round(recentTypeSums[t] / recentTypeCounts[t])])
  );

  const recentRanked = Object.entries(recentTypeAverages).sort((a, b) => b[1] - a[1]);
  const strongestType = recentRanked[0]?.[0] ?? null;
  const weakestType   = recentRanked.length > 1 ? recentRanked[recentRanked.length - 1][0] : null;

  const categoryInsights = TRACKED_TYPES.map((type) =>
    computeCategoryInsight(type, scoreable)
  );

  const scoredInsights = categoryInsights
    .map((i) => ({ insight: i, score: categoryRecommendationScore(i) }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => b.score - a.score);

  const recommendedInsight = scoredInsights.length > 0
    ? {
        ...scoredInsights[0].insight,
        reason: categoryRecommendationReason(scoredInsights[0].insight, categoryInsights),
      }
    : null;

  return {
    sessions,
    last,
    recent: scoreable.slice(-5).reverse(),
    trend: scoreable.slice(-8).map((r) => ({ date: r.date, overall: r.overall ?? 0 })),
    totalAnswered,
    avgOverall,
    lifetimeTypeAverages,
    recentTypeAverages,
    strongestType,
    weakestType,
    streak: computeStreak(sorted, now),
    categoryInsights,
    recommendedInsight,
  };
}

/** Remove all stored practice history (settings page). */
export function clearPracticeHistory() {
  localStorage.removeItem(KEY);
}

export async function saveSessionCloud(entry) {
  if (!supabase) return;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("interview_sessions")
    .upsert(
      {
        id:              entry.sessionId,
        user_id:         user.id,
        role_id:         entry.roleId,
        interview_type:  entry.interviewType,
        interviewer_id:  entry.interviewerId ?? "sarah",
        question_count:  entry.questionCount ?? 0,
        lang:            entry.lang ?? "en",
        overall:         entry.overall,
        summary_text:    entry.summaryText ?? "",
        recommendations: entry.recommendations ?? [],
        answered:        entry.answered ?? 0,
        skipped:         entry.skipped ?? 0,
        per_type:        entry.perType ?? {},
        completed_at:    new Date(entry.date).toISOString(),
      },
      { onConflict: "id" }
    );

  if (error) {
    console.error("[practiceHistory] cloud save error:", error.message);
  }
}
