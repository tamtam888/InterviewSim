/**
 * AI-powered interview question generator.
 *
 * generateInterviewQuestions() calls /api/generate-questions to get fresh,
 * role-specific questions from OpenAI. Falls back to the static bank
 * (buildSession) on any failure so the interview always starts.
 *
 * Anti-repeat: recently asked question texts are stored in localStorage
 * and sent to the AI so it avoids similar questions next session.
 */
import { buildSession } from "../data/questions/index.js";

const RECENT_TEXTS_KEY = "interviewsim.recentTexts.v1";
const RECENT_TEXTS_CAP = 60;  // keep last 60 question texts
const REQUEST_TIMEOUT_MS = 14000;

/* ── Recent-texts helpers ────────────────────────────────────────────────── */

function getRecentTexts() {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENT_TEXTS_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    // Normalise: old format was string[], new format is {text, focusAreaTag}[]
    return parsed.map((item) => {
      if (typeof item === "string") return { text: item, focusAreaTag: "" };
      if (item && typeof item.text === "string") return { text: item.text, focusAreaTag: item.focusAreaTag ?? "" };
      return null;
    }).filter(Boolean);
  } catch {
    return [];
  }
}

function addRecentTexts(entries) {
  try {
    const newTexts = new Set(entries.map((e) => e.text));
    const existing = getRecentTexts().filter((e) => !newTexts.has(e.text));
    const next = [...existing, ...entries].slice(-RECENT_TEXTS_CAP);
    localStorage.setItem(RECENT_TEXTS_KEY, JSON.stringify(next));
  } catch {
    /* storage full / blocked */
  }
}

export function clearRecentGeneratedTexts() {
  try { localStorage.removeItem(RECENT_TEXTS_KEY); } catch { /* ignore */ }
}

/* ── AI-question normaliser ──────────────────────────────────────────────── */

/**
 * Convert an AI question (flat shape from the API) to the standard question
 * shape used throughout the app, matching what buildSession() returns.
 */
function normalizeAiQuestion(q, index) {
  const id = `ai-${Date.now().toString(36)}-${index}`;
  return {
    id,
    role: null,          // AI questions are role-agnostic (role is baked into the text)
    type:         q.type,
    category:     q.category || q.type,
    difficulty:   q.difficulty || "mid",
    tags:         Array.isArray(q.tags) ? q.tags : [],
    focusAreaTag: q.focusAreaTag ?? "",   // exact focusArea string this question targets
    expectedTopics: [],
    text:     { en: q.text_en, he: q.text_he || q.text_en },
    tip:      { en: q.tip_en || "", he: q.tip_he || q.tip_en || "" },
    model:    { en: "", he: "" },
    keywords: { en: [], he: [] },
    _source:  "ai",      // lets callers/logs distinguish AI vs static questions
  };
}

/* ── Main export ─────────────────────────────────────────────────────────── */

/**
 * Generate interview questions for a session.
 *
 * 1. Reads recently asked question texts from localStorage.
 * 2. Calls /api/generate-questions (server-side OpenAI — no key in browser).
 * 3. Normalises AI questions to the standard shape.
 * 4. Stores new question texts for future anti-repeat.
 * 5. Falls back to buildSession() on any error (network, AI unavailable, etc.).
 *
 * Never throws. Always returns an array of at least `count` questions.
 *
 * @param {{ roleId: string, interviewType: string, count: number, lang: string }} opts
 * @returns {Promise<object[]>}
 */
export async function generateInterviewQuestions({
  roleId,
  interviewType,
  count,
  lang,
  experienceLevel = "junior",
  difficulty = "mixed",
  focusAreas = null,
}) {
  // Send the last 30 asked texts (with focusAreaTag encoded) to help the AI avoid repetition
  const recentEntries = getRecentTexts().slice(-30);
  // Encode focusAreaTag into the text string so the server receives a plain string[]
  // Format: "question text... [focus:FocusAreaTag]" — AI reads both text and focus context
  const recentTexts = recentEntries.map((e) =>
    e.focusAreaTag
      ? `${e.text.slice(0, 120)} [focus:${e.focusAreaTag}]`
      : e.text.slice(0, 160)
  );

  // focusAreas: string[] of gap/topic strings from a Job Match result.
  // Passed to the server so the prompt biases questions toward identified gaps.
  const safeFocusAreas = Array.isArray(focusAreas) && focusAreas.length > 0
    ? focusAreas.slice(0, 10).map((s) => String(s).slice(0, 120))
    : null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const requestBody = {
    role: roleId,
    interviewType,
    count,
    lang,
    recentTexts,
    experienceLevel,
    difficulty,
    ...(safeFocusAreas ? { focusAreas: safeFocusAreas } : {}),
  };

  if (import.meta.env.DEV) {
    console.log("[questionGenerator] → /api/generate-questions payload", {
      role: roleId,
      interviewType,
      count,
      lang,
      experienceLevel,
      difficulty,
      hasFocusAreas: !!safeFocusAreas,
      focusAreas: safeFocusAreas,
    });
  }

  try {
    const res = await fetch("/api/generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) {
      throw new Error(`/api/generate-questions responded ${res.status}`);
    }

    const data = await res.json();

    if (!Array.isArray(data.questions) || data.questions.length === 0) {
      throw new Error("AI returned empty question list");
    }

    // Normalise and cap to requested count
    const allNormalized = data.questions.slice(0, count).map(normalizeAiQuestion);

    // Language consistency guard: for Hebrew sessions, drop any AI question
    // whose Hebrew text is missing or identical to the English text.
    // Dropped questions reduce the array length, which triggers the top-up
    // path below to fill the gap with bilingual static bank questions.
    const questions = lang === "he"
      ? allNormalized.filter((q) => {
          const heOk = q.text.he && q.text.he.trim() !== "" && q.text.he !== q.text.en;
          if (!heOk && import.meta.env.DEV) {
            console.warn("[questionGenerator] dropped AI question: missing/English text_he ->", q.text.en.slice(0, 60));
          }
          return heOk;
        })
      : allNormalized;

    // Remember these for anti-repeat next time (store text + focusAreaTag)
    addRecentTexts(questions.map((q) => ({
      text: q.text.en,
      focusAreaTag: q.focusAreaTag ?? "",
    })));

    if (import.meta.env.DEV) {
      // Check how many AI questions overlap with recent texts (first-60-char match)
      const recentSet = new Set(recentEntries.map((e) => e.text.toLowerCase().trim().slice(0, 60)));
      const dupeCount = questions.filter((q) =>
        recentSet.has(q.text.en.toLowerCase().trim().slice(0, 60))
      ).length;

      console.log(
        `[questionGenerator] ✓ AI SUCCESS: ${questions.length} questions` +
        ` (${roleId}/${interviewType}/${experienceLevel}/${difficulty})` +
        (safeFocusAreas ? ` | TAILORED — focusAreas: ${safeFocusAreas.length}` : " | generic (no focusAreas)")
      );
      if (dupeCount > 0) {
        console.warn(`[questionGenerator] ⚠ ${dupeCount}/${questions.length} questions may overlap with recent session`);
      }
      questions.forEach((q, i) => {
        const tag = q.focusAreaTag ? ` [focus:${q.focusAreaTag}]` : "";
        console.log("  " + (i + 1) + ". [" + q.type + "]" + tag + " " + q.text.en.slice(0, 80));
      });
    }

    // If AI returned fewer than requested, top up with static bank questions
    if (questions.length < count) {
      const static_ = buildSession(roleId, interviewType, count - questions.length, { experienceLevel, difficulty });
      if (import.meta.env.DEV) {
        console.log("[questionGenerator] topped up with " + static_.length + " static questions");
      }
      return [...questions, ...static_];
    }

    return questions;
  } catch (err) {
    // FALLBACK: AI unavailable -- using static question bank.
    // Questions will NOT be tailored to the job match focus areas.
    if (import.meta.env.DEV) {
      console.warn(
        "[questionGenerator] FALLBACK -- AI call failed, using STATIC BANK (NOT tailored).",
        "\n  Error:", err.message,
        "\n  focusAreas were:", safeFocusAreas ?? "none",
        "\n  Static questions rotate via ID-based anti-repeat but ignore job match gaps."
      );
    } else {
      console.error("[questionGenerator] AI error, falling back to static bank:", err.message);
    }
    const fallbackQuestions  = buildSession(roleId, interviewType, count, { experienceLevel, difficulty });
    // Attach metadata so the caller can show a visible notice when focusAreas were dropped.
    return fallbackQuestions.map((q) => ({ ...q, _fallback: !!safeFocusAreas }));
  }
}
