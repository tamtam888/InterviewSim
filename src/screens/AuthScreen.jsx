import { useState } from "react";
import { Eye, EyeOff, ArrowRight, CheckCircle2, X } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { useAuth } from "../hooks/useAuth";
import BrandMark from "../components/BrandMark";
import "../styles/AuthScreen.css";

/**
 * Modes:
 *   login          — email + password sign-in
 *   signup         — email + password registration
 *   forgot         — send password-reset email
 *   update-password — set new password after clicking reset link
 */
export default function AuthScreen({ onClose }) {
  const { t, isRTL } = useLanguage();
  const { signIn, signUp, resetPassword, updatePassword, resetMode } = useAuth();

  const [mode, setMode]               = useState(resetMode ? "update-password" : "login");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus]           = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg]       = useState("");

  // If a password-reset link was clicked, override local mode.
  // Derived here instead of setState-in-effect to satisfy lint.
  const effectiveMode = resetMode ? "update-password" : mode;

  const switchTo = (nextMode) => {
    setMode(nextMode);
    setStatus("idle");
    setErrorMsg("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorMsg("");

    let result;

    if (effectiveMode === "login") {
      result = await signIn(email.trim(), password);
      if (!result?.error) { onClose(); return; }

    } else if (effectiveMode === "signup") {
      result = await signUp(email.trim(), password);
      if (!result?.error) { setStatus("success"); return; }

    } else if (effectiveMode === "forgot") {
      result = await resetPassword(email.trim());
      if (!result?.error) { setStatus("success"); return; }

    } else if (effectiveMode === "update-password") {
      result = await updatePassword(password);
      if (!result?.error) { onClose(); return; }
    }

    setErrorMsg(result?.error?.message ?? t("signInError"));
    setStatus("error");
  };

  const arrowStyle = isRTL ? { transform: "scaleX(-1)" } : {};
  const showEmail    = effectiveMode !== "update-password";
  const showPass     = effectiveMode !== "forgot";
  const isSubmitting = status === "submitting";
  const canSubmit    = !isSubmitting
    && (showEmail ? email.trim().length > 0 : true)
    && (showPass  ? password.length > 0 : true);

  // ── Success screens ────────────────────────────────────────────────────────
  if (status === "success") {
    const [title, body] =
      effectiveMode === "signup"
        ? [t("authSignUpSentTitle"), t("authSignUpSentBody").replace("{email}", email)]
        : [t("authForgotSentTitle"), t("authForgotSentBody").replace("{email}", email)];

    return (
      <Overlay onClose={onClose} label={title}>
        <button type="button" className="auth-close btn btn-ghost" onClick={onClose} aria-label={t("closeLabel")}>
          <X size={18} aria-hidden="true" />
        </button>
        <div className="auth-sent fade-up">
          <CheckCircle2 size={40} className="auth-sent-icon" aria-hidden="true" />
          <h2 className="auth-title">{title}</h2>
          <p className="auth-body">{body}</p>
          <button type="button" className="btn btn-ghost auth-guest-link" onClick={onClose}>
            {t("signInGuestLink")}
          </button>
        </div>
      </Overlay>
    );
  }

  // ── Titles / subtitles ─────────────────────────────────────────────────────
  const title =
    effectiveMode === "login"           ? t("authLoginTitle") :
    effectiveMode === "signup"          ? t("authSignUpTitle") :
    effectiveMode === "forgot"          ? t("authForgotTitle") :
    /* update-password */        t("authUpdatePasswordTitle");

  const subtitle =
    effectiveMode === "login"           ? t("authLoginSubtitle") :
    effectiveMode === "signup"          ? t("authSignUpSubtitle") :
    effectiveMode === "forgot"          ? t("authForgotSubtitle") :
    /* update-password */        t("authUpdatePasswordSubtitle");

  const btnLabel =
    effectiveMode === "login"           ? t("authLoginBtn") :
    effectiveMode === "signup"          ? t("authSignUpBtn") :
    effectiveMode === "forgot"          ? t("authForgotBtn") :
    /* update-password */        t("authUpdatePasswordBtn");

  // ── Main form ──────────────────────────────────────────────────────────────
  return (
    <Overlay onClose={onClose} label={title}>
      <button type="button" className="auth-close btn btn-ghost" onClick={onClose} aria-label={t("closeLabel")}>
        <X size={18} aria-hidden="true" />
      </button>

      <div className="auth-brand"><BrandMark size={36} /></div>
      <h2 className="auth-title">{title}</h2>
      <p className="auth-body">{subtitle}</p>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>

        {showEmail && (
          <div className="auth-field">
            <label className="auth-label" htmlFor="auth-email">{t("signInEmailLabel")}</label>
            <input
              id="auth-email"
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("signInEmailPlaceholder")}
              autoComplete="email"
              autoFocus
              required
              dir="ltr"
            />
          </div>
        )}

        {showPass && (
          <div className="auth-field">
            <label className="auth-label" htmlFor="auth-password">{t("authPasswordLabel")}</label>
            <div className="auth-password-wrap">
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  effectiveMode === "update-password"
                    ? t("authNewPasswordPlaceholder")
                    : t("authPasswordPlaceholder")
                }
                autoComplete={
                  effectiveMode === "signup" || effectiveMode === "update-password"
                    ? "new-password"
                    : "current-password"
                }
                autoFocus={!showEmail}
                required
                dir="ltr"
              />
              <button
                type="button"
                className="auth-password-toggle btn btn-ghost"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? t("authHidePassword") : t("authShowPassword")}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        )}

        {effectiveMode === "login" && (
          <button
            type="button"
            className="auth-forgot-link"
            onClick={() => switchTo("forgot")}
          >
            {t("authForgotLink")}
          </button>
        )}

        {status === "error" && (
          <p className="auth-error" role="alert">{errorMsg}</p>
        )}

        <button
          type="submit"
          className="btn btn-primary auth-submit"
          disabled={!canSubmit}
        >
          {isSubmitting ? t("authSubmitting") : btnLabel}
          {!isSubmitting && <ArrowRight size={16} style={arrowStyle} aria-hidden="true" />}
        </button>
      </form>

      {effectiveMode === "login" && (
        <p className="auth-switch">
          {t("authNoAccount")}{" "}
          <button type="button" className="auth-switch-btn" onClick={() => switchTo("signup")}>
            {t("authSignUpBtn")}
          </button>
        </p>
      )}

      {effectiveMode === "signup" && (
        <p className="auth-switch">
          {t("authHaveAccount")}{" "}
          <button type="button" className="auth-switch-btn" onClick={() => switchTo("login")}>
            {t("authLoginBtn")}
          </button>
        </p>
      )}

      {effectiveMode === "forgot" && (
        <button type="button" className="auth-switch-btn" onClick={() => switchTo("login")}>
          {t("authBackToLogin")}
        </button>
      )}

      {effectiveMode !== "update-password" && (
        <button type="button" className="btn btn-ghost auth-guest-link" onClick={onClose}>
          {t("signInGuestLink")}
        </button>
      )}
    </Overlay>
  );
}

function Overlay({ onClose, label, children }) {
  return (
    <div className="auth-overlay" role="dialog" aria-modal="true" aria-label={label}>
      <div className="auth-backdrop" onClick={onClose} />
      <div className="auth-card card">{children}</div>
    </div>
  );
}
