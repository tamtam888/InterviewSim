import { useEffect, useRef, useState } from "react";
import {
  RotateCcw,
  PlusCircle,
  Home,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  Cloud,
  Target,
  XCircle,
} from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { useAuth } from "../hooks/useAuth";
import { getRole } from "../data/roles";
import { scoreLevelKey } from "../utils/scoreLevel";
import { evaluationClient } from "../api/evaluationClient";
import {
  recordSession,
  perTypeScores,
  getHistory,
  saveSessionCloud,
} from "../utils/practiceHistory";
import ScoreRing from "../components/ScoreRing";
import "../styles/SummaryScreen.css";

const COVERAGE_STOP = new Set(["and", "or", "the", "a", "an", "of", "in", "for", "to", "with", "how", "what", "when", "why", "its"]);

function isFocusAreaCovered(area, results) {
  // Prefer exact focusAreaTag match (ground truth set by the AI at generation time).
  // Fall back to keyword matching for older sessions/static-bank questions that lack focusAreaTag.
  const areaLower = area.toLowerCase();

  const tagMatch = results.some((r) => {
    const tag = r.question?.focusAreaTag ?? "";
    return tag && tag.toLowerCase() === areaLower;
  });
  if (tagMatch) return true;

  // Keyword fallback — only used when no result has a focusAreaTag for this area
  const keywords = area.toLowerCase()
    .replace(/[/\-()]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !COVERAGE_STOP.has(w));
  if (keywords.length === 0) return false;
  return results.some((r) => {
    const haystack = [
      r.question?.text?.en ?? "",
      r.question?.category ?? "",
      ...(r.question?.tags ?? []),
    ].join(" ").toLowerCase();
    return keywords.some((kw) => haystack.includes(kw));
  });
}

/**
 * Derive an overall score from the results array without waiting for the AI
 * summarizeSession response.  Used to record the session to localStorage as
 * soon as the Summary screen mounts so the streak counter always has a record.
 * The AI-derived overall (stored on cloud save) may differ slightly; the local
 * record is idempotent per sessionId so the early write is never duplicated.
 */
function computeLocalOverall(results) {
  const scored = results.filter(
    (r) => !r.feedback?.skipped && typeof r.feedback?.score === "number"
  );
  if (scored.length === 0) return 0;
  return Math.round(
    scored.reduce((sum, r) => sum + r.feedback.score, 0) / scored.length
  );
}

function ResultItem({ result, index }) {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const { question, answer, feedback } = result;

  return (
    <li className="card result-item">
      <button
        type="button"
        className="result-item-head"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className={`result-score score-${scoreLevelKey(feedback.score)}`}>
          {feedback.skipped ? "\u2014" : feedback.score}
        </span>
        <span className="result-question">
          <span className="result-index">
            {t("questionOf")} {index + 1}
          </span>
          {question.text[lang]}
        </span>
        {open ? (
          <ChevronUp size={18} aria-hidden="true" />
        ) : (
          <ChevronDown size={18} aria-hidden="true" />
        )}
      </button>

      {open && (
        <div className="result-item-body">
          <h3 className="result-block-title">{t("yourAnswer")}</h3>
          <p className="result-answer">
            {feedback.skipped ? <em>{t("skippedAnswer")}</em> : answer}
          </p>

          {feedback.strengths.length > 0 && (
            <>
              <h3 className="result-block-title result-title-green">
                <CheckCircle2 size={14} aria-hidden="true" /> {t("strengths")}
              </h3>
              <ul className="result-list">
                {feedback.strengths.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </>
          )}

          {feedback.improvements.length > 0 && (
            <>
              <h3 className="result-block-title result-title-amber">
                <TrendingUp size={14} aria-hidden="true" /> {t("improvements")}
              </h3>
              <ul className="result-list">
                {feedback.improvements.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </>
          )}

          <h3 className="result-block-title result-title-violet">
            <Lightbulb size={14} aria-hidden="true" /> {t("suggestedAnswer")}
          </h3>
          <p className="result-model">{feedback.suggestedAnswer ?? question.model[lang]}</p>
        </div>
      )}
    </li>
  );
}

export default function SummaryScreen({
  results,
  roleId,
  interviewType,
  interviewerId,
  questionCount,
  experienceLevel = "junior",
  difficulty = "mixed",
  sessionId,
  focusAreas = null,
  onRestartSame,
  onNewInterview,
  onHome,
}) {
  const { t, lang } = useLanguage();
  const { user, session } = useAuth();
  const role = getRole(roleId);
  const [summary, setSummary] = useState(null);
  // 'idle' | 'saved' | 'failed'  ('saving' intentionally omitted — avoids sync setState in effect)
  const [cloudStatus, setCloudStatus] = useState("idle");
  // Guard: cloud save must fire at most once per mount, even if session token refreshes.
  const cloudSaveAttempted = useRef(false);

  const [priorAvg] = useState(() => {
    // Exclude the current session and any skipped-only sessions (answered === 0)
    // so the delta shown on the score ring reflects real prior performance only.
    const prior = getHistory().filter(
      (r) => r.sessionId !== sessionId && (r.answered ?? 0) > 0
    );
    if (prior.length === 0) return null;
    return Math.round(prior.reduce((sum, r) => sum + (r.overall ?? 0), 0) / prior.length);
  });

  // Record the session to localStorage as soon as results and sessionId are
  // available — do NOT wait for the AI summarizeSession call.
  // This guarantees the streak counter always sees the session even when:
  //   • the user navigates away before summarizeSession resolves, or
  //   • the AI endpoint is slow or unavailable.
  // recordSession is idempotent per sessionId, so the write below and the
  // later write inside the summary effect (which adds AI fields) are safe.
  useEffect(() => {
    if (!sessionId || !results.length) return;
    recordSession({
      sessionId,
      date:            Date.now(),
      roleId,
      interviewType,
      interviewerId:   interviewerId   ?? "sarah",
      questionCount:   questionCount   ?? results.length,
      experienceLevel: experienceLevel ?? "junior",
      difficulty:      difficulty      ?? "mixed",
      lang,
      overall:         computeLocalOverall(results),
      answered:        results.filter((r) => !r.feedback?.skipped).length,
      skipped:         results.filter((r) =>  r.feedback?.skipped).length,
      perType:         perTypeScores(results),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally runs once on mount — results/sessionId are stable

  // Fetch AI summary
  useEffect(() => {
    let active = true;
    evaluationClient
      .summarizeSession(results, lang, { roleId, interviewType })
      .then((s) => { if (active) setSummary(s); });
    return () => { active = false; };
  }, [results, lang, roleId, interviewType]);

  // Save to localStorage + cloud once summary is ready
  useEffect(() => {
    if (!summary || !sessionId) return;

    const record = {
      sessionId,
      date: Date.now(),
      roleId,
      interviewType,
      interviewerId:   interviewerId   ?? "sarah",
      questionCount:   questionCount   ?? results.length,
      experienceLevel: experienceLevel ?? "junior",
      difficulty:      difficulty      ?? "mixed",
      lang,
      overall: summary.overall,
      summaryText: summary.summaryText ?? "",
      recommendations: summary.recommendations ?? [],
      answered: summary.answeredCount,
      skipped: summary.skippedCount,
      perType: perTypeScores(results),
    };

    // 1. Always write to localStorage first (works for guests too)
    recordSession(record);

    // 2. If signed in, fire cloud save without blocking the UI.
    // Guard with a ref so a session token refresh cannot trigger a duplicate save.
    if (user && session?.access_token && !cloudSaveAttempted.current) {
      cloudSaveAttempted.current = true;
      saveSessionCloud(record, session.access_token)
        .then(() => setCloudStatus("saved"))
        .catch(() => setCloudStatus("failed"));
    }
  }, [summary, sessionId, roleId, interviewType, interviewerId, questionCount, experienceLevel, difficulty, lang, results, user, session]);

  if (!summary) {
    return (
      <main className="screen container summary">
        <p className="summary-loading">{t("loadingSummary")}</p>
      </main>
    );
  }

  const delta = priorAvg !== null ? summary.overall - priorAvg : null;

  return (
    <main className="screen container summary">
      <header className="screen-head">
        <h1 className="feedback-title">{t("summaryTitle")}</h1>
        {role && (
          <p className="feedback-question-ref">
            {role.name[lang]}
            {interviewType && (
              <> · {t(`type${interviewType.charAt(0).toUpperCase()}${interviewType.slice(1)}`)}</>
            )}
          </p>
        )}
        {/* Cloud save status — only shown when signed in */}
        {cloudStatus === "saved" && (
          <p className="summary-cloud-status status-saved">
            <Cloud size={12} aria-hidden="true" />
            {t("sessionSavedCloud")}
          </p>
        )}
      </header>

      <section className="summary-top">
        <div className="card summary-score-card fade-up">
          <ScoreRing score={summary.overall} size={130} label={t("overallScore")} />
          <span className="score-level">{t(scoreLevelKey(summary.overall))}</span>
          <span className="summary-score-label">{t("overallScore")}</span>
          {delta !== null && (
            <span className={`summary-delta ${delta >= 0 ? "delta-up" : "delta-down"}`}>
              {delta >= 0 ? "+" : ""}{delta} {t("vsYourAverage")}
            </span>
          )}
        </div>

        <div className="summary-stats fade-up">
          <div className="stats-bar">
            <div className="stats-bar-item">
              <span className="stats-bar-value stat-green">{summary.answeredCount}</span>
              <span className="stats-bar-label">{t("questionsAnswered")}</span>
            </div>
            <div className="stats-bar-item">
              <span className="stats-bar-value stat-amber">{summary.skippedCount}</span>
              <span className="stats-bar-label">{t("questionsSkipped")}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="card recommendations fade-up">
        <h2 className="feedback-block-title">
          <Lightbulb size={14} aria-hidden="true" />
          {t("recommendations")}
        </h2>
        {summary.summaryText && (
          <p className="summary-overview">{summary.summaryText}</p>
        )}
        <ul className="feedback-list">
          {summary.recommendations.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      {focusAreas?.length > 0 && (() => {
        const coverageMap = focusAreas.map((area) => ({
          area,
          covered: isFocusAreaCovered(area, results),
        }));
        const coveredCount = coverageMap.filter((c) => c.covered).length;
        const pct = Math.round((coveredCount / focusAreas.length) * 100);
        return (
          <section className="card coverage-card fade-up">
            <h2 className="feedback-block-title">
              <Target size={14} aria-hidden="true" />
              {t("coverageTitle")}
            </h2>
            <p className="coverage-subtitle">{t("coverageSubtitle")}</p>
            <div className="coverage-grid">
              {coverageMap.map(({ area, covered }) => (
                <div key={area} className={`coverage-item ${covered ? "hit" : "miss"}`}>
                  {covered
                    ? <CheckCircle2 size={14} aria-hidden="true" />
                    : <XCircle size={14} aria-hidden="true" />}
                  <span>{area}</span>
                </div>
              ))}
            </div>
            <p className="coverage-pct">
              {coveredCount} {t("coverageOf")} {focusAreas.length} {t("coverageCovered")} ({pct}%)
            </p>
          </section>
        );
      })()}

      <section className="summary-results">
        <h2 className="summary-results-title">{t("allQuestions")}</h2>
        <p className="summary-results-hint">{lang === "he" ? "לחצי על שאלה כדי לצפות בתשובה ובמשוב המלא." : "Select a question to review your answer and detailed feedback."}</p>
        <ul className="results-list">
          {results.map((result, i) => (
            <ResultItem key={result.question.id} result={result} index={i} />
          ))}
        </ul>
      </section>

      <div className="summary-actions">
        <button type="button" className="btn btn-primary btn-lg" onClick={onRestartSame}>
          <RotateCcw size={18} aria-hidden="true" />
          {t("practiceAgain")}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onNewInterview}>
          <PlusCircle size={18} aria-hidden="true" />
          {t("newInterview")}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onHome}>
          <Home size={18} aria-hidden="true" />
          {lang === "he" ? "לעמוד הבית" : "Home"}
        </button>
      </div>
    </main>
  );
}
