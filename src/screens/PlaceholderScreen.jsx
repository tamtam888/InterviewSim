import { FileText, Briefcase } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import "../styles/PlaceholderScreen.css";

const META = {
  resume: { icon: FileText, titleKey: "navResume", textKey: "resumeSoonText" },
  jobMatch: { icon: Briefcase, titleKey: "navJobMatch", textKey: "jobMatchSoonText" },
};

export default function PlaceholderScreen({ kind, onBack }) {
  const { t } = useLanguage();
  const meta = META[kind] ?? META.resume;
  const Icon = meta.icon;

  return (
    <main className="screen container placeholder-page">
      <div className="card placeholder-card">
        <span className="placeholder-icon" aria-hidden="true">
          <Icon size={26} />
        </span>
        <span className="pill">{t("comingSoonTitle")}</span>
        <h1 className="placeholder-title">{t(meta.titleKey)}</h1>
        <p className="placeholder-text">{t(meta.textKey)}</p>
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          {t("backToDashboard")}
        </button>
      </div>
    </main>
  );
}
