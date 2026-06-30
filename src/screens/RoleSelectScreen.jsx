import { Target } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { ROLES } from "../data/roles";
import { questionCountForRole } from "../data/questions";
import RoleIcon from "../components/RoleIcon";
import "../styles/RoleSelectScreen.css";
import "../styles/SetupScreen.css";

export default function RoleSelectScreen({ onSelect, matchContext }) {
  const { t, lang } = useLanguage();

  return (
    <main className="screen container role-select">
      <header className="screen-head">
        <div className="step-indicator">
          {t("stepLabel1of2")}
          <span className="step-indicator-dot">
            <span className="step-dot is-active" />
            <span className="step-dot" />
          </span>
        </div>
        <h1 className="role-select-title">{t("chooseRoleTitle")}</h1>
        <p className="screen-subtitle">{t("chooseRoleSubtitle")}</p>
      </header>

      {matchContext && (
        <div className="setup-match-banner">
          <Target size={15} aria-hidden="true" />
          <span>
            {t("setupTailoredBanner").replace("{score}", matchContext.matchScore ?? "")}
          </span>
        </div>
      )}

      <div className="role-grid">
        {ROLES.map((role) => (
          <button
            type="button"
            key={role.id}
            className={`role-card fade-up`}
            onClick={() => onSelect(role.id)}
          >
            <span className="role-card-head">
              <span className="role-card-icon" aria-hidden="true">
                <RoleIcon name={role.icon} size={18} />
              </span>
              <span className="role-card-titles">
                <span className="role-card-name">{role.name[lang]}</span>
                <span className="role-card-category">
                  {role.category[lang]} · {role.level[lang]}
                </span>
                     </span>
            </span>
            <span className="role-card-tagline">{role.tagline[lang]}</span>
            <span className="role-card-meta">
              {questionCountForRole(role.id)} {t("questionsInBank")} ·{" "}
              {t("perSessionEstimate")}
            </span>
          </button>
        ))}
      </div>
    </main>
  );
}
