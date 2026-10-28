import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, ChartNoAxesCombined, Clock3, Play, Sparkles, Target, TrendingUp, Trophy } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { useAuth } from "../hooks/useAuth";
import { getRole } from "../data/roles";
import { getHistory, computeDashboard } from "../utils/practiceHistory";
import { fetchSessions, rowToHistoryEntry } from "../lib/sessionHistory";
import "../styles/HomeScreen.css";

const labelByType = {
  technical: { he: "טכני", en: "Technical" },
  behavioral: { he: "התנהגותי", en: "Behavioral" },
  hr: { he: "משאבי אנוש", en: "HR" },
  mixed: { he: "מעורב", en: "Mixed" },
};
function typeLabel(type, lang) {
  return labelByType[type]?.[lang] || (lang === "he" ? "ראיון" : "Interview");
}
function dateLabel(timestamp, lang) {
  if (!timestamp) return "—";
  return new Date(timestamp).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { day: "numeric", month: "short", year: "numeric" });
}
function MetricCard({ icon: Icon, value, label, detail }) {
  return <div className="dash-v2-metric">
    <span className="dash-v2-icon"><Icon size={20} aria-hidden="true" /></span>
    <span className="dash-v2-value">{value}</span>
    <span className="dash-v2-label">{label}</span>
    {detail && <span className="dash-v2-metric-detail">{detail}</span>}
  </div>;
}

export default function HomeScreen({ onStart, onQuickStart }) {
  const { lang, isRTL } = useLanguage();
  const { user, loading } = useAuth();
  const he = lang === "he";
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const [history, setHistory] = useState(null);

  useEffect(() => {
    if (loading) return;
    let cancelled = false;
    async function load() {
      if (user) {
        const rows = await fetchSessions(50);
        if (cancelled) return;
        if (rows !== null) {
          const cloud = rows.map(rowToHistoryEntry);
          const ids = new Set(cloud.map((record) => record.sessionId));
          const local = getHistory().filter((record) => !ids.has(record.sessionId));
          setHistory([...cloud, ...local]);
        } else {
          setHistory(getHistory());
        }
      } else if (!cancelled) {
        setHistory(getHistory());
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [user, loading]);

  const dash = useMemo(() => history === null ? null : computeDashboard(history), [history]);
  const hasHistory = (dash?.sessions ?? 0) > 0;
  const lastRole = hasHistory ? getRole(dash.last?.roleId) : null;
  const recommended = dash?.recommendedInsight;

  if (!dash) {
    return <main className="screen container dashboard-v2" aria-busy="true">
      <div className="dash-v2-loading" role="status">{he ? "טוען נתונים..." : "Loading your progress..."}</div>
    </main>;
  }

  return <main className="screen container dashboard-v2">
    <header className="dash-v2-heading">
      <div>
        <div className="dash-v2-eyebrow"><Sparkles size={16} aria-hidden="true" />{he ? "מרכז ההתקדמות שלי" : "Your practice overview"}</div>
        <h1>{hasHistory ? (he ? "מתקדמים לראיון הבא" : "Keep building your confidence") : (he ? "ההתקדמות שלכם מתחילה כאן" : "Your progress starts here")}</h1>
        <p>{hasHistory
          ? (he ? "כל הנתונים החשובים במקום אחד, עם הצעד הבא לתרגול." : "Your key results and next practice step, all in one place.")
          : (he ? "התחילו ראיון ראשון כדי לראות כאן ציונים, מגמות והישגים." : "Complete your first interview to unlock your scores, trends, and insights.")}</p>
      </div>
      <button type="button" className="dash-v2-start" onClick={onStart}><Play size={18} aria-hidden="true" />{he ? "ראיון חדש" : "New interview"}<Arrow size={17} aria-hidden="true" /></button>
    </header>

    {!hasHistory ? (
      <section className="dash-v2-empty">
        <div className="dash-v2-empty-art"><Target size={42} aria-hidden="true" /></div>
        <h2>{he ? "הראיון הראשון שלכם מחכה" : "Your first interview awaits"}</h2>
        <p>{he ? "בחרו תפקיד, תרגלו בקול או בכתיבה וקבלו משוב שיעזור לכם להשתפר." : "Choose a role, practice by voice or text, and get feedback you can act on."}</p>
        <button type="button" className="dash-v2-start" onClick={onStart}>{he ? "התחילו לתרגל" : "Start practicing"}<Arrow size={17} /></button>
      </section>
    ) : (
      <>
        <section className="dash-v2-metrics" aria-label={he ? "מדדי התקדמות" : "Progress metrics"}>
          <MetricCard icon={CalendarDays} value={dash.sessions} label={he ? "ראיונות שהושלמו" : "Interviews completed"} />
          <MetricCard icon={Trophy} value={dash.avgOverall ? `${dash.avgOverall}%` : "—"} label={he ? "ציון ממוצע" : "Average score"} />
          <MetricCard icon={Target} value={dash.totalAnswered ?? 0} label={he ? "שאלות שנענו" : "Questions answered"} />
          <MetricCard icon={TrendingUp} value={dash.streak ?? 0} label={he ? "ימי תרגול ברצף" : "Practice-day streak"} />
        </section>

        <section className="dash-v2-feature">
          <div className="dash-v2-feature-text">
            <span className="dash-v2-feature-kicker"><Sparkles size={15} aria-hidden="true" />{he ? "ההמלצה שלכם להמשך" : "Your next practice step"}</span>
            <h2>{lastRole?.name?.[lang] || (he ? "תרגול מותאם עבורכם" : "Personalized interview practice")}</h2>
            <p>{recommended
              ? (he ? `מומלץ להקדיש את התרגול הבא לראיון ${typeLabel(recommended.type, lang)} כדי לחזק את הביטחון שלכם.` : `Focus your next session on ${typeLabel(recommended.type, lang).toLowerCase()} questions and keep improving.`)
              : (he ? "המשיכו לתרגל כדי לבנות תמונה ברורה של ההתקדמות שלכם." : "Keep practicing to build a clearer picture of your progress.")}</p>
            <span className="dash-v2-last">{he ? "תרגול אחרון:" : "Last practice:"} {dateLabel(dash.last?.date, lang)}</span>
          </div>
          <div className="dash-v2-feature-action">
            <button type="button" className="dash-v2-start" onClick={() => onQuickStart({
              roleId: dash.last.roleId,
              interviewType: recommended?.type || dash.last.interviewType || "mixed",
              questionCount: dash.last.questionCount || 6,
              interviewerId: dash.last.interviewerId || "sarah",
              experienceLevel: dash.last.experienceLevel || "junior",
              difficulty: dash.last.difficulty || "mixed",
            })}><Play size={17} />{he ? "תרגול ממוקד" : "Practice recommended"}<Arrow size={16} /></button>
            <button type="button" className="dash-v2-text-action" onClick={onStart}>{he ? "בחירת תפקיד אחר" : "Choose another role"}</button>
          </div>
        </section>

        <div className="dash-v2-bottom">
          <section className="dash-v2-panel">
            <div className="dash-v2-panel-heading"><div className="dash-v2-panel-heading-icon"><ChartNoAxesCombined size={19} /></div><div><h2>{he ? "התקדמות לפי תחום" : "Performance by interview type"}</h2><p>{he ? "ממוצע התוצאות האחרונות" : "Average from your recent sessions"}</p></div></div>
            <div className="dash-v2-bars">
              {["technical", "behavioral", "hr"].map((type) => {
                const score = dash.recentTypeAverages?.[type];
                return <div key={type} className="dash-v2-bar-row">
                  <div className="dash-v2-bar-label"><span>{typeLabel(type, lang)}</span><strong>{score == null ? "—" : `${score}%`}</strong></div>
                  <div className="dash-v2-bar-track"><span style={{ width: `${Math.max(0, Math.min(100, score ?? 0))}%` }} /></div>
                </div>;
              })}
            </div>
          </section>

          <section className="dash-v2-panel">
            <div className="dash-v2-panel-heading"><div className="dash-v2-panel-heading-icon"><Clock3 size={19} /></div><div><h2>{he ? "ראיונות אחרונים" : "Recent interviews"}</h2><p>{he ? "התרגולים האחרונים שלכם" : "Your latest practice sessions"}</p></div></div>
            {dash.recent?.length ? <ul className="dash-v2-recent">
              {dash.recent.slice(0, 4).map((entry, index) => {
                const role = getRole(entry.roleId);
                return <li key={entry.sessionId || index}><div><strong>{role?.name?.[lang] || typeLabel(entry.interviewType, lang)}</strong><span>{dateLabel(entry.date, lang)} · {typeLabel(entry.interviewType, lang)}</span></div><span className="dash-v2-score">{entry.overall == null ? "—" : `${entry.overall}%`}</span></li>;
              })}
            </ul> : <p className="dash-v2-no-recent">{he ? "עדיין אין ראיונות עם ציונים." : "No scored interviews yet."}</p>}
          </section>
        </div>
      </>
    )}
  </main>;
}
