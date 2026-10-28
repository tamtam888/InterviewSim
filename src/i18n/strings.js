/**
 * UI strings for the app, English + Hebrew.
 * Question content lives in src/data/questions.js with the same {en, he} shape.
 */
export const STRINGS = {
  // App / header
  appName: { en: "InterviewSim", he: "InterviewSim" },
  langToggle: { en: "עברית", he: "English" },

  // Home
  heroBadge: { en: "AI-style Interview Simulator", he: "סימולטור ראיונות עבודה" },
  heroTitle1: { en: "Walk into your next interview", he: "לראיון הבא שלך" },
  heroTitle2: { en: "ready.", he: "אתה תבוא מוכן." },
  heroSubtitle: {
    en: "Practice real interview questions for your role, answer in your own words, and get instant constructive feedback.",
    he: "תרגלו שאלות ראיון אמיתיות לתפקיד שלכם, ענו במילים שלכם וקבלו פידבק בונה ומיידי.",
  },
  heroCta: { en: "Start practicing — free", he: "התחילו לתרגל — חינם" },
  heroHintRoles: { en: "10 roles", he: "10 תפקידים" },
  heroHintTypes: { en: "4 interview types", he: "4 סוגי ראיון" },
  heroHintFeedback: { en: "Instant feedback", he: "פידבק מיידי" },

  howItWorks: { en: "How it works", he: "איך זה עובד" },
  stepsTitle1: { en: "From 0 to a confident interview", he: "מ-0 לראיון מושלם" },
  stepsTitle2: { en: "in 4 simple steps", he: "ב-4 שלבים פשוטים" },
  step1Title: { en: "Pick a role", he: "בחרו תפקיד" },
  step1Text: {
    en: "Frontend, Backend, QA, Product, UX, Data and more — or practice a general interview.",
    he: "פרונטאנד, בקאנד, QA, מוצר, UX, דאטה ועוד — או ראיון כללי.",
  },
  step2Title: { en: "Choose interview type", he: "בחרו סוג ראיון" },
  step2Text: {
    en: "Technical, HR, behavioral, or a mixed session that combines all three.",
    he: "טכני, HR, התנהגותי, או ראיון מעורב שמשלב את שלושתם.",
  },
  step3Title: { en: "Answer in your words", he: "ענו במילים שלכם" },
  step3Text: {
    en: "Type your answer or use your voice. One question at a time, just like the real thing.",
    he: "הקלידו את התשובה או דברו בקול. שאלה אחת בכל פעם, בדיוק כמו בראיון אמיתי.",
  },
  step4Title: { en: "Get detailed feedback", he: "קבלו פידבק מפורט" },
  step4Text: {
    en: "Strengths, what to improve, a suggested stronger answer and a score for every question.",
    he: "נקודות חוזק, מה לשפר, הצעה לתשובה חזקה יותר וציון לכל שאלה.",
  },

  rolesPreviewTitle: { en: "Practice for the role you actually want", he: "תרגלו לתפקיד שאתם באמת רוצים" },
  startFreeNow: { en: "Start a practice interview", he: "התחילו ראיון תרגול" },
  noSignup: { en: "No signup needed — everything runs in your browser.", he: "ללא הרשמה — הכל רץ בדפדפן שלכם." },

  // Role selection
  chooseRoleTitle: { en: "Choose your role", he: "בחרו את התפקיד שלכם" },
  chooseRoleSubtitle: {
    en: "The questions adapt to the role you pick.",
    he: "השאלות מותאמות לתפקיד שתבחרו.",
  },
  back: { en: "Back", he: "חזרה" },

  // Setup
  setupTitle: { en: "Set up your interview", he: "הגדירו את הראיון שלכם" },
  setupSubtitle: { en: "Choose the interview type and length.", he: "בחרו את סוג הראיון ואת האורך." },
  // Experience level + difficulty (SetupScreen)
  setupExperienceLevel: { en: "Experience Level", he: "רמת ניסיון" },
  setupDifficulty: { en: "Difficulty", he: "רמת קושי" },

  levelJunior: { en: "Junior", he: "ג'וניור" },
  levelJuniorDesc: { en: "0–2 years, learning the ropes", he: "⁦0–2⁩  שנים, מתחיל/ה" },
  levelMid: { en: "Mid-Level", he: "מיד-לבל" },
  levelMidDesc: { en: "2–5 years, independent contributor", he: "⁦2–5⁩  שנים, עצמאי/ת" },
  levelSenior: { en: "Senior", he: "סיניור" },
  levelSeniorDesc: { en: "5+ years, technical leader", he: "⁦5+⁩  שנים, מוביל/ה טכני/ת" },
  levelLead: { en: "Lead / Staff", he: "ליד / סטאף" },
  levelLeadDesc: { en: "Architecture, strategy & mentoring", he: "ארכיטקטורה, אסטרטגיה ומנטורינג" },

  difficultyEasy: { en: "Easy", he: "קל" },
  difficultyEasyDesc: { en: "Direct questions, basic concepts", he: "שאלות ישירות, מושגי יסוד" },
  difficultyMedium: { en: "Medium", he: "בינוני" },
  difficultyMediumDesc: { en: "Applied scenarios, trade-offs", he: "תרחישים יישומיים, השוואות" },
  difficultyHard: { en: "Hard", he: "קשה" },
  difficultyHardDesc: { en: "Edge cases, architecture, deep dives", he: "מקרי קצה, ארכיטקטורה, עומק" },
  difficultyMixed: { en: "Mixed", he: "מעורב" },
  difficultyMixedDesc: { en: "Easy + medium + hard in one session", he: "קל + בינוני + קשה באותה פגישה" },

  interviewType: { en: "Interview type", he: "סוג ראיון" },
  typeTechnical: { en: "Technical", he: "טכני" },
  typeTechnicalDesc: { en: "Role-specific skills & knowledge", he: "ידע ומיומנויות לתפקיד" },
  typeHr: { en: "HR", he: "HR" },
  typeHrDesc: { en: "Motivation, fit & expectations", he: "מוטיבציה, התאמה וציפיות" },
  typeBehavioral: { en: "Behavioral", he: "התנהגותי" },
  typeBehavioralDesc: { en: "Past experiences & soft skills", he: "ניסיון עבר וכישורים רכים" },
  typeMixed: { en: "Mixed", he: "מעורב" },
  typeMixedDesc: { en: "A bit of everything — most realistic", he: "קצת מהכל — הכי קרוב לאמיתי" },
  sessionLength: { en: "Number of questions", he: "מספר שאלות" },
  questionsShort: { en: "Quick", he: "מהיר" },
  questionsStandard: { en: "Standard", he: "רגיל" },
  questionsFull: { en: "Full", he: "מלא" },
  questionsUnit: { en: "questions", he: "שאלות" },
  startInterview: { en: "Start interview", he: "התחל ראיון" },

  // Interview
  questionOf: { en: "Question", he: "שאלה" },
  of: { en: "of", he: "מתוך" },
  followUpPracticeLabel: { en: "Follow-up practice", he: "תרגול המשך" },
  answerPlaceholder: {
    en: "Type your answer here… aim for a few sentences with a concrete example.",
    he: "הקלידו כאן את התשובה… כוונו לכמה משפטים עם דוגמה קונקרטית.",
  },
  tipLabel: { en: "Tip", he: "טיפ" },
  submitAnswer: { en: "Submit answer", he: "שלח תשובה" },
  skipQuestion: { en: "Skip question", he: "דלג על השאלה" },
  endInterview: { en: "End interview", he: "סיים ראיון" },
  recording: { en: "Listening… click to stop", he: "מקשיב… לחצו לעצירה" },
  speakAnswer: { en: "Speak your answer", he: "דברו את התשובה" },
  voiceNotSupported: {
    en: "Voice input isn't supported in this browser",
    he: "קלט קולי לא נתמך בדפדפן זה",
  },
  charCount: { en: "characters", he: "תווים" },

  // Feedback
  feedbackTitle: { en: "Feedback on your answer", he: "פידבק על התשובה שלכם" },
  yourAnswer: { en: "Your answer", he: "התשובה שלכם" },
  skippedAnswer: { en: "You skipped this question.", he: "דילגתם על השאלה הזו." },
  strengths: { en: "What worked well", he: "מה עבד טוב" },
  improvements: { en: "What to improve", he: "מה כדאי לשפר" },
  suggestedAnswer: { en: "Add more detail", he: "כך יכולה להיראות תשובה חזקה יותר" },
  nextQuestion: { en: "Next question", he: "לשאלה הבאה" },
  seeSummary: { en: "See session summary", he: "לסיכום הראיון" },
  scoreLabel: { en: "Score", he: "ציון" },

  // Summary
  summaryTitle: { en: "Interview summary", he: "סיכום הראיון" },
  overallScore: { en: "Overall score", he: "ציון כולל" },
  questionsAnswered: { en: "Answered", he: "נענו" },
  questionsSkipped: { en: "Skipped", he: "דולגו" },
  avgAnswerLength: { en: "Avg. answer length", he: "אורך תשובה ממוצע" },
  words: { en: "words", he: "מילים" },
  recommendations: { en: "Recommendations for next time", he: "המלצות לפעם הבאה" },
  allQuestions: { en: "Your questions & answers", he: "השאלות והתשובות שלכם" },
  showFeedback: { en: "Show feedback", he: "הצג פידבק" },
  hideFeedback: { en: "Hide feedback", he: "הסתר פידבק" },
  practiceAgain: { en: "Practice again (same setup)", he: "תרגלו שוב (אותה הגדרה)" },
  newInterview: { en: "New interview", he: "ראיון חדש" },
  backHome: { en: "Back to home", he: "חזרה לדף הבית" },

  // Score levels
  scoreExcellent: { en: "Excellent", he: "מצוין" },
  scoreGood: { en: "Good", he: "טוב" },
  scoreFair: { en: "Getting there", he: "בדרך הנכונה" },
  scoreNeedsWork: { en: "Needs work", he: "דורש חיזוק" },

  // Confirm dialog
  confirmEndTitle: { en: "End this interview?", he: "לסיים את הראיון?" },
  confirmEndText: {
    en: "You'll go straight to the summary. Unanswered questions will be marked as skipped.",
    he: "תועברו ישירות לסיכום. שאלות שלא נענו יסומנו כמדולגות.",
  },
  confirmEndYes: { en: "Yes, end it", he: "כן, לסיים" },
  confirmEndNo: { en: "Keep practicing", he: "להמשיך לתרגל" },

  footerNote: {
    en: "Practice tool — feedback is generated locally and is meant as guidance, not a real evaluation.",
    he: "כלי תרגול — הפידבק נוצר מקומית ומיועד להכוונה בלבד, לא הערכה אמיתית.",
  },

  // Interviewer personas
  chooseInterviewer: { en: "Choose your interviewer", he: "בחרו את המראיין שלכם" },
  meetInterviewerPanel: { en: "Meet your interview panel", he: "הכירו את צוות המראיינים" },
  assignedInterviewer: { en: "Your assigned interviewer", he: "המראיין שהותאם לראיון שלכם" },
  interviewerNote: {
    en: "Each interviewer has a different focus and style. Scoring is the same for all.",
    he: "לכל מראיין מיקוד וסגנון שונים. הציון זהה אצל כולם.",
  },
  interviewerLabel: { en: "Your interviewer", he: "המראיין שלכם" },
  vibeFocused: { en: "Sharp & technical", he: "חד וטכני" },
  vibeWarm: { en: "Warm & coaching", he: "חם ומלווה" },
  vibeFriendly: { en: "Friendly & human", he: "ידידותי ואנושי" },

  // Home — hero mockup card
  mockBadge: { en: "Live practice", he: "תרגול חי" },
  mockQuestion: {
    en: "Tell me about a project you're proud of…",
    he: "ספרו לי על פרויקט שאתם גאים בו…",
  },
  mockAnswer: {
    en: "In my last role I led a redesign that cut load time by 40%…",
    he: "בתפקיד האחרון הובלתי עיצוב מחדש שקיצר את זמן הטעינה ב-40%…",
  },
  mockClarity: { en: "Clarity", he: "בהירות" },
  mockStructure: { en: "Structure", he: "מבנה" },
  mockImpact: { en: "Impact", he: "אימפקט" },

  // Home — audience cards
  audienceTitle: { en: "Built for wherever you are", he: "מותאם לכל שלב במסע" },
  aud1Title: { en: "Job seekers", he: "מחפשי עבודה" },
  aud1Text: {
    en: "Sharpen answers for the interviews already on your calendar.",
    he: "חדדו תשובות לראיונות שכבר יושבים לכם ביומן.",
  },
  aud2Title: { en: "Career switchers", he: "משני קריירה" },
  aud2Text: {
    en: "Practice telling your story so the transition makes sense to anyone.",
    he: "תרגלו לספר את הסיפור שלכם כך שהמעבר יישמע הגיוני לכל אחד.",
  },
  aud3Title: { en: "Students & juniors", he: "סטודנטים וג'וניורים" },
  aud3Text: {
    en: "Build confidence before your very first real interview.",
    he: "בנו ביטחון לפני הראיון האמיתי הראשון שלכם.",
  },

  // Footer
  footerRights: { en: "© TK - All Rights Reserved", he: "© TK - All Rights Reserved" },
  footerTagline: {
    en: "Practice. Get feedback. Walk in ready.",
    he: "תרגלו. קבלו פידבק. תגיעו מוכנים.",
  },

  // AI evaluation states
  evaluating: { en: "AI feedback is being generated…", he: "פידבק AI נוצר כעת…" },
  aiFeedbackBadge: { en: "AI feedback", he: "פידבק AI" },
  localFeedbackBadge: { en: "Practice feedback", he: "פידבק תרגול" },
  aiFallbackNote: {
    en: "AI is unavailable right now — using local feedback for now.",
    he: "ה-AI אינו זמין כרגע — בינתיים מוצג פידבק מקומי.",
  },
  nextPracticeTip: { en: "Tip for your next practice", he: "טיפ לתרגול הבא" },
  stepLabel1of2: { en: "Step 1 of 2", he: "שלב 1 מתוך 2" },
  stepLabel2of2: { en: "Step 2 of 2", he: "שלב 2 מתוך 2" },
  loadingSummary: { en: "Preparing your summary…", he: "מכין את הסיכום שלך…" },

  // Dashboard
  dashEyebrow: { en: "Practice studio", he: "סטודיו תרגול" },
  dashTitle: { en: "Ready to practice?", he: "מוכנים לתרגל?" },
  dashTitleReturning: { en: "Welcome back 👋", he: "ברוכים השבים 👋" },
  dashWelcomeBack: { en: "Welcome back", he: "ברוכים השבים" },
  dashSubtitle: {
    en: "Short, focused sessions. Honest feedback. Visible progress.",
    he: "סשנים קצרים וממוקדים. פידבק כן. התקדמות שרואים.",
  },
  startNewInterview: { en: "New interview", he: "ראיון חדש" },
  quickStartTitle: { en: "Continue where you left off", he: "להמשיך מאיפה שעצרתם" },
  practiceAgainShort: { en: "Practice again", he: "תרגלו שוב" },
  chooseDifferentRole: { en: "Choose a different role", he: "בחרו תפקיד אחר" },
  lastSessionLabel: { en: "Last session", he: "הסשן האחרון" },
  statStreak: { en: "Day streak", he: "ימים ברצף" },
  statSessions: { en: "Sessions", he: "סשנים" },
  statAvgScore: { en: "Avg. score", he: "ציון ממוצע" },
  statAnswered: { en: "Answers given", he: "תשובות שניתנו" },
  progressTitle: { en: "Score trend", he: "מגמת ציונים" },
  progressHint: { en: "Your last sessions, oldest to newest", he: "הסשנים האחרונים, מהישן לחדש" },
  trendEmptyNone: { en: "Complete a few sessions to see your score trend here.", he: "השלימו כמה סשנים כדי לראות את מגמת הציונים שלכם." },
  trendEmptyFew:  { en: "One more session will reveal your trend line.", he: "עוד סשן אחד יגלה את מגמת ההתקדמות שלכם." },
  trendDeltaUp:   { en: "up since first session", he: "עלייה מהסשן הראשון" },
  trendDeltaDown: { en: "down since first session", he: "ירידה מהסשן הראשון" },
  trendDeltaFlat: { en: "stable across sessions", he: "יציב לאורך הסשנים" },
  trendPts:       { en: "pts", he: "נק'" },
  skillsTitle: { en: "Your skills", he: "הכישורים שלכם" },
  skillsSubtitle: { en: "All sessions", he: "כל התרגולים" },
  strongestLabel: { en: "Strongest", he: "הכי חזק" },
  improveLabel: { en: "Focus next", he: "למקד הלאה" },
  skillsAcross:   { en: "Avg across", he: "ממוצע מ-" },
  skillsSessions: { en: "sessions", he: "סשנים" },
  recommendedTitle: { en: "Next recommended practice", he: "התרגול הבא שכדאי לעשות" },
  recommendedSubtitle: { en: "Based on your last 10 practices", he: "מבוסס על 10 התרגולים האחרונים" },
  recFocusIntro: { en: "The area that can improve your score most right now is", he: "התחום שהכי כדאי לחזק עכשיו הוא" },
  recScoreLabel: { en: "Your score in this area", he: "הציון שלכם בתחום זה" },
  recBelowAvg:  { en: "pts below your overall average — focused practice moves this fastest.", he: "נק' מתחת לממוצע שלכם — תרגול ממוקד יזיז את זה הכי מהר." },
  recAtAvg:     { en: "Consistent with your overall average — keep building on it.", he: "תואם את הממוצע הכללי שלכם — המשיכו לפתח." },
  recAboveAvg:  { en: "This is your strongest area — keep the lead.", he: "זהו התחום החזק ביותר שלכם — שמרו על היתרון." },
  startRecommended: { en: "Start focused practice", he: "התחילו תרגול ממוקד" },
  recCoachingTechnical: {
    en: "Use concrete examples with specific metrics. Precise answers score higher than vague ones.",
    he: "השתמשו בדוגמאות קונקרטיות עם מדדים ספציפיים. תשובות מדויקות מקבלות ציון גבוה יותר.",
  },
  recCoachingBehavioral: {
    en: "Structure answers with Situation → Action → Result. Specifics beat generalities every time.",
    he: "בנו תשובות עם מצב → פעולה → תוצאה. פרטים ספציפיים עדיפים על הכללות.",
  },
  recCoachingHr: {
    en: "Be direct about your goals and expectations. Clarity signals strong self-awareness.",
    he: "היו ישירים לגבי המטרות והציפיות שלכם. בהירות מעידה על מודעות עצמית.",
  },
  recCoachingMixed: {
    en: "Balance technical accuracy with clear communication — both matter in real interviews.",
    he: "איזנו בין דיוק טכני לתקשורת ברורה — שניהם חשובים בראיונות אמיתיים.",
  },
  recommendedReason: {
    en: "Your lowest average is here — a focused session moves it fastest.",
    he: "הממוצע הנמוך ביותר שלכם נמצא כאן — סשן ממוקד יזיז אותו הכי מהר.",
  },
  recentSessionsTitle: { en: "Recent sessions", he: "סשנים אחרונים" },
  recentEmptyNone:     { en: "No scored sessions yet", he: "עדיין אין סשנים עם ציון" },
  qCountShort: { en: "Q", he: "ש'" },
  practiceByRole: { en: "Practice by role", he: "תרגול לפי תפקיד" },
  firstRunTitle: { en: "Your first session takes 10 minutes", he: "הסשן הראשון שלכם לוקח 10 דקות" },
  firstRunText: {
    en: "Pick a role, answer a few real interview questions in your own words, and get concrete feedback on every answer. Your progress will appear here.",
    he: "בחרו תפקיד, ענו על כמה שאלות ראיון אמיתיות במילים שלכם, וקבלו פידבק קונקרטי על כל תשובה. ההתקדמות שלכם תופיע כאן.",
  },
  firstRunCta: { en: "Start your first session", he: "התחילו את הסשן הראשון" },

  // Role card metadata
  minutesShort: { en: "min", he: "דק'" },
  perSessionEstimate: { en: "10–20 min / session", he: "10–20 דק' לסשן" },
  questionsInBank: { en: "questions", he: "שאלות" },

  // Coaching
  vsYourAverage: { en: "vs. your average", he: "לעומת הממוצע שלכם" },
  yourAverageIs: { en: "Your average so far", he: "הממוצע שלכם עד כה" },
  streakKeepGoing: { en: "day streak — keep it going", he: "ימים ברצף — תמשיכו ככה" },
  firstRunStep1: { en: "Pick a role", he: "בוחרים תפקיד" },
  firstRunStep2: { en: "Answer real questions", he: "עונים על שאלות אמיתיות" },
  firstRunStep3: { en: "Get feedback & improve", he: "מקבלים פידבק ומשתפרים" },

  // Persona vibe pills
  vibeSarah: { en: "Architecture & code quality", he: "ארכיטקטורה ואיכות קוד" },
  vibeDaniel: { en: "Decision making", he: "קבלת החלטות" },
  vibeMaya: { en: "Culture fit", he: "התאמה תרבותית" },

  // Brand
  brandTagline: { en: "Practice. Grow. Succeed.", he: "מתרגלים. צומחים. מצליחים." },

  // Stat tile encouragements (labels, not statistics)
  statStreakNote: { en: "Keep it going!", he: "תמשיכו ככה!" },
  statSessionsNote: { en: "Keep practicing", he: "להמשיך לתרגל" },
  statAvgNote: { en: "Keep improving", he: "להשתפר בכל פעם" },
  statAnsweredNote: { en: "Great job!", he: "כל הכבוד!" },

  // Navigation
  navDashboard: { en: "Dashboard", he: "לוח בקרה" },
  navQuestionBank: { en: "Question bank", he: "מאגר שאלות" },
  navProgress: { en: "Progress", he: "התקדמות" },
  navResume: { en: "My resume", he: "קורות החיים שלי" },
  navJobMatch: { en: "Job match", he: "התאמת משרות" },
  navSettings: { en: "Settings", he: "הגדרות" },
  soonBadge: { en: "Soon", he: "בקרוב" },
  menuLabel: { en: "Menu", he: "תפריט" },
  backToDashboard: { en: "Back to dashboard", he: "חזרה ללוח הבקרה" },

  // Coming soon pages
  comingSoonTitle: { en: "Coming soon", he: "בקרוב" },
  resumeSoonText: {
    en: "Upload your resume and get interview questions tailored to your actual experience. This page is planned — nothing here works yet.",
    he: "העלו קורות חיים וקבלו שאלות ראיון מותאמות לניסיון האמיתי שלכם. העמוד מתוכנן — שום דבר כאן עוד לא פעיל.",
  },
  jobMatchSoonText: {
    en: "Paste a job description and practice the interview for that exact role. This page is planned — nothing here works yet.",
    he: "הדביקו תיאור משרה ותרגלו את הראיון לתפקיד המדויק הזה. העמוד מתוכנן — שום דבר כאן עוד לא פעיל.",
  },

  // Question bank page
  qbTitle: { en: "Question bank", he: "מאגר השאלות" },
  qbSubtitle: {
    en: "Browse every question you can practice, with model answers.",
    he: "עיינו בכל השאלות שאפשר לתרגל, כולל תשובות לדוגמה.",
  },
  qbShowAnswer: { en: "Show model answer", he: "הצגת תשובה לדוגמה" },
  qbHideAnswer: { en: "Hide model answer", he: "הסתרת התשובה" },
  qbSharedNote: {
    en: "HR and behavioral questions are shared across all roles.",
    he: "שאלות HR והתנהגותיות משותפות לכל התפקידים.",
  },

  // Progress page
  progressPageTitle: { en: "Your progress", he: "ההתקדמות שלכם" },
  progressPageSubtitle: {
    en: "Everything here is computed from your real practice sessions on this device.",
    he: "כל מה שכאן מחושב מסשני התרגול האמיתיים שלכם במכשיר הזה.",
  },
  progressEmpty: {
    en: "No sessions yet — your progress will appear here after your first interview.",
    he: "עוד אין סשנים — ההתקדמות תופיע כאן אחרי הראיון הראשון.",
  },
  allSessions:      { en: "All sessions", he: "כל הסשנים" },
  progFilterAll:    { en: "All", he: "הכל" },
  progCatEmptyNone: { en: "No sessions of this type yet", he: "עדיין אין סשנים מסוג זה" },
  progCatEmptyFew:  { en: "Complete one more session to see your trend", he: "השלם/י עוד סשן אחד כדי לראות את המגמה" },

  // Settings page
  settingsTitle: { en: "Settings", he: "הגדרות" },
  settingsLanguage: { en: "Language", he: "שפה" },
  settingsData: { en: "Practice data", he: "נתוני תרגול" },
  settingsDataNote: {
    en: "All practice data is stored only in this browser — nothing is sent anywhere.",
    he: "כל נתוני התרגול נשמרים בדפדפן הזה בלבד — שום דבר לא נשלח לשום מקום.",
  },
  clearHistory: { en: "Clear practice history", he: "מחיקת היסטוריית התרגול" },
  clearConfirm: { en: "Click again to confirm", he: "לחצו שוב לאישור" },
  clearedNote: { en: "Practice history cleared.", he: "היסטוריית התרגול נמחקה." },

  // Sidebar collapse
  sidebarCollapse: { en: "Collapse sidebar", he: "כיווץ סרגל הצד" },
  sidebarExpand: { en: "Expand sidebar", he: "הרחבת סרגל הצד" },

  // ---- Follow-up coaching ----
  followUpBadge: { en: "Try this follow-up", he: "נסה/י שאלת המשך" },
  practiceThisAngle: { en: "Practice this angle", he: "תרגל/י את הזווית הזו" },

  // ---- Resume page ----
  resumeUploadTitle: { en: "Upload your resume", he: "העלאת קורות חיים" },
  resumeUploadHint: {
    en: "PDF supported. Click to browse or drag and drop.",
    he: "PDF נתמך. לחצו לבחירה או גררו לכאן.",
  },
  resumeUploadAccept: { en: "Choose file", he: "בחרו קובץ" },
  resumeUploading: { en: "Reading file…", he: "קורא קובץ…" },
  resumeUploadSuccess: { en: "File read successfully", he: "הקובץ נקרא בהצלחה" },
  resumeUploadErrorDocx: {
    en: "DOCX support coming soon — paste your text below for now.",
    he: "תמיכה ב-DOCX בקרוב — בינתיים הדבק/י את הטקסט למטה.",
  },
  resumeUploadErrorGeneric: {
    en: "Could not read the file. Try a different PDF or paste the text.",
    he: "לא ניתן לקרוא את הקובץ. נסה/י PDF אחר או הדבק/י את הטקסט.",
  },
  resumeCloudSaving: { en: "Saving to cloud…", he: "שומר לענן…" },
  resumeCloudSaved: { en: "Saved to cloud", he: "נשמר לענן" },
  resumeCloudError: { en: "Cloud save failed — data is still local", he: "שמירה לענן נכשלה — הנתונים שמורים מקומית" },
  resumeSignInToSync: {
    en: "Sign in to sync your resume across devices.",
    he: "היכנסו כדי לסנכרן את קורות החיים בין המכשירים.",
  },
  resumeLastSaved: { en: "Last saved", he: "שמירה אחרונה" },
  resumeTitle: { en: "My Resume", he: "קורות חיים" },
  resumeSubtitle: {
    en: "Paste your resume text to extract keywords and use it for job matching.",
    he: "הדבק/י את טקסט קורות החיים שלך לחילוץ מילות מפתח ולשימוש בהתאמה לעבודה.",
  },
  resumePrivacyNote: { en: "Your resume is saved on your device only. It is never shared with any server unless you choose to run a Job Match analysis.", he: "קורות החיים שלך נשמרים במכשיר שלך בלבד. הם לא נשלחים לשרת כלשהו אלא אם תבחר/י להריץ ניתוח התאמה למשרה." },
  resumePasteLabel: { en: "Resume text", he: "טקסט קורות החיים" },
  resumeTextareaPlaceholder: {
    en: "Paste your resume here — plain text works best. Include your skills, experience, projects, and education.",
    he: "הדבק/י כאן את קורות החיים — טקסט פשוט עובד הכי טוב. כלול/י כישורים, ניסיון, פרויקטים והשכלה.",
  },
  resumeSave: { en: "Save resume", he: "שמור קורות חיים" },
  resumeSaved: { en: "Saved!", he: "נשמר!" },
  resumeClear: { en: "Clear", he: "נקה" },
  resumeKeywordsTitle: { en: "Extracted keywords", he: "מילות מפתח שחולצו" },
  resumeKeywordsEmpty: {
    en: "Keywords will appear here after you save your resume.",
    he: "מילות מפתח יופיעו כאן לאחר שמירת קורות החיים.",
  },
  resumeKeywordsNote: {
    en: "Detected locally — no AI needed.",
    he: "זוהו מקומית — ללא AI.",
  },
  resumeTipTitle: { en: "Tips for better matching", he: "טיפים לשיפור ההתאמה" },
  resumeTip1: {
    en: "Use specific technology names (React, Node.js, PostgreSQL) — not just categories.",
    he: "השתמש/י בשמות טכנולוגיות ספציפיים (React, Node.js, PostgreSQL) — לא רק קטגוריות.",
  },
  resumeTip2: {
    en: "Quantify results where possible: 'Reduced load time by 40%' beats 'improved performance'.",
    he: "כמת/י תוצאות היכן שניתן: 'צמצמתי זמן טעינה ב-40%' עדיף על 'שיפרתי ביצועים'.",
  },
  resumeTip3: {
    en: "Include 2-3 real project descriptions with your role and the outcome.",
    he: "כלול/י 2-3 תיאורי פרויקטים אמיתיים עם תפקידך והתוצאה.",
  },

  // ---- Job Match page ----
  jobMatchTitle: { en: "Job Match", he: "התאמת משרה" },
  jobMatchSubtitle: {
    en: "Paste your resume and a job description to get an AI-powered match analysis.",
    he: "הדבק/י קורות חיים ותיאור משרה לניתוח התאמה מבוסס AI.",
  },
  matchPrivacyNote: {
    en: "Your resume and job description are sent to the AI only when you click Analyze Match. They are not stored on our servers.",
    he: "קורות החיים ותיאור המשרה שלך נשלחים ל-AI רק בעת לחיצה על 'ניתוח התאמה'. הם אינם נשמרים בשרתים שלנו.",
  },
  matchResumeLabel: { en: "Your resume", he: "קורות החיים שלך" },
  matchResumeHint: {
    en: "Save your resume on the Resume page to pre-fill this field.",
    he: "שמור/י קורות חיים בעמוד קורות החיים כדי למלא שדה זה מראש.",
  },
  matchResumePlaceholder: { en: "Paste your resume text here…", he: "הדבק/י כאן את טקסט קורות החיים…" },
  matchJobLabel: { en: "Job description", he: "תיאור המשרה" },
  matchJobPlaceholder: { en: "Paste the job description here…", he: "הדבק/י כאן את תיאור המשרה…" },
  matchAnalyzeBtn: { en: "Analyze Match", he: "ניתוח התאמה" },
  matchAnalyzing: { en: "Analyzing…", he: "מנתח…" },
  matchCtaHint: {
    en: "Enter at least 20 characters in both fields to analyze.",
    he: "הזן/י לפחות 20 תווים בשני השדות כדי לנתח.",
  },
  matchGenericError: {
    en: "Something went wrong. Please try again.",
    he: "משהו השתבש. אנא נסה/י שוב.",
  },
  matchScoreLabel: { en: "Match score", he: "ציון התאמה" },
  matchSourceAI: { en: "AI analysis", he: "ניתוח AI" },
  matchSourceLocal: { en: "Local analysis", he: "ניתוח מקומי" },
  matchAIUnavailable: {
    en: "AI unavailable — using keyword overlap analysis.",
    he: "AI לא זמין — משתמש בניתוח חפיפת מילות מפתח.",
  },
  matchTailoredFocus: { en: "Your interview focus", he: "הפוקוס שלך לראיון" },
  matchRecommendedTopics: { en: "Recommended practice topics", he: "נושאי תרגול מומלצים" },
  matchStrengths: { en: "Your strengths for this role", he: "החוזקות שלך לתפקיד זה" },
  matchGaps: { en: "Gaps to address", he: "פערים לטיפול" },
  matchPreparationPlan: { en: "Preparation plan", he: "תוכנית הכנה" },
  matchSaved: { en: "Saved", he: "נשמר" },
  matchLoadingResume: { en: "Loading your resume…", he: "טוען קורות חיים…" },
  matchRestoredNote: { en: "From previous analysis", he: "מניתוח קודם" },
  matchStartTailoredTitle: { en: "Ready to practice?", he: "מוכן/ה לתרגל?" },
  matchStartTailoredDesc: {
    en: "Start an interview tailored to the gaps and topics identified above.",
    he: "התחל/י ראיון מותאם לפערים ולנושאים שזוהו למעלה.",
  },
  matchStartTailoredBtn: { en: "Start tailored interview", he: "התחל/י ראיון מותאם" },
  // ---- Setup — tailored mode ----
  setupTailoredBanner: {
    en: "Tailored from your job match ({score}% fit) — questions will focus on your identified gaps.",
    he: "מותאם מהתאמת המשרה שלך ({score}% התאמה) — השאלות יתמקדו בפערים שזוהו.",
  },
  // ---- Auth ----
  signInTitle: { en: "Sign in to InterviewSim", he: "כניסה ל-InterviewSim" },
  signInSubtitle: {
    en: "Enter your email — we'll send you a magic link. No password needed.",
    he: "הכנס/י את האימייל שלך — נשלח לך קישור קסם. ללא סיסמה.",
  },
  signInEmailLabel: { en: "Email address", he: "כתובת אימייל" },
  signInEmailPlaceholder: { en: "your@email.com", he: "your@email.com" },
  signInSendBtn: { en: "Send magic link", he: "שליחת קישור קסם" },
  signInSending: { en: "Sending…", he: "שולח…" },
  signInSentTitle: { en: "Check your email", he: "בדוק/י את האימייל" },
  signInSentBody: {
    en: "We sent a sign-in link to {email}. Click it to continue.",
    he: "שלחנו קישור כניסה אל {email}. לחץ/י עליו כדי להמשיך.",
  },
  signInNote: { en: "No password. No spam.", he: "ללא סיסמה. ללא ספאם." },
  signInGuestLink: { en: "Continue as guest", he: "המשך כאורח/ת" },
  signInError: { en: "Something went wrong — please try again.", he: "משהו השתבש — נסה/י שוב." },
  signIn: { en: "Sign in", he: "כניסה" },
  signOut: { en: "Sign out", he: "יציאה" },
  signedInAs: { en: "Signed in as", he: "מחובר/ת כ-" },
  signInToSave: { en: "Sign in to save progress", he: "היכנס/י כדי לשמור התקדמות" },
  sessionSavedCloud: { en: "Saved to your account", he: "נשמר לחשבון שלך" },
  closeLabel: { en: "Close", he: "סגור" },

  // ---- Auth v2 (email + password) ----
  authLoginTitle:    { en: "Welcome back", he: "ברוכ/ה השב/ה" },
  authLoginSubtitle: { en: "Sign in to save your interview history.", he: "התחבר/י כדי לשמור את היסטוריית הראיונות שלך." },
  authSignUpTitle:    { en: "Create your account", he: "יצירת חשבון" },
  authSignUpSubtitle: { en: "Start tracking your interview practice.", he: "התחל/י לעקוב אחר תרגול הראיונות שלך." },
  authForgotTitle:    { en: "Reset your password", he: "איפוס סיסמה" },
  authForgotSubtitle: { en: "We\u2019ll send a reset link to your email.", he: "נשלח קישור לאיפוס לאימייל שלך." },
  authUpdatePasswordTitle:    { en: "Set new password", he: "הגדרת סיסמה חדשה" },
  authUpdatePasswordSubtitle: { en: "Choose a new password for your account.", he: "בחר/י סיסמה חדשה לחשבון שלך." },
  authPasswordLabel:          { en: "Password", he: "סיסמה" },
  authPasswordPlaceholder:    { en: "Your password", he: "הסיסמה שלך" },
  authNewPasswordPlaceholder: { en: "New password (min 6 chars)", he: "סיסמא חדשה (לפחות 6 תווים)" },
  authLoginBtn:           { en: "Sign in", he: "כניסה" },
  authSignUpBtn:          { en: "Sign up", he: "הרשמה" },
  authForgotBtn:          { en: "Send reset link", he: "שליחת קישור לאיפוס" },
  authUpdatePasswordBtn:  { en: "Update password", he: "עדכון סיסמא" },
  authSubmitting:         { en: "Please wait…", he: "אנא המתן/י…" },
  authForgotLink:         { en: "Forgot password?", he: "שכחת סיסמא?" },
  authNoAccount:          { en: "Don't have an account?", he: "אין לך חשבון?" },
  authHaveAccount:        { en: "Already have an account?", he: "יש לך חשבון?" },
  authBackToLogIn:        { en: "Back to log in", he: "חזרה להתחברות" },
  matchHistoryTitle:       { en: "Recent Matches", he: "התאמות אחרונות" },
  matchHistoryEmpty:       { en: "No saved matches yet. Run an analysis to get started.", he: "אין התאמות שמורות עדיין. הפעל/י ניתוח כדי להתחיל." },
  matchHistoryView:        { en: "View", he: "הצג/י" },
  matchHistoryScore:       { en: "Match", he: "התאמה" },
  matchHistoryGaps:        { en: "gap", he: "פער" },
  matchHistoryGapsPlural:  { en: "gaps", he: "פערים" },
  matchHistoryStrengths:   { en: "strength", he: "חוזקה" },
  matchHistoryStrengthsPlural: { en: "strengths", he: "חוזקות" },
  matchHistoryLoading:    { en: "Loading your match history…", he: "טוען היסטוריית ההתאמות…" },
  setupGenerating: { en: "Preparing your questions…", he: "מכין/ה את השאלות…" },

  // ---- Generating / loading screen ----
  generatingTailoredTitle: { en: "Preparing your tailored interview...", he: "מכין ראיון מותאם..." },
  generatingTailoredBody:  { en: "We are generating questions based on your job match gaps.", he: "אנחנו מייצרים שאלות לפי הפערים מהמשרה שלך." },
  generatingNote:          { en: "This may take a few seconds.", he: "זה יכול לקחת כמה שניות." },
  generatingRegularTitle:  { en: "Preparing your interview...", he: "מכין את הראיון..." },
  generatingRegularBody:   { en: "We are generating questions for your session.", he: "אנחנו מייצרים שאלות לסשן שלך." },
  generatingErrorTitle:    { en: "Something went wrong", he: "משהו השתבש" },
  generatingErrorBody:     { en: "We couldn\u2019t generate your questions. Please try again.", he: "לא הצלחנו לייצר את השאלות. נסה/י שוב." },
  generatingRetryBtn:      { en: "Try again", he: "נסה/י שוב" },
  sessionDetailSummary:         { en: "Session Summary", he: "סיכום סשן" },
  sessionDetailRecommendations:  { en: "Recommendations", he: "המלצות" },
  sessionDetailPerType:          { en: "Performance by Type", he: "ביצועים לפי סוג" },
  sessionDetailView:             { en: "Details", he: "פרטים" },
  sessionDetailClose:            { en: "Close", he: "סגור" },
  sessionDetailNoData:           { en: "No details saved for this session.", he: "לא נשמרו פרטים לסשן זה." },
  sessionHistoryLoading:         { en: "Loading session history…", he: "טוען היסטוריית סשנים…" },

  // ---- Tailored interview metadata ----
  tailoredBadge:        { en: "Tailored Interview", he: "ראיון מותאם" },
  tailoredFocusCount:   { en: "focus areas", he: "תחומי מיקוד" },
  tailoredMatchScore:   { en: "match", he: "התאמה" },
  tailoredFallbackNote: { en: "AI unavailable — using general questions, not tailored to your gaps.", he: "ה-AI אינו זמין — השאלות הן כלליות ולא מותאמות לפערים שלך." },

  // ---- Focus area coverage (SummaryScreen) ----
  coverageTitle:       { en: "Focus Area Coverage", he: "כיסוי תחומי המיקוד" },
  coverageSubtitle:    { en: "Based on the job-match gaps identified for this interview.", he: "בהתבסס על הפערים שזוהו בניתוח ההתאמה לתפקיד." },
  coverageOf:          { en: "of", he: "מתוך" },
  coverageCovered:     { en: "focus areas covered", he: "תחומי מיקוד נכוסו" },
  // ---- Job Match ----
  clearJobBtn: { en: "Clear job", he: "נקה משרה" },

  // ---- Hero card: AI-first focus headline ----
  heroCtxLabel:         { en: "Next interview focus",       he: "מיקוד לראיון" },
  heroRecoLabel:        { en: "Next focus",                   he: "המיקוד הבא" },
  heroFocusTechnical:   { en: "Technical interview practice",   he: "תרגול ראיון טכני" },
  heroFocusBehavioral:  { en: "Behavioral interview practice", he: "תרגול ראיון התנהגותי" },
  heroFocusHr:          { en: "HR interview practice",         he: "תרגול ראיון HR" },
  heroFocusMixed:       { en: "Mixed interview practice",      he: "תרגול ראיון מעורב" },

  heroPracticeVerb:     { en: "Practice",                                                           he: "תרגל" },
  heroChangeRole:       { en: "Change role",                                                        he: "שנה תפקיד" },
  heroLastPractice:     { en: "Last practice",                                                      he: "תרגול אחרון" },
  heroDaysAgo:          { en: " days ago",                                                          he: " ימים לפני" },

  // ---- Hero evidence sentences (single sentence, hero only) ----
  heroEv_stale_pre:     { en: "You haven't practiced ",                                             he: "" },
  heroEv_stale_1:       { en: " in ",                                                               he: " לא תורגלה מזה " },
  heroEv_stale_2:       { en: " days. This is your highest-priority practice right now.",           he: " ימים. זה התחום בעדיפות הגבוהה ביותר שלך כרגע." },
  heroEv_declLowest_pre:{ en: "Your ",                                                              he: "" },
  heroEv_declLowest_1:  { en: " scores dropped ",                                                   he: " ירדה ב–" },
  heroEv_declLowest_2:  { en: " pts — now your lowest and highest-impact practice.",           he: " נקודות — עכשיו הנמוכה ביותר ובעלת השפעה הגבוהה." },
  heroEv_decl_pre:      { en: "Your ",                                                              he: "" },
  heroEv_decl_1:        { en: " scores have dropped ",                                              he: " ירדה ב–" },
  heroEv_decl_2:        { en: " pts recently. Address it before the gap grows.",                   he: " נקודות לאחרונה. טפל בזה לפני שהפער יגדל." },
  heroEv_new_pre:       { en: "You've only logged ",                                               he: "רק " },
  heroEv_new_1:         { en: " ",                                                                  he: " " },
  heroEv_new_2:         { en: " sessions in. Build a baseline to understand where you stand.",      he: " סשנים. בנה בסיס כדי להבין איפה אתה עומד." },
  heroEv_lowest_1:      { en: " is your lowest area at ",                                           he: " הוא התחום הנמוך ביותר — " },
  heroEv_lowest_2:      { en: " — improving it is your highest-impact practice.",              he: " — שיפורו הוא התרגול בעל ההשפעה הגבוהה." },
  heroEv_default:       { en: "This is your highest-priority interview practice right now.",        he: "זה התחום בעדיפות הגבוהה ביותר שלך כרגע." },

  // ---- Skill Focus card ----
  skillFocusTitle:    { en: "Skill Focus",               he: "מיקוד לתרגול" },
  sfTrendStable:      { en: "→ stable",                 he: "→ יציב" },
  sfTrendNew:         { en: "new",                       he: "חדש" },
  sfTrendStale:       { en: "not practiced recently",    he: "לא תורגל לאחרונה" },
  sfRecommendedLabel: { en: "Recommended focus",         he: "מיקוד מומלץ" },
  sfStartFocused:     { en: "Start focused practice",    he: "התחל תרגול ממוקד" },
  sfFocus:            { en: "Focus",                     he: "מיקוד" },

  // ---- Skill Focus card: reason strings ----
  sfReason_stale:         { en: " hasn't been practiced in ",                                                          he: " לא תורגלה מזה " },
  sfReason_staleDays:     { en: " days. Skills fade without practice \u2014 time for a refresh.",                       he: " ימים. כישורים נשחקים ללא תרגול \u2014 הגיע זמן לרענון." },
  sfReason_declLowest_1:  { en: " dropped ",                                                                              he: " ירדה ב\u2013" },
  sfReason_declLowest_2:  { en: " points recently and is your weakest area. Focused practice now recovers this fastest.", he: " נקודות לאחרונה והיא האזור החלש שלך. תרגול ממוקד כאן יחזיר אותך הכי מהר." },
  sfReason_decl_1:        { en: " dropped ",                                                                              he: " ירדה ב\u2013" },
  sfReason_decl_2:        { en: " points in your last sessions. Focused practice now stops the decline before it becomes a gap.", he: " נקודות בתרגולים האחרונים. תרגול ממוקד יעצור את הירידה לפני שהיא הופכת לפער." },
  sfReason_new_1:         { en: "Only ",                                                                                  he: "רק " },
  sfReason_new_2:         { en: " sessions recently. Build a baseline to understand where you really stand.",             he: " תרגולים לאחרונה. בנה בסיס כדי להבין איפה אתה עומד באמת." },
  sfReason_lowest_1:      { en: " is your lowest recent average at ",                                                     he: " הוא הממוצע הנמוך ביותר לאחרונה \u2014 " },
  sfReason_lowest_2:      { en: ". Bringing it up gives your overall score the biggest lift.",                            he: ". שיפורו נותן את הדחיפה הגדולה ביותר לציון הכולל שלך." },
  sfReason_default:       { en: "Practice this category next to keep improving your balance.",                            he: "תרגל קטגוריה זו כדי לשמור על האיזון שלך." },

  // ---- Auth screen ----
  authSignUpSentTitle:  { en: "Check your email", he: "בדקו את תיבת הדואר שלכם" },
  authSignUpSentBody:   { en: "We sent a confirmation link to your email.", he: "שלחנו קישור אישור לכתובת האימייל שלכם." },
  authErrorInvalidEmail: { en: "Please enter a valid email address.", he: "נסו להזין כתובת אימייל תקינה." },
  authErrorGeneric:      { en: "Something went wrong. Please try again.", he: "משהו השתבש. נסו שוב." },
};

export default STRINGS;
