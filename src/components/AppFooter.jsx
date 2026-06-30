import { Heart } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import BrandMark from "./BrandMark";
import "../styles/AppFooter.css";

export default function AppFooter() {
  const { t } = useLanguage();

  return (
    <footer className="app-footer">
      <div className="app-footer-inner container">
        <div className="app-footer-brand">
          <span className="app-footer-mark">
            <BrandMark size={36} />
          </span>
          <span className="app-footer-name">{t("appName")}</span>
          <Heart size={13} className="app-footer-heart" aria-hidden="true" />
        </div>
        <p className="app-footer-tagline">{t("footerTagline")}</p>
        <p className="app-footer-rights" dir="ltr">{t("footerRights")}</p>
      </div>
    </footer>
  );
}
