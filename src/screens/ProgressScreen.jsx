import { useEffect, useMemo, useState } from "react";
import {
  Flame, CalendarCheck, Gauge, MessageSquareText,
  ChevronDown, ChevronUp,
} from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { useAuth } from "../hooks/useAuth";
import { getRole } from "../data/roles";
import { getHistory, computeDashboard } from "../utils/practiceHistory";
import { fetchSessions, rowToHistoryEntry } from "../lib/sessionHistory";
import { scoreLevelKey } from "../utils/scoreLevel";
import RoleIcon from "../components/RoleIcon";
import "../styles/ProgressScreen.css";

const TYPE_LABEL_KEYS = {
  technical:  "typeTechnical",
  hr:         "typeHr",
  behavioral: "typeBehavioral",
  mixed:      "typeMixed",
};

const TYPE_BADGE_CLASSES = {
  technical:  "ds-badge--technical",
  hr:         "ds-badge--hr",
  behavioral: "ds-badge--behavioral",
  mixed:      "ds-badge--mixed",
};
function typeBadgeClass(type) { return TYPE_BADGE_CLASSES[type] ?? "ds-badge--mixed"; }

const FILTER_TYPES = ["technical", "behavioral", "hr", "mixed"];

function formatDay(ts, lang) {
  return new Date(ts).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function bucket(score) {
  return Math.max(1, Math.min(10, Math.round((score ?? 0) / 10)));
}

/* ── Mini category trend chart ──────────────────────────────────────────── */

function CategoryTrendChart({ points, lang, t, sessionCount }) {
  const n = points.length;

  if (n < 2) {
    // "No sessions of this type yet" only when there truly are no sessions.
    // When sessions exist but lack perType scores (n===0, sessionCount>0),
    // or there is only 1 scored session (n===1), show the "need more" copy.
    const emptyKey =
      n === 0 && sessionCount === 0 ? "progCatEmptyNone" : "progCatEmptyFew";
    return (
      <div className="prog-trend-empty">
        <p>{t(emptyKey)}</p>
      </div>
    );
  }

  const rawMin  = Math.min(...points.map((p) => p.score));
  const rawMax  = Math.max(...points.map((p) => p.score));
  const yMin    = Math.max(0,   rawMin - 5);
  const yMax    = Math.min(100, rawMax + 5);
  const yRange  = yMax - yMin || 1;
  const svgY    = (score) => 10 + (1 - (score - yMin) / yRange) * 76;
  const svgX    = (i)     => 40 + (i / (n - 1)) * 540;
  const lastY   = svgY(points[n - 1].score);

  return (
    <div className="prog-trend-wrap">
      <svg
        className="prog-trend-svg"
        viewBox="0 0 620 112"
        width="100%"
        aria-hidden="true"
      >
        <polygon
          className="prog-trend-area"
          points={[
            `${svgX(0)},88`,
            ...points.map((p, i) => `${svgX(i)},${svgY(p.score)}`),
            `${svgX(n - 1)},88`,
          ].join(" ")}
        />
        <polyline
          className="prog-trend-line"
          points={points.map((p, i) => `${svgX(i)},${svgY(p.score)}`).join(" ")}
        />
        {points.map((p, i) => (
          <circle key={p.date} className="prog-trend-dot"
            cx={String(svgX(i))} cy={String(svgY(p.score))} r="3" />
        ))}
        <text className="prog-trend-score-label"
          x="600"
          y={String(lastY < 30 ? lastY + 16 : lastY - 10)}
          textAnchor="end">
          {points[n - 1].score}
        </text>
        <text className="prog-trend-date-label" x="40" y="108" textAnchor="start">
          {formatDay(points[0].date, lang)}
        </text>
        <text className="prog-trend-date-label" x="600" y="108" textAnchor="end">
          {formatDay(points[n - 1].date, lang)}
        </text>
      </svg>
    </div>
  );
}

/* ── Session detail accordion ───────────────────────────────────────────── */

function SessionRow({ s, lang, t }) {
  const [open, setOpen] = useState(false);
  const role = getRole(s.roleId);

  const hasRichData =
    Boolean(s.summaryText) ||
    (Array.isArray(s.recommendations) && s.recommendations.length > 0) ||
    Object.keys(s.perType ?? {}).length > 0;

  return (
    <li className="progress-session-row">
      <div className="progress-session-main">
        <span className="recent-icon" aria-hidden="true">
          {role && <RoleIcon name={role.icon} size={15} />}
        </span>
        <span className="recent-main">
          <span className="recent-role">{role?.name[lang]}</span>
          <span className="recent-detail">
            {t(TYPE_LABEL_KEYS[s.interviewType] ?? "typeMixed")} ·{" "}
            {formatDay(s.date, lang)} · {s.answered}{" "}
            {t("questionsAnswered").toLowerCase()}
          </span>
        </span>
        <span className={`recent-score score-b-${bucket(s.overall)}`}>
          {s.overall}
          <em className="progress-session-level">
            {t(scoreLevelKey(s.overall))}
          </em>
        </span>
        <button
          type="button"
          className="progress-session-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? t("sessionDetailClose") : t("sessionDetailView")}
        >
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>

      {open && (
        <div className="progress-session-detail">
          {hasRichData ? (
            <>
              {s.summaryText && (
                <div className="session-detail-block">
                  <h3 className="session-detail-block-title">
                    {t("sessionDetailSummary")}
                  </h3>
                  <p className="session-detail-text">{s.summaryText}</p>
                </div>
              )}

              {Array.isArray(s.recommendations) && s.recommendations.length > 0 && (
                <div className="session-detail-block">
                  <h3 className="session-detail-block-title">
                    {t("sessionDetailRecommendations")}
                  </h3>
                  <ul className="session-detail-list">
                    {s.recommendations.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {Object.keys(s.perType ?? {}).length > 0 && (
                <div className="session-detail-block">
                  <h3 className="session-detail-block-title">
                    {t("sessionDetailPerType")}
                  </h3>
                  <ul className="session-pertype-list">
                    {FILTER_TYPES.map((type) => {
                      const score = s.perType?.[type];
                      return (
                        <li key={type} className="session-pertype-row">
                          <span className="session-pertype-label">
                            {t(TYPE_LABEL_KEYS[type])}
                          </span>
                          <span className="session-pertype-score">
                            {score != null ? score : "—"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p className="session-detail-empty">{t("sessionDetailNoData")}</p>
          )}
        </div>
      )}
    </li>
  );
}

/* ── Main screen ────────────────────────────────────────────────────────── */

export default function ProgressScreen({ onStart }) {
  const { t, lang } = useLanguage();
  const { user, loading } = useAuth();
  const [history, setHistory] = useState(null); // null = loading
  const [filterType, setFilterType] = useState(null); // null = "All"

  useEffect(() => {
    // Wait for auth to resolve before choosing data source — mirrors HomeScreen
    // behaviour so we never flash localStorage counts for a signed-in user.
    if (loading) return;
    let cancelled = false;
    async function load() {
      if (user) {
        // Try Supabase direct client — gives us full rows (summaryText, recommendations)
        const rows = await fetchSessions(50);
        if (!cancelled) {
          if (rows !== null) {
            setHistory(rows.map(rowToHistoryEntry));
          } else {
            // Supabase unavailable — fall back to localStorage
            setHistory(getHistory());
          }
        }
      } else {
        if (!cancelled) setHistory(getHistory());
      }
    }
    load();
    return () => { cancelled = true; };
  }, [user, loading]);

  const dash = useMemo(
    () => (history !== null ? computeDashboard(history) : null),
    [history]
  );

  /* Sessions filtered by active type tab */
  const filteredHistory = useMemo(() => {
    if (!history || !filterType) return history ?? [];
    return history.filter((s) => s.interviewType === filterType);
  }, [history, filterType]);

  /* Trend points: sessions of the active type that have a perType score */
  const trendPoints = useMemo(() => {
    if (!history || !filterType) return [];
    return [...history]
      .filter((s) => s.interviewType === filterType && (s.perType?.[filterType] ?? null) !== null)
      .sort((a, b) => a.date - b.date)
      .map((s) => ({ date: s.date, score: s.perType[filterType] }));
  }, [history, filterType]);

  if (!dash) {
    return (
      <main className="screen container progress-page">
        <header className="screen-head">
          <h1 className="section-title">{t("progressPageTitle")}</h1>
        </header>
        <div className="progress-loading" aria-busy="true">
          <span className="progress-loading-dots" />
        </div>
      </main>
    );
  }

  return (
    <main className="screen container progress-page">
      <header className="screen-head">
        <h1 className="section-title">{t("progressPageTitle")}</h1>
        <p className="screen-subtitle">{t("progressPageSubtitle")}</p>
        {user && (
          <p className="progress-cloud-note">
            {t("signedInAs")} {user.email}
          </p>
        )}
      </header>

      {dash.sessions === 0 ? (
        <div className="card progress-empty">
          <p>{t("progressEmpty")}</p>
          <button type="button" className="btn btn-primary" onClick={onStart}>
            {t("firstRunCta")}
          </button>
        </div>
      ) : (
        <>
          <section className="progress-stats">
            {[
              { icon: Flame,             value: dash.streak,        label: t("statStreak") },
              { icon: CalendarCheck,     value: dash.sessions,      label: t("statSessions") },
              { icon: Gauge,             value: dash.avgOverall,    label: t("statAvgScore") },
              { icon: MessageSquareText, value: dash.totalAnswered, label: t("statAnswered") },
            ].map((stat) => {
              const StatIcon = stat.icon;
              return (
                <div key={stat.label} className="card progress-stat">
                  <StatIcon size={17} aria-hidden="true" />
                  <span className="progress-stat-value">{stat.value}</span>
                  <span className="progress-stat-label">{stat.label}</span>
                </div>
              );
            })}
          </section>

          <section className="card progress-skills">
            <h2 className="ds-section-label">{t("skillsTitle")}</h2>
            <div className="skills-grid">
              {Object.entries(dash.lifetimeTypeAverages)
                .sort((a, b) => b[1] - a[1])
                .map(([type, avg]) => {
                  const insight = (dash.categoryInsights ?? []).find((i) => i.type === type);
                  const trend   = insight?.trend;
                  const delta   = insight?.trendDelta;
                  const trendLabel =
                    trend === "improving" ? `↑ +${delta}` :
                    trend === "declining" ? `↓ ${delta}`  :
                    null; /* stable/stale omitted — not directionally actionable */
                  return (
                    <div key={type} className="skills-card">
                      <div className="skills-card-header">
                        <span className={`ds-badge ${typeBadgeClass(type)}`}>
                          {t(TYPE_LABEL_KEYS[type] ?? "typeMixed")}
                        </span>
                        {trendLabel && (
                          <span className={`sf-trend sf-trend-${trend}`}>
                            {trendLabel}
                          </span>
                        )}
                      </div>
                      <span className="skills-card-score">{avg}</span>
                      <div className="sf-cat-bar-track" aria-hidden="true">
                        <div
                          className={`sf-cat-bar-fill score-bar-b-${bucket(avg)}`}
                          style={{ width: `${avg}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>

          {/* ── Category filter tabs ── */}
          <div className="prog-filter-tabs" role="tablist">
            <button
              role="tab"
              type="button"
              aria-selected={!filterType}
              className={`prog-filter-tab${!filterType ? " prog-filter-tab--active" : ""}`}
              onClick={() => setFilterType(null)}
            >
              {t("progFilterAll")}
            </button>
            {FILTER_TYPES.map((type) => (
              <button
                key={type}
                role="tab"
                type="button"
                aria-selected={filterType === type}
                className={`prog-filter-tab${filterType === type ? " prog-filter-tab--active" : ""}`}
                onClick={() => setFilterType(type)}
              >
                {t(TYPE_LABEL_KEYS[type])}
              </button>
            ))}
          </div>

          {/* ── Per-category trend chart (only when a type is selected) ── */}
          {filterType && (
            <CategoryTrendChart
              points={trendPoints}
              lang={lang}
              t={t}
              sessionCount={filteredHistory.length}
            />
          )}

          {/* ── Session list (filtered or all) ── */}
          <section className="card progress-sessions">
            <h2 className="dash-card-title">
              {filterType ? t(TYPE_LABEL_KEYS[filterType]) : t("allSessions")}
            </h2>
            {filteredHistory.length === 0 ? (
              <p className="prog-cat-no-sessions">{t("progCatEmptyNone")}</p>
            ) : (
              <ul className="progress-session-list">
                {[...filteredHistory]
                  .sort((a, b) => b.date - a.date)
                  .map((s) => (
                    <SessionRow key={s.sessionId} s={s} lang={lang} t={t} />
                  ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
