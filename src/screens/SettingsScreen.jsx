import { useState } from "react";
import { Trash2, Check } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { clearPracticeHistory } from "../utils/practiceHistory";
import { clearRecentQuestions } from "../data/questions";
import "../styles/SettingsScreen.css";

export default function SettingsScreen() {
  const { t, lang, setLang } = useLanguage();
  const [clearStep, setClearStep] = useState(0); // 0 idle, 1 confirm, 2 done

  const handleClear = () => {
    if (clearStep === 0) {
      setClearStep(1);
      return;
    }
    clearPracticeHistory();
    clearRecentQuestions();
    setClearStep(2);
  };

  return (
    <main className="screen container settings-page">
      <header className="screen-head">
        <h1 className="section-title">{t("settingsTitle")}</h1>
      </header>

      <section className="card settings-section">
        <h2 className="dash-card-title">{t("settingsLanguage")}</h2>
        <div className="segmented settings-lang" role="radiogroup" aria-label={t("settingsLanguage")}>
          <button
            type="button"
            role="radio"
            aria-checked={lang === "en"}
            className={`segmented-option ${lang === "en" ? "is-selected" : ""}`}
            onClick={() => setLang("en")}
          >
            English
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={lang === "he"}
            className={`segmented-option ${lang === "he" ? "is-selected" : ""}`}
            onClick={() => setLang("he")}
          >
            עברית
          </button>
        </div>
      </section>

      <section className="card settings-section">
        <h2 className="dash-card-title">{t("settingsData")}</h2>
        <p className="settings-note">{t("settingsDataNote")}</p>
        {clearStep === 2 ? (
          <p className="settings-cleared">
            <Check size={15} aria-hidden="true" /> {t("clearedNote")}
          </p>
        ) : (
          <button
            type="button"
            className={`btn btn-secondary settings-clear ${clearStep === 1 ? "is-confirm" : ""}`}
            onClick={handleClear}
          >
            <Trash2 size={16} aria-hidden="true" />
            {clearStep === 1 ? t("clearConfirm") : t("clearHistory")}
          </button>
        )}
      </section>
    </main>
  );
}
