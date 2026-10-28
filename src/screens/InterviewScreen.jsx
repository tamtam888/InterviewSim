import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Send, SkipForward, Flag, Loader2, Volume2, VolumeX, MessageCircleQuestion } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { getRole } from "../data/roles";
import { getInterviewerForQuestion } from "../data/interviewers";
import { useSpeechInput } from "../hooks/useSpeechInput";
import { useQuestionAudio } from "../hooks/useQuestionAudio";
import "../styles/InterviewScreen.css";

export default function InterviewScreen({
  question,
  isFollowUp = false,
  normalQCount = 1,
  originalTotal = 1,
  roleId,
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
  const interviewer = getInterviewerForQuestion(question?.type, interviewType);
  const [answer, setAnswer] = useState("");
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [clarification, setClarification] = useState("");
  const [clarifying, setClarifying] = useState(false);
  const [clarificationError, setClarificationError] = useState("");
  const displayedQuestion = question?.text?.[lang] || question?.text?.en || "";
  const { canSpeak, speaking, speak, stopSpeech } = useQuestionAudio({ lang, questionText: displayedQuestion });
  const clarificationCount = useRef(0);
  const [clarificationUsed, setClarificationUsed] = useState(0);
  const clarificationRequest = useRef(null);

  useEffect(() => {
    // Never carry a previous question's clarification or speech into a new question.
    clarificationRequest.current?.abort();
    clarificationRequest.current = null;
    clarificationCount.current = 0;
    setClarificationUsed(0);
    setClarification("");
    setClarificationError("");
    setClarifying(false);
  }, [question?.id, displayedQuestion, lang]);

  useEffect(() => () => {
    clarificationRequest.current?.abort();
  }, []);

  const clarifyQuestion = async () => {
    if (clarifying || clarificationCount.current >= 2) return;
    stop();
    stopSpeech();
    clarificationCount.current += 1;
    setClarificationUsed(clarificationCount.current);
    setClarifying(true);
    setClarificationError("");
    const controller = new AbortController();
    clarificationRequest.current = controller;
    try {
      const res = await fetch("/api/clarify-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: displayedQuestion,
          lang,
          role: role?.name?.[lang] || "General",
        }),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error("clarification_unavailable");
      const data = await res.json();
      if (typeof data.clarification !== "string" || !data.clarification.trim()) {
        throw new Error("empty_clarification");
      }
      setClarification(data.clarification.trim());
    } catch (err) {
      if (err.name !== "AbortError") {
        // Preserve the interview when the AI service is unavailable.
        setClarification(displayedQuestion);
        setClarificationError(lang === "he"
          ? "לא ניתן לנסח מחדש כרגע. אפשר להאזין שוב לשאלה המקורית."
          : "Rephrasing is unavailable. You can listen to the original question again.");
      }
    } finally {
      setClarifying(false);
    }
  };

  const { supported, listening, toggle, stop } = useSpeechInput({
    lang,
    onTranscript: (text) => {
      const normalized = text.trim().toLocaleLowerCase();
      // A spoken request for clarification is a command, not an interview answer.
      if (/^(לא הבנתי|לא ברור לי|אפשר לחזור על השאלה|תחזור על השאלה|תחזרי על השאלה|אפשר להסביר|i don't understand|i do not understand|please repeat|repeat the question|can you rephrase|could you rephrase)/i.test(normalized)) {
        void clarifyQuestion();
        return;
      }
      setAnswer((prev) => (prev ? `${prev} ${text}` : text));
    },
  });

  if (!question) return null;

  // Progress is based on original question count only.
  // For a follow-up the bar stays at the parent question's level (normalQCount
  // already points at the completed parent question when isFollowUp is true).
  const progress = (normalQCount / originalTotal) * 100;
  const canSubmit = answer.trim().length > 0 && !evaluating;

  const handleSubmit = () => {
    stopSpeech();
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

        <h1 className="question-text">{displayedQuestion}</h1>

        <div className="interview-question-tools">
          {canSpeak && (
            <button type="button" className="btn btn-secondary" onClick={() => speaking ? stopSpeech() : speak(displayedQuestion)}>
              {speaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
              {speaking ? (lang === "he" ? "עצירת ההשמעה" : "Stop audio") : (lang === "he" ? "השמיעו שאלה" : "Listen to question")}
            </button>
          )}
          {canSpeak && <span className="voice-unsupported">{lang === "he" ? "הקול נוצר באמצעות AI; אם אינו זמין יושמע קול המכשיר." : "AI-generated voice; device voice is used if unavailable."}</span>}
          <button type="button" className="btn btn-secondary" onClick={clarifyQuestion}
            disabled={clarifying || clarificationUsed >= 2}>
            {clarifying ? <Loader2 size={16} className="spin" /> : <MessageCircleQuestion size={16} />}
            {clarifying ? (lang === "he" ? "מנסח מחדש..." : "Rephrasing...") : (lang === "he" ? "לא הבנתי — הסבירו שוב" : "Please rephrase")}
          </button>
        </div>
        {clarification && (
          <div className="interview-clarification" role="status">
            <p><strong>{lang === "he" ? "ניסוח נוסף של השאלה:" : "Question rephrased:"}</strong> {clarification}</p>
            <button type="button" className="btn btn-secondary" onClick={() => speaking ? stopSpeech() : speak(clarification)}>
              <Volume2 size={16} aria-hidden="true" />
              {lang === "he" ? "השמיעו את הניסוח החדש" : "Listen to rephrased question"}
            </button>
          </div>
        )}
        {clarificationError && <p className="interview-clarification-notice" role="status">{clarificationError}</p>}
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
