import { ArrowRight, ArrowLeft, AudioLines, ChartNoAxesCombined, Mic2, MessageSquareText, Play, Sparkles, BriefcaseBusiness, ShieldCheck } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import "../styles/WelcomeScreen.css";

export default function WelcomeScreen({ onStart, onDashboard, onJobMatch }) {
  const { lang, isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const he = lang === "he";
  return (
    <main className="screen container welcome-page">
      <section className="welcome-hero" aria-labelledby="welcome-title">
        <div className="welcome-copy">
          <div className="welcome-eyebrow"><Sparkles size={15} aria-hidden="true" />{he ? "תרגול ראיונות עבודה עם AI" : "AI-powered interview practice"}</div>
          <h1 id="welcome-title">{he ? "מוכנים לראיון הבא שלכם?" : "Your next interview starts here."}</h1>
          <p className="welcome-lead">{he
            ? "בחרו תפקיד, תרגלו שאלות אמיתיות בקצב שלכם וקבלו משוב מעשי שיעזור לכם להשתפר מראיון לראיון."
            : "Practice realistic questions for your role, build confidence through voice or text, and get useful feedback after every answer."}</p>
          <div className="welcome-actions">
            <button type="button" className="welcome-primary" onClick={onStart}>
              <Play size={19} aria-hidden="true" />
              {he ? "התחלת ראיון חדש" : "Start new interview"}
              <Arrow size={18} aria-hidden="true" />
            </button>
            <button type="button" className="welcome-secondary" onClick={onJobMatch}>
              <BriefcaseBusiness size={18} aria-hidden="true" />
              {he ? "ראיון לפי משרה" : "Practice for a job"}
            </button>
          </div>
          <div className="welcome-reassurance"><ShieldCheck size={16} aria-hidden="true" />{he ? "אפשר להתחיל לתרגל גם ללא חשבון" : "Start practicing without an account"}</div>
        </div>
        <div className="welcome-demo" aria-label={he ? "המחשה של תהליך הראיון" : "Interview flow preview"}>
          <div className="welcome-demo-top"><span className="welcome-demo-dot" /><span>{he ? "תרגול ראיון" : "Interview practice"}</span><span className="welcome-demo-tag">{he ? "דוגמה" : "Preview"}</span></div>
          <div className="welcome-demo-person">
            <div className="welcome-demo-avatar"><AudioLines size={24} aria-hidden="true" /></div>
            <div><strong>{he ? "המראיינת" : "Your interviewer"}</strong><small>{he ? "סימולציה אינטראקטיבית" : "Interactive interview"}</small></div>
          </div>
          <div className="welcome-demo-question">{he ? "ספרו על פרויקט שהובלתם. מה הייתה הבעיה ואיך פתרתם אותה?" : "Tell me about a project you built. What problem did it solve?"}</div>
          <div className="welcome-demo-input"><Mic2 size={18} aria-hidden="true" /><span>{he ? "ענו בקול או בכתיבה" : "Answer by voice or text"}</span></div>
          <div className="welcome-demo-footer"><span className="welcome-demo-progress" /><span className="welcome-demo-progress welcome-demo-progress-muted" /><span className="welcome-demo-progress welcome-demo-progress-muted" /></div>
        </div>
      </section>
      <section className="welcome-benefits" aria-label={he ? "יתרונות התרגול" : "Interview practice benefits"}>
        <article className="welcome-benefit"><div className="welcome-benefit-icon"><Mic2 size={22} /></div><h2>{he ? "תרגול בקול" : "Voice practice"}</h2><p>{he ? "אפשר להאזין לשאלות ולהשיב בקול או בכתיבה." : "Listen to questions and answer by voice or text."}</p></article>
        <article className="welcome-benefit"><div className="welcome-benefit-icon"><MessageSquareText size={22} /></div><h2>{he ? "משוב מפורט" : "Actionable feedback"}</h2><p>{he ? "נקודות חוזק, מה לשפר ותרגול ממוקד." : "Strengths, areas to improve, and focused guidance."}</p></article>
        <article className="welcome-benefit"><div className="welcome-benefit-icon"><ChartNoAxesCombined size={22} /></div><h2>{he ? "מעקב התקדמות" : "Track your progress"}</h2><p>{he ? "חזרו לנתונים ולראיונות הקודמים בדשבורד." : "Review practice history and insights in your dashboard."}</p></article>
      </section>
      <div className="welcome-dashboard-link"><span>{he ? "כבר תרגלתם בעבר?" : "Practiced before?"}</span><button type="button" onClick={onDashboard}>{he ? "מעבר לדשבורד" : "Go to dashboard"} <Arrow size={16} aria-hidden="true" /></button></div>
    </main>
  );
}
