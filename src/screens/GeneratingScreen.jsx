import { Loader2 } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import "../styles/GeneratingScreen.css";

/**
 * Full-page loading screen shown while /api/generate-questions runs.
 * Replaces SetupScreen immediately after the user clicks Start Interview.
 *
 * Props:
 *   isTailored  — true  → tailored copy (job match gaps)
 *                 false → regular copy
 *   failed      — true  → show error state with retry button
 *   onRetry     — called when user clicks "Try again"
 */
export default function GeneratingScreen({ isTailored, failed, onRetry }) {
  const { t } = useLanguage();

  if (failed) {
    return (
      <main className="screen container generating-screen">
        <div className="generating-card">
          <p className="generating-error-icon" aria-hidden="true">!</p>
          <h1 className="generating-title">{t("generatingErrorTitle")}</h1>
          <p className="generating-body">{t("generatingErrorBody")}</p>
          <button type="button" className="btn btn-primary" onClick={onRetry}>
            {t("generatingRetryBtn")}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="screen container generating-screen">
      <div className="generating-card">
        <Loader2 size={48} className="generating-spinner spin" aria-hidden="true" />
        <h1 className="generating-title">
          {isTailored ? t("generatingTailoredTitle") : t("generatingRegularTitle")}
        </h1>
        <p className="generating-body">
          {isTailored ? t("generatingTailoredBody") : t("generatingRegularBody")}
        </p>
        <p className="generating-note">{t("generatingNote")}</p>
      </div>
    </main>
  );
}
