import { useState } from "react";
import { Mic, MicOff, Send, SkipForward, Lightbulb, Flag, Loader2 } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { getRole } from "../data/roles";
import { getInterviewerForQuestion } from "../data/interviewers";
import { useSpeechInput } from "../hooks/useSpeechInput";
import "../styles/InterviewScreen.css";

export default function InterviewScreen({
  question,
  isFollowUp = false,
  normalQCount = 1,
  originalTotal = 1,
  roleId,
  interviewerId,
  interviewType,
  focusAreas = null,
  matchScore = null,
  focusAreasFallback = null,
  evaluating,
  onSubmit,
  onSkip,
  onEnd,
}) {
  const { t, lang } = useLanguage();
  const role = getRole(roleId);
  const interviewer = getInterviewerForQuestion(question.type, interviewType);
  const [answer, setAnswer] = useState("");
  const [confirmEnd, setConfirmEnd] = useState(false);

  const { supported, listening, toggle, stop } = useSpeechInput({
    lang,
    onTranscript: (text) =>
      setAnswer((prev) => (prev ? `${prev} ${text}` : text)),
  });

  if (!question) return null;

  // Progress is based on original question count only.
  // For a follow-up the bar stays at the parent question's level (normalQCount
  // already points at the completed parent question when isFollowUp is true).
  const progress = (normalQCount / originalTotal) * 100;
  const canSubmit = answer.trim().length > 0 && !evaluating;

  const handleSubmit = () => {
    stop();
    onSubmit(answer.trim());
  };

  return (
    <main className="screen container interview">
      <header className="interview-head">
        <div className="interview-meta">
          <span className="pill">{role?.name[lang]}</span>
          {isFollowUp ? (
            <span className="interview-count interview-count--followup">
              {t("followUpPracticeLabel")}
            </span>
          ) : (
            <span className="interview-count">
              {t("questionOf")} {normalQCount} {t("of")} {originalTotal}
            </span>
          )}
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={normalQCount}
          aria-valuemin={1}
          aria-valuemax={originalTotal}
        >
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </header>

      {focusAreas?.length > 0 && (
        <div className="tailored-banner">
          <span className="tailored-badge">{t("tailoredBadge")}</span>
          <span className="tailored-meta-info">
            <span>{focusAreas.length} {t("tailoredFocusCount")}</span>
            {matchScore != null && (
              <>
                <span className="meta-sep">·</span>
                <span>{matchScore}% {t("tailoredMatchScore")}</span>
              </>
            )}
          </span>
        </div>
      )}

      {focusAreasFallback && (
        <div className="fallback-notice" role="status">
          {t("tailoredFallbackNote")}
        </div>
      )}

      <section className="card question-card fade-up">
        <div className="interviewer-row">
          <span className={`interview-avatar avatar-${interviewer.accent}`} aria-hidden="true">
            <img src={interviewer.portrait} alt="" className="interview-photo" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            <span className="interview-avatar-fallback">{interviewer.initial[lang]}</span>
          </span>
          <span className="interviewer-identity">
            <span className="interviewer-identity-name">
              {interviewer.name[lang]} · {interviewer.title[lang]}
            </span>
            <span className="interviewer-identity-label">
              {interviewer.style[lang]} · {t("interviewerLabel")}
            </span>
          </span>
          <span className={`pill question-type-pill type-${question.type}`}>
            {t(
              question.type === "technical"
                ? "typeTechnical"
                : question.type === "hr"
                  ? "typeHr"
                  : "typeBehavioral"
            )}
          </span>
        </div>

        <h1 className="question-text">{question.text[lang]}</h1>

        {question.tip?.[lang] && (
          <p className="question-tip">
            <Lightbulb size={16} aria-hidden="true" />
            <span>
              <strong>{t("tipLabel")}:</strong> {question.tip[lang]}
            </span>
          </p>
        )}
      </section>

      <section className="answer-area">
        <textarea
          className={`answer-input ${listening ? "is-listening" : ""}`}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={t("answerPlaceholder")}
          rows={8}
          aria-label={t("answerPlaceholder")}
        />
        <div className="answer-toolbar">
          {supported ? (
            <button
              type="button"
              className={`btn btn-secondary mic-btn ${listening ? "is-recording" : ""}`}
              onClick={toggle}
              aria-pressed={listening}
            >
              {listening ? <MicOff size={18} /> : <Mic size={18} />}
              <span>{listening ? t("recording") : t("speakAnswer")}</span>
            </button>
          ) : (
            <span className="voice-unsupported">{t("voiceNotSupported")}</span>
          )}
          <span className="char-count">
            {answer.length} {t("charCount")}
          </span>
        </div>
      </section>

      <div className="interview-actions">
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={handleSubmit}
          disabled={!canSubmit}
          aria-busy={evaluating}
        >
          {evaluating ? (
            <Loader2 size={18} className="spin" aria-hidden="true" />
          ) : (
            <Send size={18} aria-hidden="true" />
          )}
          {evaluating ? t("evaluating") : t("submitAnswer")}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onSkip} disabled={evaluating}>
          <SkipForward size={16} aria-hidden="true" />
          {t("skipQuestion")}
        </button>
        <button
          type="button"
          className="btn btn-ghost end-btn"
          onClick={() => setConfirmEnd(true)}
          disabled={evaluating}
        >
          <Flag size={16} aria-hidden="true" />
          {t("endInterview")}
        </button>
      </div>

      {confirmEnd && (
        <div className="modal-backdrop" role="presentation" onClick={() => setConfirmEnd(false)}>
          <div
            className="card modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-end-title"
            onClick={(e) => e.stopPropagation()}>
            <h2 id="confirm-end-title">{t("confirmEndTitle")}</h2>
            <p>{t("confirmEndText")}</p>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setConfirmEnd(false)}>
                {t("confirmEndNo")}
              </button>
              <button type="button" className="btn btn-primary" onClick={onEnd}>
                {t("confirmEndYes")}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
