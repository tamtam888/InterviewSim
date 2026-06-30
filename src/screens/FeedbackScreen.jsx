import { ArrowRight, ArrowLeft, CheckCircle2, TrendingUp, Sparkles, Lightbulb, Cpu, MessageCircleQuestion } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { scoreLevelKey } from "../utils/scoreLevel";
import ScoreRing from "../components/ScoreRing";
import "../styles/FeedbackScreen.css";

export default function FeedbackScreen({ result, isLast, onNext, onPracticeFollowUp }) {
  const { t, lang, isRTL } = useLanguage();
  const NextArrow = isRTL ? ArrowLeft : ArrowRight;

  if (!result) return null;
  const { question, answer, feedback } = result;
  const isAI = feedback.source === "ai";
  // Don't offer a follow-up for a question that is itself a follow-up — prevents loops.
  const isFollowUpQuestion = question?.id?.startsWith("followup-");
  const hasFollowUp = !isFollowUpQuestion && feedback.shouldAskFollowUp && feedback.followUpQuestion;

  return (
    <main className="screen container feedback">
      <header className="screen-head">
        <div className="feedback-source-bar">
          <span className={`feedback-source-badge ${isAI ? "badge-ai" : "badge-local"}`}>
            <Cpu size={12} aria-hidden="true" />
            {t(isAI ? "aiFeedbackBadge" : "localFeedbackBadge")}
          </span>
          {feedback.aiUnavailable && (
            <span className="ai-fallback-note">{t("aiFallbackNote")}</span>
          )}
        </div>
        <h1 className="section-title">{t("feedbackTitle")}</h1>
        <p className="feedback-question-ref">{question.text[lang]}</p>
      </header>

      {/* Top row: score + your answer */}
      <section className="feedback-top">
        <div className="card score-card fade-up">
          <ScoreRing score={feedback.score} label={t("scoreLabel")} />
          <span className="score-level">{t(scoreLevelKey(feedback.score))}</span>
        </div>

        <div className="card your-answer-card fade-up">
          <h2 className="feedback-block-title">{t("yourAnswer")}</h2>
          <p className="your-answer-text">
            {feedback.skipped ? <em>{t("skippedAnswer")}</em> : answer}
          </p>
        </div>
      </section>

      {/* Strengths + Improvements */}
      <div className="feedback-si-grid">
        {feedback.strengths?.length > 0 && (
          <section className="card feedback-block block-strengths fade-up">
            <h2 className="feedback-block-title">
              <CheckCircle2 size={14} aria-hidden="true" />
              {t("strengths")}
            </h2>
            <ul className="feedback-list">
              {feedback.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
        )}

        {feedback.improvements?.length > 0 && (
          <section className="card feedback-block block-improvements fade-up">
            <h2 className="feedback-block-title">
              <TrendingUp size={14} aria-hidden="true" />
              {t("improvements")}
            </h2>
            <ul className="feedback-list">
              {feedback.improvements.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Coaching: suggested answer + tip */}
      <section className="card feedback-block block-coaching fade-up">
        <div className="coaching-block">
          <h2 className="feedback-block-title">
            <Sparkles size={14} aria-hidden="true" />
            {t("suggestedAnswer")}
          </h2>
          <p className="model-answer">{feedback.suggestedAnswer ?? question.model[lang]}</p>
        </div>
        {feedback.nextPracticeTip && (
          <div className="coaching-block coaching-tip">
            <h2 className="feedback-block-title">
              <Lightbulb size={14} aria-hidden="true" />
              {t("nextPracticeTip")}
            </h2>
            <p className="model-answer">{feedback.nextPracticeTip}</p>
          </div>
        )}
      </section>

      {/* Adaptive follow-up coaching */}
      {hasFollowUp && (
        <section className="card follow-up-card fade-up">
          <div className="follow-up-head">
            <span className="follow-up-badge">
              <MessageCircleQuestion size={13} aria-hidden="true" />
              {t("followUpBadge")}
            </span>
            {feedback.followUpReason && (
              <p className="follow-up-reason">{feedback.followUpReason}</p>
            )}
          </div>
          <p className="follow-up-question">{feedback.followUpQuestion}</p>
          <button
            type="button"
            className="btn btn-secondary follow-up-btn"
            onClick={() => onPracticeFollowUp?.({
              id: `followup-${Date.now()}`,
              type: question.type,
              text: { en: feedback.followUpQuestion, he: feedback.followUpQuestion },
              tip: { en: "", he: "" },
              model: question.model,
            })}
          >
            {t("practiceThisAngle")}
            <NextArrow size={16} aria-hidden="true" />
          </button>
        </section>
      )}

      <div className="feedback-actions">
        <button type="button" className="btn btn-primary btn-lg" onClick={onNext}>
          {isLast ? t("seeSummary") : t("nextQuestion")}
          <NextArrow size={20} aria-hidden="true" />
        </button>
      </div>
    </main>
  );
}
