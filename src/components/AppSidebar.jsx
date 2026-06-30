import {
  LayoutDashboard,
  PlayCircle,
  Library,
  TrendingUp,
  FileText,
  Briefcase,
  Settings,
  X,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { useAuth } from "../hooks/useAuth";
import "../styles/AppSidebar.css";

const NAV_ITEMS = [
  { id: "dashboard",    icon: LayoutDashboard, labelKey: "navDashboard" },
  { id: "practice",    icon: PlayCircle,       labelKey: "startNewInterview" },
  { id: "questionBank", icon: Library,         labelKey: "navQuestionBank" },
  { id: "progress",    icon: TrendingUp,       labelKey: "navProgress" },
  { id: "resume",      icon: FileText,         labelKey: "navResume" },
  { id: "jobMatch",    icon: Briefcase,        labelKey: "navJobMatch" },
];

const BOTTOM_ITEMS = [
  { id: "settings", icon: Settings, labelKey: "navSettings" },
];

function NavItem({ item, active, t, onNavigate }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      className={`drawer-item ${active ? "is-active" : ""}`}
      aria-current={active ? "page" : undefined}
      onClick={() => onNavigate(item.id)}
    >
      <Icon size={18} aria-hidden="true" />
      <span className="drawer-item-label">{t(item.labelKey)}</span>
    </button>
  );
}

export default function AppSidebar({ currentPage, onNavigate, open, onClose, onSignIn }) {
  const { t } = useLanguage();
  const { user, signOut, configured } = useAuth();

  const handleNavigate = (id) => {
    onNavigate(id);
    onClose();
  };

  return (
    <>
      {/* Backdrop — closes drawer when clicked */}
      {open && (
        <div
          className="drawer-backdrop"
          role="presentation"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      {/* Drawer panel */}
      <aside
        className={`nav-drawer ${open ? "is-open" : ""}`}
        aria-label={t("menuLabel")}
        aria-hidden={!open}
      >
        {/* Drawer header */}
        <div className="drawer-header">
          <span className="drawer-brand">{t("appName")}</span>
          <button
            type="button"
            className="drawer-close"
            onClick={onClose}
            aria-label={t("back")}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Main navigation */}
        <nav className="drawer-nav">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              active={currentPage === item.id}
              t={t}
              onNavigate={handleNavigate}
            />
          ))}
        </nav>

        {/* Bottom-pinned: settings + auth */}
        <div className="drawer-bottom">
          <div className="drawer-divider" aria-hidden="true" />

          {BOTTOM_ITEMS.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              active={currentPage === item.id}
              t={t}
              onNavigate={handleNavigate}
            />
          ))}

          {configured && (
            <>
              <div className="drawer-divider" aria-hidden="true" />
              {user ? (
                <div className="drawer-auth-strip">
                  <span className="drawer-auth-email" title={user.email}>
                    <User size={13} aria-hidden="true" />
                    {user.email}
                  </span>
                  <button
                    type="button"
                    className="drawer-item drawer-signout"
                    onClick={() => { signOut(); onClose(); }}
                    aria-label={t("signOut")}
                  >
                    <LogOut size={18} aria-hidden="true" />
                    <span className="drawer-item-label">{t("signOut")}</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="drawer-item drawer-signin"
                  onClick={() => { onSignIn(); onClose(); }}
                  aria-label={t("signIn")}
                >
                  <LogIn size={18} aria-hidden="true" />
                  <span className="drawer-item-label">{t("signInToSave")}</span>
                </button>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
}
