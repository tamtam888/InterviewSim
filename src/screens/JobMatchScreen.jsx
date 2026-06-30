import { useState, useEffect, useCallback, useRef } from "react";
import {
  Zap, Target, BookOpen, AlertTriangle,
  TrendingUp, ShieldCheck, Loader2, ChevronDown, ChevronUp, CheckCircle2,
  PlayCircle, Clock, Eye,
} from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { useAuth } from "../hooks/useAuth";
import { analyzeMatch } from "../api/matchClient";
import { loadCandidateProfile } from "../lib/candidateProfile.js";
import { saveJobMatch, fetchJobMatches } from "../lib/jobMatch.js";
import { inferRole } from "../lib/inferRole.js";
import ScoreRing from "../components/ScoreRing";
import "../styles/JobMatchScreen.css";

const RESUME_KEY       = "interviewsim.resumeText";
const JOB_KEY          = "interviewsim.jobDescription";
const LATEST_MATCH_KEY = "interviewsim.latestMatch.v1";

function load(key) {
  try { return localStorage.getItem(key) ?? ""; } catch { return ""; }
}
function persist(key, value) {
  try { localStorage.setItem(key, value); } catch { /* ignore */ }
}
function loadJson(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
}
function persistJson(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

/** Convert a DB row from job_matches → the result shape used in MatchResult */
function rowToResult(row) {
  return {
    matchScore:        row.match_score ?? 0,
    strengths:         Array.isArray(row.strengths) ? row.strengths : [],
    gaps:              Array.isArray(row.missing_skills) ? row.missing_skills : [],
    recommendedTopics: Array.isArray(row.interview_focus_areas) ? row.interview_focus_areas : [],
    preparationPlan:   Array.isArray(row.analysis?.preparationPlan) ? row.analysis.preparationPlan : [],
    tailoredFocus:     row.analysis?.tailoredFocus ?? "",
    source:            row.analysis?.source ?? "ai",
    savedAt:           row.created_at,
    _fromHistory:      true,
  };
}

/* ── Sub-components ─────────────────────────────────────────────────────────── */

function MatchResult({ result, saved, t, onStartTailored, jobDesc }) {
  const [showPlan, setShowPlan] = useState(false);
  const isAI = result.source === "ai";

  return (
    <div className="match-result fade-up">
      <div className="match-score-row">
        <div className="card match-score-card">
          <ScoreRing score={result.matchScore} size={110} label={t("matchScoreLabel")} />
          <span className="match-score-label">{t("matchScoreLabel")}</span>
          <span className={`match-source-badge ${isAI ? "badge-ai" : "badge-local"}`}>
            {t(isAI ? "matchSourceAI" : "matchSourceLocal")}
          </span>
          {result.aiUnavailable && (
            <p className="match-ai-note">{t("matchAIUnavailable")}</p>
          )}
          {saved && (
            <span className="match-saved-badge">
              <CheckCircle2 size={12} aria-hidden="true" />
              {t("matchSaved")}
            </span>
          )}
          {result.savedAt && !saved && (
            <p className="match-restored-note">{t("matchRestoredNote")}</p>
          )}
        </div>

        <div className="match-focus card">
          <h2 className="match-section-title">
            <Target size={13} aria-hidden="true" />
            {t("matchTailoredFocus")}
          </h2>
          <p className="match-focus-text">{result.tailoredFocus}</p>

          <h2 className="match-section-title match-section-title--spaced">
            <BookOpen size={13} aria-hidden="true" />
            {t("matchRecommendedTopics")}
          </h2>
          <div className="match-topic-chips">
            {(result.recommendedTopics ?? []).map((topic) => (
              <span key={topic} className="match-topic-chip">{topic}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="match-si-grid">
        <section className="card match-block block-strengths">
          <h2 className="match-section-title">
            <TrendingUp size={13} aria-hidden="true" />
            {t("matchStrengths")}
          </h2>
          <ul className="match-list">
            {(result.strengths ?? []).map((s) => <li key={s}>{s}</li>)}
          </ul>
        </section>

        <section className="card match-block block-gaps">
          <h2 className="match-section-title">
            <AlertTriangle size={13} aria-hidden="true" />
            {t("matchGaps")}
          </h2>
          <ul className="match-list">
            {(result.gaps ?? []).map((g) => <li key={g}>{g}</li>)}
          </ul>
        </section>
      </div>

      <div className="card match-plan-card">
        <button
          type="button"
          className="match-plan-toggle"
          onClick={() => setShowPlan((v) => !v)}
          aria-expanded={showPlan}
        >
          <span className="match-section-title">
            <Zap size={13} aria-hidden="true" />
            {t("matchPreparationPlan")}
          </span>
          {showPlan ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {showPlan && (
          <ol className="match-plan-list">
            {(result.preparationPlan ?? []).map((step, i) => (
              <li key={i}>
                <span className="match-plan-num">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Start Tailored Interview CTA */}
      {onStartTailored && (
        <div className="card match-tailored-cta">
          <div className="match-tailored-cta-text">
            <p className="match-tailored-cta-title">{t("matchStartTailoredTitle")}</p>
            <p className="match-tailored-cta-desc">{t("matchStartTailoredDesc")}</p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              const inferredRoleId = inferRole(jobDesc, [
                ...(result.gaps ?? []),
                ...(result.recommendedTopics ?? []),
              ]);
              if (import.meta.env.DEV) {
                console.group("[JobMatch] ▶ Start Tailored Interview (current result)");
                console.log("jobDesc preview:", jobDesc.slice(0, 120));
                console.log("focusAreas passed to inferRole:", [...(result.gaps ?? []), ...(result.recommendedTopics ?? [])]);
                console.log("inferredRoleId:", inferredRoleId, "-> resolvedRoleId:", inferredRoleId ?? "general");
                console.log("gaps:", result.gaps);
                console.log("recommendedTopics:", result.recommendedTopics);
                console.groupEnd();
              }
              onStartTailored({
                gaps:              result.gaps,
                recommendedTopics: result.recommendedTopics,
                tailoredFocus:     result.tailoredFocus,
                matchScore:        result.matchScore,
                inferredRoleId:    inferredRoleId,
              });
            }}
          >
            <PlayCircle size={18} aria-hidden="true" />
            {t("matchStartTailoredBtn")}
          </button>
        </div>
      )}
    </div>
  );
}

/** Returns a CSS suffix for semantic score colouring — matches ScoreRing thresholds. */
function scoreTone(score) {
  if (score >= 85) return "excellent";
  if (score >= 65) return "good";
  if (score >= 40) return "fair";
  return "low";
}

function MatchHistoryItem({ row, t, onView, onStartTailored }) {
  const gapsCount     = Array.isArray(row.missing_skills) ? row.missing_skills.length : 0;
  const strengthCount = Array.isArray(row.strengths) ? row.strengths.length : 0;
  const preview       = (row.job_description ?? "").slice(0, 90).trimEnd();
  const date          = new Date(row.created_at).toLocaleDateString(undefined, {
    month: "short", day: "numeric", year: "numeric",
  });

  const gapLabel      = gapsCount === 1 ? t("matchHistoryGaps") : t("matchHistoryGapsPlural");
  const strengthLabel = strengthCount === 1 ? t("matchHistoryStrengths") : t("matchHistoryStrengthsPlural");

  return (
    <div className="match-history-item">
      <div className="match-history-meta">
        <span className={`match-history-score-badge score-${scoreTone(row.match_score)}`}>
          {row.match_score ?? "—"}%
        </span>
        <span className="match-history-date">
          <Clock size={11} aria-hidden="true" />
          {date}
        </span>
        <span className="match-history-counts">
          {gapsCount} {gapLabel} · {strengthCount} {strengthLabel}
        </span>
      </div>
      {preview && (
        <p className="match-history-preview">
          {preview}{(row.job_description ?? "").length > 90 ? "…" : ""}
        </p>
      )}
      <div className="match-history-actions">
        <button
          type="button"
          className="btn btn-sm btn-ghost"
          onClick={() => onView(row)}
        >
          <Eye size={14} aria-hidden="true" />
          {t("matchHistoryView")}
        </button>
        {onStartTailored && (
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={() => {
              const jobDescText = row.job_description ?? "";
              const inferredRoleId = inferRole(jobDescText, [
                ...(Array.isArray(row.missing_skills) ? row.missing_skills : []),
                ...(Array.isArray(row.interview_focus_areas) ? row.interview_focus_areas : []),
              ]);
              if (import.meta.env.DEV) {
                console.group("[JobMatch] ▶ Start Tailored Interview (history row)");
                console.log("jobDesc preview:", jobDescText.slice(0, 120));
                console.log("focusAreas passed to inferRole:", [...(Array.isArray(row.missing_skills) ? row.missing_skills : []), ...(Array.isArray(row.interview_focus_areas) ? row.interview_focus_areas : [])]);
                console.log("inferredRoleId:", inferredRoleId, "-> resolvedRoleId:", inferredRoleId ?? "general");
                console.log("gaps:", row.missing_skills);
                console.log("recommendedTopics:", row.interview_focus_areas);
                console.groupEnd();
              }
              onStartTailored({
                gaps:              Array.isArray(row.missing_skills) ? row.missing_skills : [],
                recommendedTopics: Array.isArray(row.interview_focus_areas) ? row.interview_focus_areas : [],
                tailoredFocus:     row.analysis?.tailoredFocus ?? "",
                matchScore:        row.match_score ?? 0,
                inferredRoleId:    inferredRoleId,
              });
            }}
          >
            <PlayCircle size={14} aria-hidden="true" />
            {t("matchStartTailoredBtn")}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Main screen ────────────────────────────────────────────────────────────── */

export default function JobMatchScreen({ onStartTailored }) {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const resultRef = useRef(null);

  const [resumeText,         setResumeText]         = useState(() => load(RESUME_KEY));
  const [jobDesc,            setJobDesc]             = useState(() => load(JOB_KEY));
  const [loading,            setLoading]             = useState(false);
  const [loadingResume,      setLoadingResume]       = useState(false);
  const [result,             setResult]              = useState(() => loadJson(LATEST_MATCH_KEY));
  const [error,              setError]               = useState(null);
  const [isSaved,            setIsSaved]             = useState(false);
  const [candidateProfileId, setCandidateProfileId]  = useState(null);
  const [history,            setHistory]             = useState(null);
  const [historyLoading,     setHistoryLoading]      = useState(false);

  useEffect(() => { persist(JOB_KEY, jobDesc); }, [jobDesc]);

  // Load resume from Supabase when authenticated; fall back to localStorage value
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoadingResume(true);
    loadCandidateProfile().then((profile) => {
      if (cancelled) return;
      if (profile?.resume_text) {
        setResumeText(profile.resume_text);
        setCandidateProfileId(profile.id ?? null);
      }
      setLoadingResume(false);
    });
    return () => { cancelled = true; };
  }, [user]);

  // Load match history from Supabase when authenticated
  const loadHistory = useCallback(async () => {
    if (!user) return;
    setHistoryLoading(true);
    const rows = await fetchJobMatches(20);
    setHistory(rows ?? []);
    setHistoryLoading(false);
  }, [user]);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  const canAnalyze = resumeText.trim().length >= 20 && jobDesc.trim().length >= 20;

  const handleAnalyze = useCallback(async () => {
    if (!canAnalyze || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setIsSaved(false);
    try {
      const res = await analyzeMatch(resumeText, jobDesc, lang);
      const withMeta = { ...res, savedAt: new Date().toISOString() };
      setResult(withMeta);
      persistJson(LATEST_MATCH_KEY, withMeta);

      if (user) {
        const saveRes = await saveJobMatch({
          jobDescription:    jobDesc,
          candidateProfileId,
          matchScore:        res.matchScore,
          strengths:         res.strengths,
          gaps:              res.gaps,
          recommendedTopics: res.recommendedTopics,
          preparationPlan:   res.preparationPlan,
          tailoredFocus:     res.tailoredFocus,
          source:            res.source,
        });
        if (saveRes?.ok) {
          setIsSaved(true);
          // Refresh history to show the newly saved match
          loadHistory();
        }
      }
    } catch (err) {
      setError(err.message ?? t("matchGenericError"));
    } finally {
      setLoading(false);
    }
  }, [canAnalyze, loading, resumeText, jobDesc, lang, user, candidateProfileId, t, loadHistory]);

  const handleClearJob = useCallback(() => {
    setJobDesc("");
    setResult(null);
    setIsSaved(false);
    setError(null);
    try { localStorage.removeItem(LATEST_MATCH_KEY); } catch { /* ignore */ }
  }, []);

  const handleViewHistory = useCallback((row) => {
    const restored = rowToResult(row);
    setResult(restored);
    setIsSaved(false);
    // Scroll result into view
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }, []);

  return (
    <main className="screen container job-match-page">
      <header className="screen-head">
        <h1 className="section-title">{t("jobMatchTitle")}</h1>
        <p className="screen-subtitle">{t("jobMatchSubtitle")}</p>
      </header>

      <div className="match-privacy">
        <ShieldCheck size={15} aria-hidden="true" />
        <p>{t("matchPrivacyNote")}</p>
      </div>

      <div className="match-inputs">
        <div className="match-input-col">
          <label className="match-label" htmlFor="match-resume">
            {t("matchResumeLabel")}
          </label>
          {loadingResume && (
            <p className="match-loading-hint">
              <Loader2 size={13} className="spin" aria-hidden="true" />
              {t("matchLoadingResume")}
            </p>
          )}
          {!resumeText && !loadingResume && (
            <p className="match-from-resume-hint">{t("matchResumeHint")}</p>
          )}
          <textarea
            id="match-resume"
            className="match-textarea"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder={t("matchResumePlaceholder")}
            rows={12}
            spellCheck={false}
            disabled={loadingResume}
          />
        </div>

        <div className="match-input-col">
          <label className="match-label" htmlFor="match-job">
            {t("matchJobLabel")}
          </label>
          <textarea
            id="match-job"
            className="match-textarea"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder={t("matchJobPlaceholder")}
            rows={12}
            spellCheck={false}
          />
        </div>
      </div>

      <div className="match-cta-row">
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={handleAnalyze}
          disabled={!canAnalyze || loading || loadingResume}
        >
          {loading ? (
            <>
              <Loader2 size={20} className="spin" aria-hidden="true" />
              {t("matchAnalyzing")}
            </>
          ) : (
            <>
              <Zap size={20} aria-hidden="true" />
              {t("matchAnalyzeBtn")}
            </>
          )}
        </button>
        {(jobDesc.trim() || result) && !loading && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={handleClearJob}
          >
            {t("clearJobBtn")}
          </button>
        )}
        {!canAnalyze && !loading && (
          <p className="match-cta-hint">{t("matchCtaHint")}</p>
        )}
      </div>

      {error && (
        <div className="match-error">
          <AlertTriangle size={16} aria-hidden="true" />
          {error}
        </div>
      )}

      {result && (
        <div ref={resultRef}>
          <MatchResult
            result={result}
            saved={isSaved}
            t={t}
            onStartTailored={onStartTailored}
            jobDesc={jobDesc}
          />
        </div>
      )}

      {/* ── Match History ───────────────────────────────────────────────── */}
      {user && (
        <section className="match-history-section">
          <h2 className="match-history-title">
            <Clock size={14} aria-hidden="true" />
            {t("matchHistoryTitle")}
          </h2>

          {historyLoading && (
            <p className="match-loading-hint">
              <Loader2 size={13} className="spin" aria-hidden="true" />
              {t("matchHistoryLoading")}
            </p>
          )}

          {!historyLoading && history !== null && history.length === 0 && (
            <p className="match-history-empty">{t("matchHistoryEmpty")}</p>
          )}

          {!historyLoading && history && history.length > 0 && (
            <div className="match-history-list">
              {history.map((row) => (
                <MatchHistoryItem
                  key={row.id}
                  row={row}
                  t={t}
                  onView={handleViewHistory}
                  onStartTailored={onStartTailored}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
