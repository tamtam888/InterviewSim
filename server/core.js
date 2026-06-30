/**
 * Platform-agnostic request handlers for AI evaluation.
 * Used by server/index.js (local Express) AND api/*.js (Vercel functions).
 */
import {
  hasApiKey,
  completeJson,
  EVALUATE_SCHEMA,
  SUMMARIZE_SCHEMA,
  MATCH_SCHEMA,
  GENERATE_QUESTIONS_SCHEMA,
} from "./openai.js";
import { buildEvaluatePrompt, buildSummarizePrompt, buildMatchPrompt, buildGenerateQuestionsPrompt } from "./prompts.js";

/* ---- In-process rate limiter (Vercel serverless fallback) ---- */
const _rateBuckets = new Map();

function checkRateLimit(ip, maxPerMinute) {
  const now = Date.now();
  const key = ip ?? "unknown";
  let bucket = _rateBuckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + 60000 };
    _rateBuckets.set(key, bucket);
  }
  bucket.count += 1;
  if (bucket.count > maxPerMinute) return false;
  if (_rateBuckets.size > 1000 && Math.random() < 0.005) {
    for (const [k, v] of _rateBuckets) {
      if (now >= v.resetAt) _rateBuckets.delete(k);
    }
  }
  return true;
}

function getClientIp(req) {
  return (
    req.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() ??
    req.socket?.remoteAddress ??
    null
  );
}

/* ---- Limits ---- */
const MAX_ANSWER_CHARS = 8000;
const MIN_ANSWER_CHARS = 2;
const MAX_RESULTS = 12;
const MAX_RESUME_CHARS = 12000;
const MAX_JOB_CHARS = 6000;
const EVALUATE_MAX_TOKENS = 800;
const GENERATE_MAX_TOKENS = 2200;
const GENERATE_PER_MINUTE = 20;
const MAX_RECENT_TEXTS = 30;
const MAX_RECENT_TEXT_CHARS = 160;
const SUMMARIZE_MAX_TOKENS = 450;
const MATCH_MAX_TOKENS = 900;

/* ---- Allowed values ---- */
const VALID_LANGS = new Set(["en", "he"]);
const VALID_TYPES = new Set(["technical", "hr", "behavioral", "mixed", "general"]);
const VALID_ROLES = new Set([
  "frontend", "react", "fullstack", "backend", "qa",
  "product", "uxui", "data", "support", "general",
]);
const VALID_INTERVIEWERS = new Set(["sarah", "daniel", "maya"]);
const VALID_LEVELS = new Set(["junior", "mid", "senior", "lead"]);
const VALID_DIFFICULTIES = new Set(["easy", "medium", "hard", "mixed"]);

const clamp = (n) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));
const cut = (value, max) => String(value ?? "").slice(0, max);
const asStringArray = (value, maxItems, maxChars) =>
  (Array.isArray(value) ? value : []).slice(0, maxItems).map((v) => cut(v, maxChars));

/**
 * Strip Arabic-script Unicode characters from a string.
 * Applied to all Hebrew-mode text fields as a safety net when the model
 * accidentally emits Arabic characters (U+0600–U+06FF) instead of Hebrew
 * (U+0590–U+05FF). The two scripts look similar but are distinct code points.
 */
function stripArabic(str) {
  if (typeof str !== "string") return str;
  // Arabic: main block U+0600-U+06FF, Supplement U+0750-U+077F,
  // Extended-A U+08A0-U+08FF, Presentation Forms-A U+FB50-U+FDFF, Forms-B U+FE70-U+FEFF
  const ARABIC_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
  const afterStrip = str.replace(ARABIC_RE, "");
  if (afterStrip === str) return str; // no Arabic — fast path, return original
  console.warn("[lang] stripped Arabic characters from Hebrew output");
  // Clean up whitespace artifacts from the removal (collapse double-spaces, trim edges)
  return afterStrip.replace(/\s{2,}/g, " ").trim();
}

function sanitizeHebrewStrings(obj, keys) {
  for (const key of keys) {
    if (typeof obj[key] === "string") {
      obj[key] = stripArabic(obj[key]);
    } else if (Array.isArray(obj[key])) {
      obj[key] = obj[key].map(stripArabic);
    }
  }
  return obj;
}

function badRequest(res, message) {
  return res.status(400).json({ error: "bad_request", message });
}

function aiUnavailable(res, err) {
  console.error("[ai] unavailable:", err?.message ?? err);
  return res
    .status(503)
    .json({ error: err?.code === "missing_api_key" ? "missing_api_key" : "ai_unavailable" });
}

function validateCommon({ lang, role, interviewType, interviewerId }) {
  if (lang !== undefined && !VALID_LANGS.has(lang)) return "lang must be 'en' or 'he'";
  if (role !== undefined && !VALID_ROLES.has(role)) return "unknown role";
  if (interviewType !== undefined && !VALID_TYPES.has(interviewType)) return "unknown interviewType";
  if (interviewerId !== undefined && !VALID_INTERVIEWERS.has(interviewerId)) return "unknown interviewerId";
  return null;
}

export function handleHealth(_req, res) {
  res.status(200).json({ ok: true, aiConfigured: hasApiKey() });
}

export async function handleEvaluateAnswer(req, res) {
  if (req.method && req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }
  if (!checkRateLimit(getClientIp(req), 60)) {
    return res.status(429).json({ error: "rate_limited", message: "Too many requests — slow down." });
  }
  const { role, interviewType, interviewerId, question, answer, lang, sessionContext } = req.body ?? {};

  const commonError = validateCommon({ lang, role, interviewType, interviewerId });
  if (commonError) return badRequest(res, commonError);

  if (!question || typeof question.text !== "string" || !question.text.trim()) {
    return badRequest(res, "question.text is required");
  }
  if (typeof answer !== "string" || !answer.trim()) {
    return badRequest(res, "answer is required");
  }
  if (answer.trim().length < MIN_ANSWER_CHARS) {
    return badRequest(res, `answer too short (min ${MIN_ANSWER_CHARS} chars)`);
  }
  if (answer.length > MAX_ANSWER_CHARS) {
    return badRequest(res, `answer too long (max ${MAX_ANSWER_CHARS} chars)`);
  }

  try {
    const { system, user } = buildEvaluatePrompt({
      role: role ?? "general",
      interviewType: interviewType ?? "mixed",
      interviewerId: VALID_INTERVIEWERS.has(interviewerId) ? interviewerId : "sarah",
      question: {
        text: cut(question.text, 2000),
        type: VALID_TYPES.has(question.type) ? question.type : "general",
        tip: question.tip ? cut(question.tip, 500) : null,
      },
      answer: answer.trim(),
      lang: lang ?? "en",
      sessionContext,
    });

    const result = await completeJson({
      system,
      user,
      schemaName: "answer_evaluation",
      schema: EVALUATE_SCHEMA,
      maxTokens: EVALUATE_MAX_TOKENS,
    });

    const evalResponse = {
      score: clamp(result.score),
      strengths: asStringArray(result.strengths, 3, 220),
      improvements: asStringArray(result.improvements, 3, 260),
      suggestedAnswer: cut(result.suggestedAnswer, 1200),
      nextPracticeTip: cut(result.nextPracticeTip, 300),
      shouldAskFollowUp: Boolean(result.shouldAskFollowUp),
      followUpQuestion: cut(result.followUpQuestion, 400),
      followUpReason: cut(result.followUpReason, 300),
    };
    if (lang === "he") {
      sanitizeHebrewStrings(evalResponse, [
        "strengths", "improvements", "suggestedAnswer",
        "nextPracticeTip", "followUpQuestion", "followUpReason",
      ]);
    }
    res.status(200).json(evalResponse);
  } catch (err) {
    aiUnavailable(res, err);
  }
}

export async function handleSummarizeSession(req, res) {
  if (req.method && req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }
  if (!checkRateLimit(getClientIp(req), 30)) {
    return res.status(429).json({ error: "rate_limited", message: "Too many requests — slow down." });
  }
  const { role, interviewType, results, lang } = req.body ?? {};

  const commonError = validateCommon({ lang, role, interviewType });
  if (commonError) return badRequest(res, commonError);

  if (!Array.isArray(results) || results.length === 0) {
    return badRequest(res, "results array is required");
  }
  if (!results.some((r) => typeof r?.question?.text === "string" && r.question.text.trim())) {
    return badRequest(res, "results must contain questions");
  }

  try {
    const { system, user } = buildSummarizePrompt({
      role: role ?? "general",
      interviewType: interviewType ?? "mixed",
      results: results.slice(0, MAX_RESULTS).map((r) => ({
        question: {
          text: cut(r?.question?.text, 2000),
          type: VALID_TYPES.has(r?.question?.type) ? r.question.type : "general",
        },
        answer: cut(r?.answer, MAX_ANSWER_CHARS),
        skipped: Boolean(r?.skipped),
        score: r?.score != null ? clamp(r.score) : null,
      })),
      lang: lang ?? "en",
    });

    const result = await completeJson({
      system,
      user,
      schemaName: "session_summary",
      schema: SUMMARIZE_SCHEMA,
      maxTokens: SUMMARIZE_MAX_TOKENS,
    });

    const sumResponse = {
      overall: clamp(result.overall),
      summary: cut(result.summary, 900),
      recommendations: asStringArray(result.recommendations, 3, 220),
    };
    if (lang === "he") {
      sanitizeHebrewStrings(sumResponse, ["summary", "recommendations"]);
    }
    res.status(200).json(sumResponse);
  } catch (err) {
    aiUnavailable(res, err);
  }
}

export async function handleAnalyzeMatch(req, res) {
  if (req.method && req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }
  if (!checkRateLimit(getClientIp(req), 15)) {
    return res.status(429).json({ error: "rate_limited", message: "Too many requests — slow down." });
  }

  const { resumeText, jobDescription, lang } = req.body ?? {};

  if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 20) {
    return badRequest(res, "resumeText is required (min 20 chars)");
  }
  if (!jobDescription || typeof jobDescription !== "string" || jobDescription.trim().length < 20) {
    return badRequest(res, "jobDescription is required (min 20 chars)");
  }
  if (resumeText.length > MAX_RESUME_CHARS) {
    return badRequest(res, `resumeText too long (max ${MAX_RESUME_CHARS} chars)`);
  }
  if (jobDescription.length > MAX_JOB_CHARS) {
    return badRequest(res, `jobDescription too long (max ${MAX_JOB_CHARS} chars)`);
  }

  const safeLang = VALID_LANGS.has(lang) ? lang : "en";

  try {
    const { system, user } = buildMatchPrompt({
      resumeText: resumeText.trim(),
      jobDescription: jobDescription.trim(),
      lang: safeLang,
    });

    const result = await completeJson({
      system,
      user,
      schemaName: "job_match_analysis",
      schema: MATCH_SCHEMA,
      maxTokens: MATCH_MAX_TOKENS,
    });

    res.status(200).json({
      matchScore: clamp(result.matchScore),
      strengths: asStringArray(result.strengths, 5, 300),
      gaps: asStringArray(result.gaps, 5, 300),
      recommendedTopics: asStringArray(result.recommendedTopics, 6, 100),
      preparationPlan: asStringArray(result.preparationPlan, 5, 300),
      tailoredFocus: cut(result.tailoredFocus, 600),
    });
  } catch (err) {
    aiUnavailable(res, err);
  }
}



/* ────────────────────────────────────────────────────────────────────────────
   POST /api/generate-questions
   Generates realistic, varied interview questions for a given role using AI.
   Falls back gracefully — callers should use the static bank if this 503s.
   ──────────────────────────────────────────────────────────────────────────── */

export async function handleGenerateQuestions(req, res) {
  if (req.method && req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }
  if (!checkRateLimit(getClientIp(req), GENERATE_PER_MINUTE)) {
    return res.status(429).json({ error: "rate_limited", message: "Too many requests — slow down." });
  }
  if (!hasApiKey()) {
    return res.status(503).json({ error: "missing_api_key" });
  }

  const { role, interviewType, count, lang, recentTexts, experienceLevel, difficulty, focusAreas } = req.body ?? {};

  const commonError = validateCommon({ lang, role, interviewType });
  if (commonError) return badRequest(res, commonError);
  if (experienceLevel !== undefined && !VALID_LEVELS.has(experienceLevel)) {
    return badRequest(res, "unknown experienceLevel");
  }
  if (difficulty !== undefined && !VALID_DIFFICULTIES.has(difficulty)) {
    return badRequest(res, "unknown difficulty");
  }
  const safeLevel = VALID_LEVELS.has(experienceLevel) ? experienceLevel : "junior";
  const safeDifficulty = VALID_DIFFICULTIES.has(difficulty) ? difficulty : "mixed";

  const safeCount = Math.min(Math.max(1, Number(count) || 6), 8);
  const safeRecent = (Array.isArray(recentTexts) ? recentTexts : [])
    .slice(0, MAX_RECENT_TEXTS)
    .map((t) => cut(String(t ?? ""), MAX_RECENT_TEXT_CHARS));
  // focusAreas: from Job Match — bias questions toward these gap topics
  const safeFocusAreas = Array.isArray(focusAreas)
    ? focusAreas.slice(0, 10).map((s) => cut(String(s ?? ""), 120)).filter(Boolean)
    : [];

  try {
    const { system, user } = buildGenerateQuestionsPrompt({
      role: role ?? "general",
      interviewType: interviewType ?? "mixed",
      count: safeCount,
      lang: lang ?? "en",
      recentTexts: safeRecent,
      experienceLevel: safeLevel,
      difficulty: safeDifficulty,
      focusAreas: safeFocusAreas,
    });

    const result = await completeJson({
      system,
      user,
      schemaName: "interview_questions",
      schema: GENERATE_QUESTIONS_SCHEMA,
      maxTokens: GENERATE_MAX_TOKENS,
      temperature: 0.85,
    });

    const questions = (result.questions ?? []).slice(0, safeCount).map((q, i) => ({
      id: `ai-${Date.now().toString(36)}-${i}`,
      text_en:      cut(q.text_en ?? "", 600),
      text_he:      stripArabic(cut(q.text_he ?? "", 600)),
      type:         ["technical", "hr", "behavioral"].includes(q.type) ? q.type : "technical",
      tip_en:       cut(q.tip_en ?? "", 300),
      tip_he:       stripArabic(cut(q.tip_he ?? "", 300)),
      category:     cut(q.category ?? "", 60),
      difficulty:   ["junior", "mid", "senior"].includes(q.difficulty) ? q.difficulty : "mid",
      tags:         (Array.isArray(q.tags) ? q.tags : []).slice(0, 5).map((t) => cut(t, 30)),
      focusAreaTag: cut(q.focusAreaTag ?? "", 120),
    }));

    // Server-side focusAreaTag enforcement: for tailored sessions, every question must
    // carry a non-empty tag. If the AI returned "" (which it sometimes does despite the
    // prompt), assign the best-matching focus area based on the question's tags/category,
    // falling back to round-robin over the focus area list.
    if (safeFocusAreas.length > 0) {
      let assignIdx = 0;
      for (const q of questions) {
        if (!q.focusAreaTag) {
          const haystack = (q.category + " " + q.tags.join(" ")).toLowerCase();
          const matched = safeFocusAreas.find((area) =>
            haystack.includes(area.toLowerCase().substring(0, 15))
          );
          q.focusAreaTag = matched ?? safeFocusAreas[assignIdx % safeFocusAreas.length];
          assignIdx++;
        }
      }
    }

    if (questions.length === 0) {
      return res.status(503).json({ error: "ai_unavailable", message: "AI returned empty question list" });
    }

    return res.status(200).json({ questions });
  } catch (err) {
    aiUnavailable(res, err);
  }
}

/* ════════════════════════════════════════════════════════════════════════════
   AUTH-GATED SESSION PERSISTENCE
   Only POST /api/sessions and GET /api/sessions use this.
   All AI endpoints (evaluate, summarize, analyze-match) are unchanged.
   ════════════════════════════════════════════════════════════════════════════ */

import { supabaseAdmin } from "./supabaseAdmin.js";

/**
 * Verify the Bearer JWT and return the authenticated user object.
 * Throws { status, code } on failure — callers convert to HTTP errors.
 */
async function requireAuth(req) {
  if (!supabaseAdmin) {
    throw { status: 503, code: "auth_not_configured",
            message: "Supabase is not configured on this server." };
  }
  const raw = req.headers?.authorization ?? "";
  const token = raw.startsWith("Bearer ") ? raw.slice(7) : "";
  if (!token) {
    throw { status: 401, code: "unauthenticated", message: "Missing auth token." };
  }
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) {
    throw { status: 401, code: "invalid_token", message: "Token invalid or expired." };
  }
  return user; // { id: uuid, email: string, ... }
}

function authError(res, err) {
  return res.status(err.status ?? 500).json({
    error: err.code ?? "server_error",
    message: err.message ?? "Unexpected error",
  });
}

/* ── POST /api/sessions ──────────────────────────────────────────────────── */
export async function handleSaveSession(req, res) {
  if (req.method && req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }
  let user;
  try { user = await requireAuth(req); }
  catch (err) { return authError(res, err); }

  const {
    sessionId, roleId, interviewType, interviewerId,
    questionCount, lang, overall, summaryText, recommendations,
    answered, skipped, perType, date,
  } = req.body ?? {};

  if (!sessionId || typeof sessionId !== "string") {
    return badRequest(res, "sessionId is required");
  }

  const { error } = await supabaseAdmin.from("interview_sessions").upsert({
    id:              sessionId,
    user_id:         user.id,
    role_id:         cut(roleId ?? "general", 50),
    interview_type:  cut(interviewType ?? "mixed", 30),
    interviewer_id:  cut(interviewerId ?? "sarah", 30),
    question_count:  Math.max(0, Number(questionCount) || 0),
    lang:            VALID_LANGS.has(lang) ? lang : "en",
    overall:         clamp(overall ?? 0),
    summary_text:    cut(summaryText ?? "", 2000),
    recommendations: (Array.isArray(recommendations) ? recommendations : [])
                       .slice(0, 5).map((r) => cut(r, 300)),
    answered:        Math.max(0, Number(answered) || 0),
    skipped:         Math.max(0, Number(skipped) || 0),
    per_type:        (perType && typeof perType === "object") ? perType : {},
    completed_at:    date ? new Date(date).toISOString() : new Date().toISOString(),
  }, { onConflict: "id" });

  if (error) {
    console.error("[sessions] upsert error:", error.message);
    return res.status(500).json({ error: "db_error", message: error.message });
  }
  return res.status(200).json({ ok: true });
}

/* ── GET /api/sessions ───────────────────────────────────────────────────── */

export async function handleGetSessions(req, res) {
  if (req.method && req.method !== "GET") {
    return res.status(405).json({ error: "method_not_allowed" });
  }
  let user;
  try { user = await requireAuth(req); }
  catch (err) { return authError(res, err); }

  const limit = Math.min(100, Math.max(1, Number(req.query?.limit) || 50));

  const { data, error } = await supabaseAdmin
    .from("interview_sessions")
    .select(
      "id, role_id, interview_type, interviewer_id, question_count, lang, " +
      "overall, summary_text, recommendations, answered, skipped, per_type, completed_at"
    )
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(limit);

  if (error) {
        console.error("[sessions] fetch error:", error.message);
    return res.status(500).json({ error: "db_error", message: error.message });
  }

  return res.status(200).json({ sessions: data ?? [] });
}
