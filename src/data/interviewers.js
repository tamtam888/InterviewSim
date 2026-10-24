/**
 * Interviewer personas — presentational: they set the voice and framing of
 * the session in the UI. Scoring is identical for all (and the UI says so).
 */
export const INTERVIEWERS = [
  {
    id: "emma",
    accent: "violet",
    initial: { en: "S", he: "ש" },
    name: { en: "Emma", he: "אמה" },
    title: { en: "Tech Lead", he: "ראשת צוות פיתוח" },
    style: { en: "Direct and technical", he: "ישירה וטכנית" },
    focus: {
      en: "Architecture, code quality & how you reason about trade-offs",
      he: "ארכיטקטורה, איכות קוד ואיך אתם מנמקים פשרות",
    },
    vibeKey: "vibeSarah",
  },
  {
    id: "alex",
    accent: "blue",
    initial: { en: "D", he: "ד" },
    name: { en: "Alex", he: "אלכס" },
    title: { en: "Engineering Manager", he: "מנהל פיתוח" },
    style: { en: "Leadership and collaboration", he: "מנהיגות ושיתוף פעולה" },
    focus: {
      en: "Decision making, ownership & how you work with a team",
      he: "קבלת החלטות, אחריות ואיך אתם עובדים בצוות",
    },
    vibeKey: "vibeDaniel",
  },
  {
    id: "maya",
    accent: "green",
    initial: { en: "M", he: "מ" },
    name: { en: "Maya", he: "מאיה" },
    title: { en: "HR Manager", he: "מנהלת משאבי אנוש" },
    style: { en: "Communication and behavioral", he: "תקשורת והתנהגות" },
    focus: {
      en: "Culture fit, motivation & the story behind your answers",
      he: "התאמה תרבותית, מוטיבציה והסיפור שמאחורי התשובות",
    },
    vibeKey: "vibeMaya",
  },
];

export function getInterviewer(id) {
  return INTERVIEWERS.find((i) => i.id === id) ?? INTERVIEWERS[0];
}
