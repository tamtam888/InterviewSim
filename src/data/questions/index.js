import { HR_QUESTIONS as HR_RAW } from "./hr";
import { BEHAVIORAL_QUESTIONS as BEHAVIORAL_RAW } from "./behavioral";
import { TECHNICAL_DEV_QUESTIONS } from "./technicalDev";
import { TECHNICAL_NONDEV_QUESTIONS } from "./technicalNonDev";
import { JUNIOR_REACT_QUESTIONS } from "./technicalJuniorReact";
import { JUNIOR_WEB_QUESTIONS } from "./technicalJuniorWeb";

/**
 * Normalize metadata so every question exposes the full schema:
 * id, role?, type, category, difficulty, tags, expectedTopics,
 * text, tip, model (modelAnswer), keywords (scoringKeywords).
 * Newer questions declare these explicitly; older ones get sane defaults.
 */
function normalize(q) {
  return {
    category: q.type,
    difficulty: "mid",
    level: "mid",
    tags: [],
    expectedTopics: q.keywords?.en ?? [],
    ...q,
  };
}

export const HR_QUESTIONS = HR_RAW.map(normalize);
export const BEHAVIORAL_QUESTIONS = BEHAVIORAL_RAW.map(normalize);

const TECHNICAL_QUESTIONS = [
  ...TECHNICAL_DEV_QUESTIONS,
  ...TECHNICAL_NONDEV_QUESTIONS,
  ...JUNIOR_REACT_QUESTIONS,
  ...JUNIOR_WEB_QUESTIONS,
].map(normalize);

export const ALL_QUESTIONS = [
  ...TECHNICAL_QUESTIONS,
  ...HR_QUESTIONS,
  ...BEHAVIORAL_QUESTIONS,
];

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function technicalForRole(roleId, level = null) {
  const byRole = TECHNICAL_QUESTIONS.filter((q) => q.role === roleId);
  if (!level) return byRole;
  return byRole.filter((q) => q.level === level || q.level === "all");
}

/**
 * Return the best level to filter the pool by, given what's available.
 * Falls back gracefully when the requested level has too few questions.
 *
 * @param {object[]} pool    - Full unfiltered questions for this role
 * @param {string}   level   - Requested experienceLevel
 * @param {number}   needed  - Minimum questions required
 * @returns {string|null}    - Level to use, or null (use full pool)
 */
function resolveLevel(pool, level, needed) {
  const exact = pool.filter((q) => q.level === level);
  if (exact.length >= needed) return level;
  // senior/lead fall back to mid since no senior/lead static questions exist yet
  if (level === "senior" || level === "lead") {
    const mid = pool.filter((q) => q.level === "mid");
    if (mid.length >= needed) return "mid";
  }
  // last resort: use full pool (no level filter)
  return null;
}

/* ----------------------------------------------------------------
   Recency tracking — recently asked question IDs in localStorage.
   New sessions prefer questions the user hasn't seen lately; when a
   pool is small, the least-recently-asked rotate back in fairly.
   ---------------------------------------------------------------- */

const RECENT_KEY = "interviewsim.recentQuestions.v1";
const RECENT_CAP = 120;

function storageAvailable() {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
}

function getRecentIds() {
  if (!storageAvailable()) return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function markAsked(ids) {
  if (!storageAvailable()) return;
  try {
    const withoutNew = getRecentIds().filter((id) => !ids.includes(id));
    const next = [...withoutNew, ...ids].slice(-RECENT_CAP);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* storage blocked/full — selection still randomizes per session */
  }
}

/**
 * Pick `count` questions from `pool`:
 * 1. never pick anything in `exclude` (no duplicates within a session),
 * 2. prefer questions not in the recent list (shuffled),
 * 3. top up with the least-recently-asked first (fair rotation),
 * shuffling within each freshness group so order also varies.
 */
function pickFresh(pool, count, recentIndex, exclude = new Set()) {
  const candidates = pool.filter((q) => !exclude.has(q.id));
  const unseen = shuffle(candidates.filter((q) => !recentIndex.has(q.id)));
  const seen = candidates
    .filter((q) => recentIndex.has(q.id))
    .map((q) => ({ q, rank: recentIndex.get(q.id) + Math.random() * 0.5 }))
    .sort((a, b) => a.rank - b.rank) // oldest asked first (jittered)
    .map((entry) => entry.q);
  return [...unseen, ...seen].slice(0, count);
}

/**
 * Build a question list for a session. Counts stay 4/6/8, sessions never
 * contain duplicates, and recently used questions are avoided when possible.
 *
 * @param {string} roleId
 * @param {string} interviewType
 * @param {number} count
 * @param {{ experienceLevel?: string, difficulty?: string }} [opts]
 *   experienceLevel - "junior"|"mid"|"senior"|"lead" (default: "mid")
 *   difficulty      - reserved for future use; not yet applied to static bank
 */
export function buildSession(roleId, interviewType, count, {
  experienceLevel = "mid",
  // difficulty reserved — static bank has no hardness tags yet
} = {}) {
  const recentIndex = new Map(getRecentIds().map((id, i) => [id, i]));
  const exclude = new Set();
  let picked = [];

  if (interviewType === "technical") {
    const fullPool = technicalForRole(roleId);
    const effectiveLevel = resolveLevel(fullPool, experienceLevel, count);
    const leveledPool = technicalForRole(roleId, effectiveLevel);
    const roleQs = pickFresh(leveledPool, count, recentIndex);
    roleQs.forEach((q) => exclude.add(q.id));
    picked = roleQs;
    if (picked.length < count) {
      // Top up: general technical first, then behavioral/HR (level: "all", always eligible).
      const filler = pickFresh(
        [...technicalForRole("general"), ...BEHAVIORAL_QUESTIONS, ...HR_QUESTIONS],
        count - picked.length,
        recentIndex,
        exclude
      );
      picked.push(...filler);
    }
  } else if (interviewType === "behavioral") {
    picked = pickFresh(BEHAVIORAL_QUESTIONS, count, recentIndex);
  } else if (interviewType === "hr") {
    picked = pickFresh(HR_QUESTIONS, count, recentIndex);
  } else {
    // mixed — draw from all pools
    const allPool = [
      ...technicalForRole(roleId),
      ...BEHAVIORAL_QUESTIONS,
      ...HR_QUESTIONS,
    ];
    picked = pickFresh(allPool, count, recentIndex);
  }

  markAsked(picked.map((q) => q.id));
  return picked;
}

/**
 * Total questions available for a role (technical + behavioral + HR).
 * Used by RoleSelectScreen to show the bank size.
 */
export function questionCountForRole(roleId) {
  return (
    technicalForRole(roleId).length +
    BEHAVIORAL_QUESTIONS.length +
    HR_QUESTIONS.length
  );
}

/**
 * Clear the recent-questions localStorage key.
 * Called from SettingsScreen to reset the anti-repeat rotation.
 */
export function clearRecentQuestions() {
  if (!storageAvailable()) return;
  try { window.localStorage.removeItem(RECENT_KEY); } catch { /* ignore */ }
}
