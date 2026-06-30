/**
 * Evaluation client — the single seam between the UI and whatever produces
 * answer feedback.
 *
 * Strategy: try the app's own backend (/api/*) and fall back to the local
 * heuristic engine on ANY failure. No secrets live in this file.
 */
import {
  evaluateAnswer as localEvaluateAnswer,
  summarizeSession as localSummarizeSession,
} from "../utils/feedback";

const REQUEST_TIMEOUT_MS = 25000;

async function postJson(url, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`API ${url} responded ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function questionPayload(question, lang) {
  return {
    text: question.text[lang] ?? question.text.en,
    type: question.type,
    tip: question.tip?.[lang] ?? null,
  };
}

/** Derive a local follow-up question when the score is weak and the AI is unavailable. */
function localFollowUp(question, score, lang) {
  if (score >= 60) return { shouldAskFollowUp: false, followUpQuestion: "", followUpReason: "" };
  const prompts = {
    technical: {
      en: `Can you walk me through a concrete example where you applied this concept in a real project?`,
      he: `ספר לי על דוגמה קונקרטית שבה יישמת את המושג הזה בפרויקט אמיתי.`,
    },
    behavioral: {
      en: `Can you give a more specific example — what was the situation, what exactly did YOU do, and what was the measurable outcome?`,
      he: `ספר לי על מקרה ספציפי — מה הייתה הסיטואציה, מה עשית בדיוק, ומה הייתה התוצאה?`,
    },
    hr: {
      en: `Can you tell me more about your personal motivation here — what specifically drives you toward this role?`,
      he: `ספר לי יותר על המוטיבציה האישית שלך — מה ספציפית מניע אותך לתפקיד הזה?`,
    },
  };
  const type = question?.type ?? "technical";
  const prompt = prompts[type] ?? prompts.technical;
  const reason = {
    en: "Your answer was too brief or lacked a concrete example.",
    he: "התשובה שלך הייתה קצרה מדי או חסרה דוגמה קונקרטית.",
  };
  return {
    shouldAskFollowUp: true,
    followUpQuestion: prompt[lang] ?? prompt.en,
    followUpReason: reason[lang] ?? reason.en,
  };
}

export const evaluationClient = {
  name: "ai-with-local-fallback",

  async evaluateAnswer(question, answerText, lang, context = {}) {
    const trimmed = (answerText ?? "").trim();

    if (!trimmed) {
      return { ...localEvaluateAnswer(question, "", lang), source: "local", shouldAskFollowUp: false, followUpQuestion: "", followUpReason: "" };
    }

    try {
      const ai = await postJson("/api/evaluate-answer", {
        role: context.roleId ?? "general",
        interviewType: context.interviewType ?? "mixed",
        interviewerId: context.interviewerId ?? "sarah",
        question: questionPayload(question, lang),
        answer: trimmed,
        lang,
        sessionContext: {
          questionNumber: context.questionNumber,
          totalQuestions: context.totalQuestions,
        },
      });
      return {
        score: ai.score,
        skipped: false,
        strengths: ai.strengths,
        improvements: ai.improvements,
        suggestedAnswer: ai.suggestedAnswer || null,
        nextPracticeTip: ai.nextPracticeTip || null,
        shouldAskFollowUp: Boolean(ai.shouldAskFollowUp),
        followUpQuestion: ai.followUpQuestion || "",
        followUpReason: ai.followUpReason || "",
        source: "ai",
      };
    } catch {
      const local = localEvaluateAnswer(question, trimmed, lang);
      return {
        ...local,
        ...localFollowUp(question, local.score, lang),
        source: "local",
        aiUnavailable: true,
      };
    }
  },

  async summarizeSession(results, lang, context = {}) {
    const local = localSummarizeSession(results, lang);
    const answered = results.filter((r) => !r.feedback.skipped);
    if (answered.length === 0) return { ...local, source: "local" };

    try {
      const ai = await postJson("/api/summarize-session", {
        role: context.roleId ?? "general",
        interviewType: context.interviewType ?? "mixed",
        lang,
        results: results.map((r) => ({
          question: questionPayload(r.question, lang),
          answer: r.answer,
          skipped: r.feedback.skipped,
          score: r.feedback.score,
        })),
      });
      return {
        ...local,
        overall: ai.overall,
        summaryText: ai.summary || null,
        recommendations: ai.recommendations?.length ? ai.recommendations : local.recommendations,
        source: "ai",
      };
    } catch {
      return { ...local, source: "local" };
    }
  },
};
