/**
 * Interviewer personas — presentational: they set the voice and framing of
 * the session in the UI. Scoring is identical for all (and the UI says so).
 */
export const INTERVIEWERS = [
  {
    id: "sarah",
    portrait: "/images/sarah_original_portrait.webp",
    accent: "violet",
    initial: { en: "S", he: "ש" },
    name: { en: "Sarah", he: "שרה" },
    title: { en: "Tech Lead", he: "ראשת צוות פיתוח" },
    style: { en: "Direct and technical", he: "ישירה וטכנית" },
    focus: {
      en: "Architecture, code quality & how you reason about trade-offs",
      he: "ארכיטקטורה, איכות קוד ואיך אתם מנמקים פשרות",
    },
    vibeKey: "vibeSarah",
  },
  {
    id: "daniel",
    portrait: "/images/daniel_original_portrait.webp",
    accent: "blue",
    initial: { en: "D", he: "ד" },
    name: { en: "Daniel", he: "דניאל" },
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
    portrait: "/images/maya_interviewer.webp",
    accent: "green",
    initial: { en: "M", he: "מ" },
    name: { en: "Maya", he: "מאיה" },
    title: { en: "HR Manager", he: "מנהלת משאבי אנוש" },
    style: { en: "Empathetic and people-focused", he: "אמפתית וממוקדת באנשים" },
    focus: {
      en: "Motivation, communication, teamwork and professional growth",
      he: "מוטיבציה, תקשורת, עבודת צוות והתפתחות מקצועית",
    },
    vibeKey: "vibeMaya",
  },
];

export function getInterviewer(id) {
  return INTERVIEWERS.find((i) => i.id === id) ?? INTERVIEWERS[0];
}

// Each interview type has an appropriate professional interviewer.
// A mixed interview assigns the interviewer independently for every question.
const INTERVIEWER_BY_TYPE = {
  technical: "sarah",
  behavioral: "daniel",
  hr: "maya",
};

export function getInterviewerIdForType(type) {
  return INTERVIEWER_BY_TYPE[type] ?? "sarah";
}

export function getInterviewerForQuestion(questionType, interviewType) {
  return getInterviewer(getInterviewerIdForType(
    interviewType === "mixed" ? questionType : interviewType
  ));
}
