import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, ArrowLeft, Play, Target, TrendingUp, Plus,
  Clock, Star,
} from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { useAuth } from "../hooks/useAuth";
import { getRole } from "../data/roles";
import { getHistory, computeDashboard } from "../utils/practiceHistory";
import { fetchSessions, rowToHistoryEntry } from "../lib/sessionHistory";
import "../styles/HomeScreen.css";

const TYPE_LABEL_KEYS = {
  technical:  "typeTechnical",
  hr:         "typeHr",
  behavioral: "typeBehavioral",
  mixed:      "typeMixed",
};
function typeLabelKey(type) { return TYPE_LABEL_KEYS[type] ?? "typeMixed"; }

/* Maps interview type → hero headline i18n key.
   "Technical rounds", "Behavioral rounds" etc. are interview-domain language
   that cannot be detached from the interview-prep context. */
const TYPE_FOCUS_KEYS = {
  technical:  "heroFocusTechnical",
  hr:         "heroFocusHr",
  behavioral: "heroFocusBehavioral",
  mixed:      "heroFocusMixed",
};
function typeFocusKey(type) { return TYPE_FOCUS_KEYS[type] ?? "heroFocusMixed"; }

function formatDay(ts, lang) {
  return new Date(ts).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", {
    day: "numeric", month: "short",
  });
}

function bucket(score) { return Math.max(1, Math.min(10, Math.round((score ?? 0) / 10))); }

/* ─── Hero Evidence (one sentence, hero only) ─── */
function formatHeroEvidence(rec, allInsights, t) {
  const name   = t(typeLabelKey(rec.type));
  const ranked = allInsights
    .filter((i) => i.recentAvg !== null)
    .sort((a, b) => a.recentAvg - b.recentAvg);
  const isLowest = ranked.length > 0 && ranked[0].type === rec.type;
  const { trend, trendDelta, recentAvg, daysSinceLast, sessionCount } = rec;

  if (trend === "stale") {
    const days = isFinite(daysSinceLast) ? daysSinceLast : "—";
    return t("heroEv_stale_pre") + name + t("heroEv_stale_1") + days + t("heroEv_stale_2");
  }
  if (trend === "declining" && isLowest) {
    return t("heroEv_declLowest_pre") + name + t("heroEv_declLowest_1") + Math.abs(trendDelta) + t("heroEv_declLowest_2");
  }
  if (trend === "declining") {
    return t("heroEv_decl_pre") + name + t("heroEv_decl_1") + Math.abs(trendDelta) + t("heroEv_decl_2");
  }
  if (trend === "new") {
    return t("heroEv_new_pre") + sessionCount + t("heroEv_new_1") + name + t("heroEv_new_2");
  }
  if (isLowest && recentAvg !== null) {
    return name + t("heroEv_lowest_1") + recentAvg + t("heroEv_lowest_2");
  }
  return t("heroEv_default");
}

/* ─── Hero Card ─── */
function ContinueCard({ dash, t, lang, isRTL, onQuickStart, onStart }) {
  const last        = dash.last;
  const rec         = dash.recommendedInsight;
  const Arrow       = isRTL ? ArrowLeft : ArrowRight;
  const primaryType = rec ? rec.type : last.interviewType;
  const role        = getRole(last.roleId);

  /* Days since last session of the last-practiced type */
  const lastInsight = (dash.categoryInsights ?? []).find((i) => i.type === last.interviewType);
  const daysAgo     = lastInsight?.daysSinceLast;

  return (
    <section className="dash-hero" aria-label={t("heroCtxLabel")}>

      {/* Content column: label → headline → evidence → meta */}
      <div className="dash-hero-content">
        <div className="dash-hero-ctx" aria-hidden="true">
          {t("heroCtxLabel")}
        </div>
        {role && (
          <h2 className="dash-hero-role">{role.name[lang]}</h2>
        )}
        <div className="dash-hero-focus">
          {t("heroRecoLabel")}: {t(typeFocusKey(primaryType))}
        </div>
        {rec && (
          <p className="dash-hero-evidence">
            {formatHeroEvidence(rec, dash.categoryInsights ?? [], t)}
          </p>
        )}
        <div className="dash-hero-meta">
          {t("heroLastPractice")}: {t(typeLabelKey(last.interviewType))}
          {daysAgo != null && isFinite(daysAgo)
            ? ` · ${daysAgo}${t("heroDaysAgo")}`
            : null}
        </div>
      </div>

      {/* Action column: right in LTR, left in RTL (direction inheritance) */}
      <div className="dash-hero-action">
        <button
          type="button"
          className="ds-btn ds-btn-primary"
          onClick={() => onQuickStart({
            roleId:          last.roleId,
            interviewType:   primaryType,
            questionCount:   last.questionCount   ?? 6,
            interviewerId:   last.interviewerId   ?? "sarah",
            experienceLevel: last.experienceLevel ?? "junior",
            difficulty:      last.difficulty      ?? "mixed",
          })}
        >
          <Play size={15} aria-hidden="true" />
          {t("heroPracticeVerb")} {t(typeLabelKey(primaryType))}
        </button>
        <button type="button" className="dash-hero-change" onClick={onStart}>
          {t("heroChangeRole")}
          <Arrow size={12} aria-hidden="true" />
        </button>
      </div>

    </section>
  );
}

/* ─── Recommended Card ─── */
function formatSfReason(rec, allInsights, t) {
  const name = t(typeLabelKey(rec.type));
  const ranked = allInsights.filter((i) => i.recentAvg !== null).sort((a, b) => a.recentAvg - b.recentAvg);
  const isLowest = ranked.length > 0 && ranked[0].type === rec.type;
  const { trend, trendDelta, recentAvg, daysSinceLast, sessionCount } = rec;

  if (trend === "stale") {
    const days = isFinite(daysSinceLast) ? daysSinceLast : "—";
    return name + t("sfReason_stale") + days + t("sfReason_staleDays");
  }
  if (trend === "declining" && isLowest) {
    return name + t("sfReason_declLowest_1") + Math.abs(trendDelta) + t("sfReason_declLowest_2");
  }
  if (trend === "declining") {
    return name + t("sfReason_decl_1") + Math.abs(trendDelta) + t("sfReason_decl_2");
  }
  if (trend === "new") {
    return t("sfReason_new_1") + sessionCount + " " + name + t("sfReason_new_2");
  }
  if (isLowest && recentAvg !== null) {
    return name + t("sfReason_lowest_1") + recentAvg + t("sfReason_lowest_2");
  }
  return t("sfReason_default");
}

/* ─── Skill Focus Card ─── */
function sfTrendLabel(insight, t) {
  const { trend, trendDelta } = insight;
  if (trend === "improving") return `↑ +${trendDelta}`;
  if (trend === "declining") return `↓ ${trendDelta}`;
  if (trend === "stable")    return t("sfTrendStable");
  if (trend === "new")       return t("sfTrendNew");
  if (trend === "stale")     return t("sfTrendStale");
  return "—";
}

const TYPE_BADGE_KEYS = {
  technical:  "ds-badge--technical",
  hr:         "ds-badge--hr",
  behavioral: "ds-badge--behavioral",
  mixed:      "ds-badge--mixed",
};
function typeBadgeClass(type) { return TYPE_BADGE_KEYS[type] ?? "ds-badge--mixed"; }

function SkillFocusCard({ dash, t, onQuickStart }) {
  const insights = dash.categoryInsights ?? [];
  const rec      = dash.recommendedInsight;

  if (!insights.length || !rec) return null;

  return (
    <section className="ds-section-card dash-skill-focus">
      <h2 className="ds-section-label">
        <Target size={13} aria-hidden="true" />{t("skillFocusTitle")}
      </h2>

      <div className="sf-category-grid">
        {insights.map((insight) => {
          const isRec   = insight.type === rec.type;
          const score   = insight.recentAvg ?? insight.lastKnownAvg;
          const isStale = insight.trend === "stale" || insight.trend === "none";
          return (
            <div key={insight.type}
                 className={`sf-cat-card${isRec ? " sf-cat-rec" : ""}`}>

              {/* Recommended label — top-end corner */}
              {isRec && (
                <span className="sf-cat-rec-badge">
                  <Star size={10} aria-hidden="true" />
                  {t("sfFocus")}
                </span>
              )}

              {/* Header: type badge + trend */}
              <div className="sf-cat-header">
                <span className={`ds-badge ${typeBadgeClass(insight.type)}`}>
                  {t(typeLabelKey(insight.type))}
                </span>
                <span className={`sf-trend sf-trend-${insight.trend}`}>
                  {sfTrendLabel(insight, t)}
                </span>
              </div>

              {/* Score — main metric */}
              <span className={`sf-cat-score${isRec ? " sf-cat-score-rec" : ""}${isStale ? " sf-score-stale" : ""}`}>
                {score !== null && score !== undefined ? score : "—"}
              </span>

              {/* Progress bar */}
              {!isStale && score != null && (
                <div className="sf-cat-bar-track" aria-hidden="true">
                  <div
                    className={`sf-cat-bar-fill score-bar-b-${bucket(score)}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Coaching row: reason text + focused practice CTA */}
      <div className="sf-coaching-row">
        <p className="sf-coaching-reason">
          {formatSfReason(rec, insights, t)}
        </p>
        <button
          type="button"
          className="ds-btn ds-btn-secondary"
          onClick={() => onQuickStart({
            roleId:          dash.last.roleId,
            interviewType:   rec.type,
            questionCount:   dash.last.questionCount   ?? 6,
            interviewerId:   dash.last.interviewerId   ?? "sarah",
            experienceLevel: dash.last.experienceLevel ?? "junior",
            difficulty:      dash.last.difficulty      ?? "mixed",
          })}
        >
          <Target size={14} aria-hidden="true" />{t("sfStartFocused")}
        </button>
      </div>
    </section>
  );
}

/* ─── Trend Card ─── */
function TrendCard({ dash, t, lang }) {
  const points = dash.trend ?? [];
  const n = points.length;

  /* Empty / low-data state */
  if (n < 2) {
    return (
      <section className="ds-section-card dash-trend">
        <h2 className="ds-section-label"><TrendingUp size={13} aria-hidden="true" />{t("progressTitle")}</h2>
        <div className="trend-empty">
          <TrendingUp size={28} className="trend-empty-icon" aria-hidden="true" />
          <p className="trend-empty-text">
            {n === 0 ? t("trendEmptyNone") : t("trendEmptyFew")}
          </p>
        </div>
      </section>
    );
  }

  const delta = points[n - 1].overall - points[0].overall;
  const deltaLabel = delta > 0
    ? `+${delta} ${t("trendPts")} ${t("trendDeltaUp")}`
    : delta < 0
    ? `${delta} ${t("trendPts")} ${t("trendDeltaDown")}`
    : t("trendDeltaFlat");

  /* Dynamic Y-axis: pad ±5 around the visible score range, clamp to 0-100 */
  const rawMin  = Math.min(...points.map((p) => p.overall));
  const rawMax  = Math.max(...points.map((p) => p.overall));
  const yMin    = Math.max(0,   rawMin - 5);
  const yMax    = Math.min(100, rawMax + 5);
  const yRange  = yMax - yMin || 1; /* guard: all-equal scores still get range=1 */
  /* Tall chart: 15px top pad + 155px data range + 30px label space = 200px viewBox */
  const svgY    = (score) => 10 + (1 - (score - yMin) / yRange) * 76;
  const svgX    = (i)     => 40 + (i / (n - 1)) * 560;


  return (
    <section className="ds-section-card dash-trend">
      <h2 className="ds-section-label"><TrendingUp size={13} aria-hidden="true" />{t("progressTitle")}</h2>
      <p className="trend-date-range">
        {formatDay(points[0].date, lang)} &ndash; {formatDay(points[n - 1].date, lang)}
      </p>

      <svg
        className="trend-line-svg"
        viewBox="0 0 620 112"
        width="100%"
        aria-label={t("progressTitle")}
        role="img"
      >
        {/* Area fill under the line */}
        <polygon
          className="trend-area"
          points={[
            `${svgX(0)},88`,
            ...points.map((p, i) => `${svgX(i)},${svgY(p.overall)}`),
            `${svgX(n - 1)},88`,
          ].join(" ")}
        />
        <polyline
          className="trend-line"
          points={points.map((p, i) => `${svgX(i)},${svgY(p.overall)}`).join(" ")}
        />
        {points.map((p, i) => (
          <circle key={p.date} className="trend-dot"
            cx={String(svgX(i))}
            cy={String(svgY(p.overall))}
            r="3" />
        ))}
        <text className="trend-score-label"
          x="600"
          y={String(
            svgY(points[n - 1].overall) < 30
              ? svgY(points[n - 1].overall) + 16  /* near top: label below dot */
              : svgY(points[n - 1].overall) - 10  /* normal: label above dot  */
          )}
          textAnchor="end">
          {points[n - 1].overall}
        </text>
        <text className="trend-label-text" x="40" y="108" textAnchor="start">
          {formatDay(points[0].date, lang)}
        </text>
        <text className="trend-label-text" x="600" y="108" textAnchor="end">
          {formatDay(points[n - 1].date, lang)}
        </text>
      </svg>
      <p className={`trend-insight ${delta > 0 ? "trend-delta-up" : delta < 0 ? "trend-delta-down" : "trend-delta-flat"}`}>
        {deltaLabel}
      </p>
    </section>
  );
}

/* ─── Recent Sessions ─── */
function RecentSessions({ dash, t, lang }) {
  return (
    <section className="ds-section-card dash-recent">
      <h2 className="ds-section-label"><Clock size={13} aria-hidden="true" />{t("recentSessionsTitle")}</h2>
      {dash.recent.length === 0 ? (
        <div className="recent-empty">
          <Clock size={28} className="recent-empty-icon" aria-hidden="true" />
          <p className="recent-empty-text">{t("recentEmptyNone")}</p>
        </div>
      ) : (
        <ul className="recent-list">
          {dash.recent.map((r) => {
            const role = getRole(r.roleId);

            return (
              <li key={r.sessionId} className="recent-row">
                <span className="recent-main">
                  <span className="recent-role-row">
                    <span className={`ds-badge ${typeBadgeClass(r.interviewType)}`}>
                      {t(typeLabelKey(r.interviewType))}
                    </span>
                    <span className="recent-role">{role?.name[lang]}</span>
                  </span>
                  <span className="recent-detail">
                    {formatDay(r.date, lang)}
                  </span>
                </span>
                <span className={`recent-score score-b-${bucket(r.overall)}`}>{r.overall}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/* ─── First Run ─── */
function FirstRun({ t, onStart }) {
  return (
    <section className="dash-firstrun">
      <h2 className="dash-firstrun-title">{t("firstRunTitle")}</h2>
      <p className="dash-firstrun-text">{t("firstRunText")}</p>
      <ol className="firstrun-steps">
        {["firstRunStep1","firstRunStep2","firstRunStep3"].map((key, i) => (
          <li key={key} className="firstrun-step">
            <span className="firstrun-step-num" aria-hidden="true">{i + 1}</span>{t(key)}
          </li>
        ))}
      </ol>
      <button type="button" className="ds-btn ds-btn-primary" onClick={onStart}>
        <Play size={18} aria-hidden="true" />{t("firstRunCta")}
      </button>
    </section>
  );
}

/* ─── Home Screen ─── */
export default function HomeScreen({ onStart, onQuickStart }) {
  const { t, lang, isRTL } = useLanguage();
  const { user, loading } = useAuth();
  const [history, setHistory] = useState(null);

  useEffect(() => {
    // Wait for auth to settle so we never read localStorage for a signed-in user.
    // While loading=true, history stays null and the loading guard renders a blank
    // container — no flash of stale localStorage numbers.
    if (loading) return;

    let cancelled = false;
    async function load() {
      if (user) {
        // Signed in: Supabase is the source of truth, but cloud saves are async
        // and may not have completed before the user returns to the dashboard.
        // Merge in any localStorage sessions missing from Supabase so the latest
        // session's perType data is always reflected in the dashboard.
        const rows = await fetchSessions(50);
        if (!cancelled) {
          if (rows !== null) {
            const cloud = rows.map(rowToHistoryEntry);
            const cloudIds = new Set(cloud.map((r) => r.sessionId));
            const local = getHistory().filter((r) => !cloudIds.has(r.sessionId));
            setHistory([...cloud, ...local]);
          } else {
            // Supabase fetch failed — fall back to localStorage entirely.
            setHistory(getHistory());
          }
        }
      } else {
        // Guest: localStorage is the source of truth.
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

  if (!dash) {
    return <main className="screen container dashboard" aria-busy="true" />;
  }

  const hasHistory = dash.sessions > 0;
  const nameTag = user?.email ? `, ${user.email.slice(0, user.email.indexOf("@"))}` : "";

  return (
    <main className="screen container dashboard">
      <header className="dash-head">
        <div className="dash-head-copy">
          <h1 className="dash-title">
            {hasHistory ? `${t("dashWelcomeBack")}${nameTag} \u{1F44B}` : t("dashTitle")}
          </h1>
          <p className="dash-subtitle">{t("dashSubtitle")}</p>
        </div>
        <button type="button" className="ds-btn ds-btn-secondary btn-new-interview" onClick={onStart}>
          <Plus size={17} aria-hidden="true" />{t("startNewInterview")}
        </button>
      </header>

      {hasHistory ? (
        <>
          <ContinueCard dash={dash} t={t} lang={lang} isRTL={isRTL} onQuickStart={onQuickStart} onStart={onStart} />
          <SkillFocusCard dash={dash} t={t} onQuickStart={onQuickStart} />
          <TrendCard dash={dash} t={t} lang={lang} />
          <RecentSessions dash={dash} t={t} lang={lang} />
        </>
      ) : (
        <FirstRun t={t} onStart={onStart} />
      )}


    </main>
  );
}
