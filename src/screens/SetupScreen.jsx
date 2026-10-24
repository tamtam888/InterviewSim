import { useState } from "react";
import { ArrowRight, ArrowLeft, Target, Loader2 } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { getRole, INTERVIEW_TYPES, SESSION_LENGTHS, EXPERIENCE_LEVELS, DIFFICULTIES } from "../data/roles";
import { INTERVIEWERS } from "../data/interviewers";
import RoleIcon from "../components/RoleIcon";
import "../styles/SetupScreen.css";

export default function SetupScreen({ roleId, onStart, matchContext }) {
  const { t, lang, isRTL } = useLanguage();
  const role = getRole(roleId);
  const [type, setType] = useState("mixed");
  const [lengthId, setLengthId] = useState("standard");
  const [experienceLevel, setExperienceLevel] = useState("junior");
  const [difficulty, setDifficulty] = useState("mixed");
  const [interviewerId, setInterviewerId] = useState("sarah");
  const [starting, setStarting] = useState(false);
  const StartArrow = isRTL ? ArrowLeft : ArrowRight;

  // Tailored mode: simplified setup when launched from a Job Match result.
  // Hides interview type, experience level, difficulty, and interviewer sections.
  const isTailored = !!matchContext;

  // In tailored mode, use fixed defaults for hidden fields:
  //   type -> "technical" (all questions target focus areas, which are always technical)
  //   experienceLevel, difficulty, interviewerId -> keep state defaults (junior/mixed/sarah)
  const effectiveType = isTailored ? "technical" : type;

  const selectedLength = SESSION_LENGTHS.find((l) => l.id === lengthId);
  const selectedType    = INTERVIEW_TYPES.find((it) => it.id === type);
  const selectedLevel   = EXPERIENCE_LEVELS.find((l) => l.id === experienceLevel);
  const selectedDiff    = DIFFICULTIES.find((d) => d.id === difficulty);
  const selectedIvr     = INTERVIEWERS.find((i) => i.id === interviewerId);

  return (
    <main className="screen container setup">
      <header className="screen-head">
        <div className="step-indicator">
          {t("stepLabel2of2")}
          <span className="step-indicator-dot">
            <span className="step-dot is-done" />
            <span className="step-dot is-active" />
          </span>
        </div>
        <h1 className="setup-title">{t("setupTitle")}</h1>
        {role && (
          <span className="setup-role-tag">
            <RoleIcon name={role.icon} size={13} />
            {role.name[lang]}
          </span>
        )}
      </header>

      {/* Tailored interview banner — always shown in tailored mode */}
      {matchContext && (
        <div className="setup-match-banner">
          <Target size={15} aria-hidden="true" />
          <div className="setup-match-banner-body">
            <span>{t("setupTailoredBanner").replace("{score}", matchContext.matchScore ?? "")}</span>
            {(() => {
              const chips = [
                ...(matchContext.gaps ?? []),
                ...(matchContext.recommendedTopics ?? []),
              ].slice(0, 8);
              return chips.length > 0 ? (
                <div className="setup-match-chips">
                  {chips.map((chip, i) => (
                    <span key={i} className="setup-match-chip">{chip}</span>
                  ))}
                </div>
              ) : null;
            })()}
          </div>
        </div>
      )}

      {/* 01 — Interview type (regular mode only) */}
      {!isTailored && (
        <section className="setup-section">
          <h2 className="setup-section-title">
            <span className="setup-section-num">01</span>
            {t("interviewType")}
          </h2>
          <div className="segmented" role="radiogroup" aria-label={t("interviewType")}>
            {INTERVIEW_TYPES.map((it) => (
              <button
                type="button"
                key={it.id}
                role="radio"
                aria-checked={type === it.id}
                className={`segmented-option ${type === it.id ? "is-selected" : ""}`}
                onClick={() => setType(it.id)}
              >
                <span>{t(it.labelKey)}</span>
                <span className="segmented-option-desc">{t(it.descKey)}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 02 / tailored 01 — Session length (always shown) */}
      <section className="setup-section">
        <h2 className="setup-section-title">
          <span className="setup-section-num">{isTailored ? "01" : "02"}</span>
          {t("sessionLength")}
        </h2>
        <div className="segmented" role="radiogroup" aria-label={t("sessionLength")}>
          {SESSION_LENGTHS.map((len) => (
            <button
              type="button"
              key={len.id}
              role="radio"
              aria-checked={lengthId === len.id}
              className={`segmented-option ${lengthId === len.id ? "is-selected" : ""}`}
              onClick={() => setLengthId(len.id)}
            >
              <span>{len.count} {t("questionsUnit")}</span>
              <span className="segmented-option-desc">{t(len.labelKey)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 03 — Experience level (regular mode only) */}
      {!isTailored && (
        <section className="setup-section">
          <h2 className="setup-section-title">
            <span className="setup-section-num">03</span>
            {t("setupExperienceLevel")}
          </h2>
          <div className="segmented" role="radiogroup" aria-label={t("setupExperienceLevel")}>
            {EXPERIENCE_LEVELS.map((lvl) => (
              <button
                type="button"
                key={lvl.id}
                role="radio"
                aria-checked={experienceLevel === lvl.id}
                className={`segmented-option ${experienceLevel === lvl.id ? "is-selected" : ""}`}
                onClick={() => setExperienceLevel(lvl.id)}
              >
                <span>{t(lvl.labelKey)}</span>
                <span className="segmented-option-desc">{t(lvl.descKey)}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 04 — Difficulty (regular mode only) */}
      {!isTailored && (
        <section className="setup-section">
          <h2 className="setup-section-title">
            <span className="setup-section-num">04</span>
            {t("setupDifficulty")}
          </h2>
          <div className="segmented" role="radiogroup" aria-label={t("setupDifficulty")}>
            {DIFFICULTIES.map((diff) => (
              <button
                type="button"
                key={diff.id}
                role="radio"
                aria-checked={difficulty === diff.id}
                className={`segmented-option ${difficulty === diff.id ? "is-selected" : ""}`}
                onClick={() => setDifficulty(diff.id)}
              >
                <span>{t(diff.labelKey)}</span>
                <span className="segmented-option-desc">{t(diff.descKey)}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 05 — Interviewer persona (regular mode only) */}
      {!isTailored && (
        <section className="setup-section">
          <h2 className="setup-section-title">
            <span className="setup-section-num">05</span>
            {t("chooseInterviewer")}
          </h2>
          <p className="setup-section-note">{t("interviewerNote")}</p>
          <div className="interviewer-grid" role="radiogroup" aria-label={t("chooseInterviewer")}>
            {INTERVIEWERS.map((person) => (
              <button
                type="button"
                key={person.id}
                role="radio"
                aria-checked={interviewerId === person.id}
                className={`interviewer-card accent-${person.accent} ${
                  interviewerId === person.id ? "is-selected" : ""
                }`}
                onClick={() => setInterviewerId(person.id)}
              >
                <span className="interviewer-card-head">
                  <span className="interviewer-avatar" aria-hidden="true">
                    <img src={person.portrait} alt="" className="interviewer-photo" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                    <span className="interviewer-avatar-fallback">{person.initial[lang]}</span>
                  </span>
                  <span className="interviewer-card-identity">
                    <span className="interviewer-name">{person.name[lang]}</span>
                    <span className="interviewer-title-line">{person.title[lang]}</span>
                  </span>
                </span>
                <span className="interviewer-style">{person.style[lang]}</span>
                <span className="interviewer-focus">{person.focus[lang]}</span>
                <span className="interviewer-vibe">{t(person.vibeKey)}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="setup-actions">
        <div className="setup-summary-bar">
          <span className="setup-summary-line">
            {isTailored ? (
              `${selectedLength.count} ${t("questionsUnit")} · ${t("typeTechnical")}`
            ) : (
              <>
                {selectedLength.count} {t("questionsUnit")} &middot;{" "}
                {t(selectedType.labelKey)} &middot;{" "}
                {t(selectedLevel.labelKey)} &middot;{" "}
                {t(selectedDiff.labelKey)} &middot;{" "}
                {selectedIvr.name[lang]}
              </>
            )}
          </span>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            disabled={starting}
            onClick={async () => {
              setStarting(true);
              await onStart({
                interviewType: effectiveType,
                questionCount: selectedLength.count,
                interviewerId,
                experienceLevel,
                difficulty,
              });
              setStarting(false);
            }}
          >
            {starting ? (
              <>
                <Loader2 size={20} className="spin" aria-hidden="true" />
                {t("setupGenerating")}
              </>
            ) : (
              <>
                {t("startInterview")}
                <StartArrow size={20} aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
