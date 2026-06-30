/**
 * The roles a user can practice for.
 * `icon` is a lucide-react icon name resolved in the UI layer.
 */
export const ROLES = [
  {
    id: "frontend",
    category: { en: "Engineering", he: "הנדסה" },
    level: { en: "Junior–Senior", he: "ג'וניור–סיניור" },
    icon: "Monitor",
    accent: "violet",
    name: { en: "Frontend Developer", he: "מפתח/ת פרונטאנד" },
    tagline: { en: "HTML, CSS, JS, frameworks & performance", he: "HTML, CSS, JS, פריימוורקים וביצועים" },
  },
  {
    id: "react",
    category: { en: "Engineering", he: "הנדסה" },
    level: { en: "Junior–Senior", he: "ג'וניור–סיניור" },
    icon: "Atom",
    accent: "blue",
    name: { en: "React Developer", he: "מפתח/ת React" },
    tagline: { en: "Hooks, state, rendering & ecosystem", he: "Hooks, ניהול state, רינדור ואקוסיסטם" },
  },
  {
    id: "fullstack",
    category: { en: "Engineering", he: "הנדסה" },
    level: { en: "Mid–Senior", he: "מיד–סיניור" },
    icon: "Layers",
    accent: "violet",
    name: { en: "Full-Stack Developer", he: "מפתח/ת Full-Stack" },
    tagline: { en: "Frontend + backend + architecture", he: "פרונטאנד + בקאנד + ארכיטקטורה" },
  },
  {
    id: "backend",
    category: { en: "Engineering", he: "הנדסה" },
    level: { en: "Junior–Senior", he: "ג'וניור–סיניור" },
    icon: "Server",
    accent: "green",
    name: { en: "Backend Developer", he: "מפתח/ת בקאנד" },
    tagline: { en: "APIs, databases, scaling & security", he: "APIs, בסיסי נתונים, סקיילינג ואבטחה" },
  },
  {
    id: "qa",
    category: { en: "Quality", he: "איכות" },
    level: { en: "Junior–Senior", he: "ג'וניור–סיניור" },
    icon: "BugOff",
    accent: "amber",
    name: { en: "QA Tester", he: "בודק/ת QA" },
    tagline: { en: "Test design, automation & quality mindset", he: "תכנון בדיקות, אוטומציה וחשיבת איכות" },
  },
  {
    id: "product",
    category: { en: "Product", he: "מוצר" },
    level: { en: "Mid–Senior", he: "מיד–סיניור" },
    icon: "Map",
    accent: "blue",
    name: { en: "Product Manager", he: "מנהל/ת מוצר" },
    tagline: { en: "Strategy, prioritization & user research", he: "אסטרטגיה, תעדוף ומחקר משתמשים" },
  },
  {
    id: "uxui",
    category: { en: "Design", he: "עיצוב" },
    level: { en: "Junior–Senior", he: "ג'וניור–סיניור" },
    icon: "PenTool",
    accent: "violet",
    name: { en: "UX/UI Designer", he: "מעצב/ת UX/UI" },
    tagline: { en: "User flows, visual design & usability", he: "תהליכי משתמש, עיצוב ויזואלי ושמישות" },
  },
  {
    id: "data",
    category: { en: "Data", he: "דאטה" },
    level: { en: "Junior–Mid", he: "ג'וניור–מיד" },
    icon: "BarChart3",
    accent: "green",
    name: { en: "Data Analyst", he: "אנליסט/ית דאטה" },
    tagline: { en: "SQL, metrics, dashboards & insights", he: "SQL, מדדים, דשבורדים ותובנות" },
  },
  {
    id: "support",
    category: { en: "Customer", he: "לקוחות" },
    level: { en: "All levels", he: "כל הרמות" },
    icon: "Headphones",
    accent: "amber",
    name: { en: "Customer Support / Success", he: "תמיכה / הצלחת לקוחות" },
    tagline: { en: "Empathy, de-escalation & retention", he: "אמפתיה, הרגעת מצבים ושימור לקוחות" },
  },
  {
    id: "general",
    category: { en: "Any field", he: "כל תחום" },
    level: { en: "All levels", he: "כל הרמות" },
    icon: "Briefcase",
    accent: "blue",
    name: { en: "General Interview", he: "ראיון כללי" },
    tagline: { en: "Universal questions for any job", he: "שאלות אוניברסליות לכל משרה" },
  },
];

export const INTERVIEW_TYPES = [
  { id: "technical", icon: "Code2", labelKey: "typeTechnical", descKey: "typeTechnicalDesc" },
  { id: "hr", icon: "Users", labelKey: "typeHr", descKey: "typeHrDesc" },
  { id: "behavioral", icon: "MessageSquareHeart", labelKey: "typeBehavioral", descKey: "typeBehavioralDesc" },
  { id: "mixed", icon: "Shuffle", labelKey: "typeMixed", descKey: "typeMixedDesc" },
];

export const SESSION_LENGTHS = [
  { id: "quick", count: 4, labelKey: "questionsShort" },
  { id: "standard", count: 6, labelKey: "questionsStandard" },
  { id: "full", count: 8, labelKey: "questionsFull" },
];

export function getRole(roleId) {
  return ROLES.find((r) => r.id === roleId) ?? null;
}

export const EXPERIENCE_LEVELS = [
  {
    id: "junior",
    labelKey: "levelJunior",
    descKey: "levelJuniorDesc",
  },
  {
    id: "mid",
    labelKey: "levelMid",
    descKey: "levelMidDesc",
  },
  {
    id: "senior",
    labelKey: "levelSenior",
    descKey: "levelSeniorDesc",
  },
  {
    id: "lead",
    labelKey: "levelLead",
    descKey: "levelLeadDesc",
  },
];

export const DIFFICULTIES = [
  {
    id: "easy",
    labelKey: "difficultyEasy",
    descKey: "difficultyEasyDesc",
  },
  {
    id: "medium",
    labelKey: "difficultyMedium",
    descKey: "difficultyMediumDesc",
  },
  {
    id: "hard",
    labelKey: "difficultyHard",
    descKey: "difficultyHardDesc",
  },
  {
    id: "mixed",
    labelKey: "difficultyMixed",
    descKey: "difficultyMixedDesc",
  },
];
