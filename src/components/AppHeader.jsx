import { ArrowLeft, ArrowRight, ChevronDown, Globe, Menu, LogIn, LogOut } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { useAuth } from "../hooks/useAuth";
import BrandMark from "./BrandMark";
import "../styles/AppHeader.css";

export default function AppHeader({ showBack, onBack, onLogoClick, onMenuToggle, onSignIn }) {
  const { t, lang, setLang, isRTL } = useLanguage();
  const { user, signOut, configured } = useAuth();
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  // Email prefix for display — "alice" from "alice@example.com"
  const emailPrefix = user?.email
    ? user.email.slice(0, user.email.indexOf("@"))
    : null;
  const avatarLetter = user?.email ? user.email[0].toUpperCase() : "?";

  return (
    <header className="app-header">
      <div className="app-header-inner container">
        <div className="app-header-start">
          <button
            type="button"
            className="menu-btn"
            onClick={onMenuToggle}
            aria-label={t("menuLabel")}
          >
            <Menu size={20} aria-hidden="true" />
          </button>
          {showBack && (
            <button type="button" className="btn btn-ghost header-back" onClick={onBack}>
              <BackIcon size={18} aria-hidden="true" />
              <span>{t("back")}</span>
            </button>
          )}

          <button
            type="button"
            className="app-logo"
            onClick={onLogoClick}
            aria-label={t("appName")}
          >
            <span className="app-logo-mark">
              <BrandMark size={40} />
            </span>
            <span className="app-logo-text">
              <span className="app-logo-name">{t("appName")}</span>
              <span className="app-logo-tagline">{t("brandTagline")}</span>
            </span>
          </button>
        </div>

        <div className="app-header-end">
          {/* Language toggle */}
          <button
            type="button"
            className="lang-toggle"
            onClick={() => setLang(lang === "en" ? "he" : "en")}
            aria-label={t("langToggle")}
          >
            <Globe size={14} aria-hidden="true" />
            <span>{t("langToggle")}</span>
            <ChevronDown size={12} aria-hidden="true" className="lang-chevron" />
          </button>

          {/* Auth control */}
          {configured && (
            user ? (
              <div className="header-user-group">
                {/* Unified badge: avatar + name + chevron */}
                <div className="header-user-badge" title={user.email}>
                  <span className="header-avatar" aria-hidden="true">{avatarLetter}</span>
                  {emailPrefix && (
                    <span className="header-user-name">{emailPrefix}</span>
                  )}
                  <ChevronDown size={13} aria-hidden="true" className="header-badge-chevron" />
                </div>
                <button
                  type="button"
                  className="btn btn-ghost header-signout-btn"
                  onClick={signOut}
                  aria-label={t("signOut")}
                  title={t("signOut")}
                >
                  <LogOut size={15} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-ghost header-auth-btn header-signin"
                onClick={onSignIn}
              >
                <LogIn size={15} aria-hidden="true" />
                <span>{t("signIn")}</span>
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
