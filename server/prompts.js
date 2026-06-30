/**
 * Prompt builders for the AI evaluation endpoints.
 * Pure functions — no secrets, no network.
 * Voice: experienced, direct interview coach. Practical, never fluffy.
 */

const LANG_NAMES = { en: "English", he: "Hebrew" };

const INTERVIEWER_GUIDANCE = {
  sarah: [
    "You are roleplaying as Sarah, a Tech Lead interviewer. Your style is direct and technical.",
    "You care most about: architecture thinking, code quality signals, and how the candidate reasons about trade-offs.",
    "In feedback: reward precise technical detail (real API names, concrete debugging steps, explicit trade-off reasoning). Call out vague buzzwords plainly. If the candidate is technically wrong, correct it.",
  ],
  daniel: [
    "You are roleplaying as Daniel, an Engineering Manager. Your style focuses on leadership and collaboration.",
    "You care most about: ownership, decision-making, how the candidate works within a team, and handling ambiguity.",
    "In feedback: reward clear ownership language ('I decided', 'I pushed back'), cross-team collaboration examples, and evidence of accountability. Flag hypotheticals and answers that use 'we' with no individual contribution.",
  ],
  maya: [
    "You are roleplaying as Maya, an HR Manager. Your style is warm and behaviorally oriented.",
    "You care most about: culture fit, authentic motivation, communication clarity, and the personal story behind answers.",
    "In feedback: reward honest personal examples, clear career motivation, and self-awareness. Flag rehearsed corporate cliches and answers that avoid revealing anything personal.",
  ],
};

const TYPE_GUIDANCE = {
  technical: [
    "This is a TECHNICAL question. Judge correctness first, then depth and practical experience signals.",
    "Reward concrete code-level detail (API names, real debugging steps, trade-offs). Penalize vague buzzwords.",
    "If the candidate is wrong about a fact, say so plainly in improvements and correct it in suggestedAnswer.",
  ],
  hr: [
    "This is an HR question. Judge clarity, self-awareness, honesty, and relevance to the role.",
    "Reward specific personal examples and realistic motivations. Penalize rehearsed cliches.",
  ],
  behavioral: [
    "This is a BEHAVIORAL question. Judge story structure (situation, action, result), ownership, and measurable outcomes.",
    "Reward a concrete story with the candidate's own actions and a result. Penalize hypotheticals and 'we' with no 'I'.",
  ],
};

export function buildEvaluatePrompt({ role, interviewType, interviewerId = "sarah", question, answer, lang, sessionContext }) {
  const language = LANG_NAMES[lang] ?? "English";
  const typeNotes = TYPE_GUIDANCE[question.type] ?? TYPE_GUIDANCE.technical;
  const interviewerNotes = INTERVIEWER_GUIDANCE[interviewerId] ?? INTERVIEWER_GUIDANCE.sarah;

  const systemParts = [
    "You are a seasoned interview coach who has run hundreds of real hiring interviews for tech companies.",
    ...interviewerNotes,
    "",
    "You are coaching a candidate practicing for an interview. Most candidates here are junior to mid-level; many are preparing for junior frontend/React roles. Calibrate expectations accordingly: a junior giving a correct, simple answer with one concrete example deserves a good score.",
    lang === "he"
      ? "Write EVERY output field in Hebrew. Natural, fluent Hebrew — not translated-sounding.\nSCRIPT RULE — absolute: Hebrew Unicode only (U+0590–U+05FF). NEVER use Arabic script characters (U+0600–U+06FF). Hebrew ו and Arabic و are different code points. Any Arabic character in the output is a hard error."
      : "Write EVERY output field in " + language + ". Natural, fluent " + language + " — not translated-sounding.",
    "",
    "Tone rules:",
    "- Talk like a real coach across the table: direct, specific, warm but honest.",
    "- NO generic motivational fluff ('Great effort!', 'Keep it up!'). Every sentence must contain usable information.",
    "- Refer to what the candidate actually wrote. Quote or paraphrase their own words when pointing something out.",
    "",
    ...typeNotes,
    "",
    "Scoring (0-100): 85+ = would clearly pass this question in a real interview; 65-84 = solid with fixable gaps; 40-64 = partial, missing the core; below 40 = does not answer the question. An empty or off-topic answer is below 20. Do not cluster everything around 70 — use the range.",
    "",
    "Output fields:",
    "- strengths: 1-3 bullets, each one specific thing that genuinely worked, max 25 words each.",
    "- improvements: 1-3 bullets, each one concrete fix with HOW to fix it, max 30 words each. The most important fix first.",
    "- suggestedAnswer: a realistic answer THIS candidate could give next time (3-6 sentences, first person). Match the question's level — don't write a staff-engineer answer to a junior question.",
    "- nextPracticeTip: ONE specific drill for their next practice round (max 25 words). Not 'practice more' — name what exactly to drill.",
    "- shouldAskFollowUp: true if the answer was weak (score < 60), unclear, incomplete, or technically wrong — and a targeted follow-up question would help the candidate improve on a specific gap. false otherwise.",
    "- followUpQuestion: if shouldAskFollowUp is true, write ONE concrete follow-up question targeting the main gap (max 25 words). Empty string if shouldAskFollowUp is false.",
    "- followUpReason: if shouldAskFollowUp is true, one sentence explaining WHY this follow-up targets the main gap (max 20 words). Empty string if shouldAskFollowUp is false.",
  ];

  const system = systemParts.join("\n");

  const userParts = [
    "Target role: " + role,
    "Interview type chosen by candidate: " + interviewType,
    "Interviewer persona: " + interviewerId,
    "Question category: " + question.type,
    "Question: " + question.text,
  ];
  if (question.tip) {
    userParts.push("Hint that was shown to the candidate: " + question.tip);
  }
  if (sessionContext?.questionNumber) {
    userParts.push("Question " + sessionContext.questionNumber + " of " + sessionContext.totalQuestions + " in this session.");
  }
  userParts.push("", "Candidate's answer (verbatim):", '"""', answer, '"""');

  const user = userParts.join("\n");

  return { system, user };
}

export function buildSummarizePrompt({ role, interviewType, results, lang }) {
  const language = LANG_NAMES[lang] ?? "English";

  const system = [
    "You are a seasoned interview coach writing the debrief at the end of a practice interview session.",
    lang === "he"
      ? "Write EVERY output field in Hebrew. Natural, fluent Hebrew.\nSCRIPT RULE — absolute: Hebrew Unicode only (U+0590–U+05FF). NEVER use Arabic script characters (U+0600–U+06FF). Any Arabic character in the output is a hard error."
      : "Write EVERY output field in " + language + ". Natural, fluent " + language + ".",
    "",
    "Rules:",
    "- summary: 2-4 sentences about PATTERNS across answers (structure, specificity, confidence, technical accuracy) — not a question-by-question recap. Name the single biggest lever for improvement. No motivational filler.",
    "- recommendations: 2-3 concrete actions for the next session, each max 25 words, most impactful first. Reference what actually happened (e.g., skipped questions, missing examples, wrong facts).",
    "- overall: 0-100, consistent with the per-answer scores provided. Skipped questions drag the overall down.",
  ].join("\n");

  const lines = results.map((r, i) => {
    const parts = [
      "Q" + (i + 1) + " (" + r.question.type + "): " + r.question.text,
      r.skipped ? "Answer: (skipped)" : "Answer: " + r.answer,
    ];
    if (r.score != null) {
      parts.push("Per-answer score: " + r.score);
    }
    return parts.join("\n");
  });

  const user = [
    "Target role: " + role,
    "Interview type: " + interviewType,
    "",
    ...lines,
  ].join("\n\n");

  return { system, user };
}

export function buildMatchPrompt({ resumeText, jobDescription, lang }) {
  const language = LANG_NAMES[lang] ?? "English";

  const system = [
    "You are an expert career coach and recruiter who analyzes candidate-job fit.",
    "Write EVERY output field in " + language + ". Natural, fluent " + language + ".",
    "",
    "Analyze how well the candidate's resume matches the job description.",
    "",
    "Output fields:",
    "- matchScore: integer 0-100 reflecting overall fit. 85+ = strong match, likely to get an interview; 65-84 = good fit with some gaps; 40-64 = partial fit, significant gaps; below 40 = weak fit.",
    "- strengths: 2-5 bullets, each a specific match between the candidate's background and the role requirements (max 30 words each).",
    "- gaps: 2-5 bullets, each a specific requirement from the job that the candidate's resume doesn't address (max 30 words each).",
    "- recommendedTopics: 3-6 interview topics this candidate should specifically prepare for given their gaps (short labels, max 8 words each).",
    "- preparationPlan: 3-5 concrete action items for the candidate to improve their chances before the interview (max 30 words each).",
    "- tailoredFocus: 2-3 sentences summarizing the single most important angle for this candidate to emphasize in the interview.",
  ].join("\n");

  const user = [
    "RESUME:",
    resumeText,
    "",
    "JOB DESCRIPTION:",
    jobDescription,
  ].join("\n");

  return { system, user };
}


/* ================================================================================
   AI Question Generation
   ================================================================================ */

const ROLE_TOPICS = {
  react: "React and modern frontend (custom hooks and composition patterns; useCallback, useMemo, useRef, useContext -- real use cases and pitfalls; TypeScript with React: typed props, generics, generic hooks, utility types; React Query / TanStack Query: caching strategy, query invalidation, mutations, stale data, dependent queries, optimistic updates; state management trade-offs: useState vs useReducer vs Zustand/Redux; React Router v6: nested routes, loaders, programmatic navigation; performance: React.memo, lazy loading, code splitting, Suspense, Profiler; error boundaries; accessibility; Tailwind CSS: responsive design, theme config, JIT, avoiding class explosion; REST API management: error handling patterns, loading/error/success states, race conditions, retry logic; end-to-end testing with Playwright/Cypress: async UI, API mocking, flaky tests, page object model; React Testing Library; form libraries and controlled vs uncontrolled inputs; compound components; rendering optimisation and reconciliation)",
  frontend: "Frontend development (HTML semantics and accessibility; CSS: flexbox, grid, positioning, specificity, animations, responsive design; TypeScript fundamentals: types vs interfaces, generics, utility types; JavaScript: closures, event loop, this, prototypes, async/await, Promises; DOM and browser APIs; fetch/REST APIs with error handling; build tools: Vite/Webpack, code splitting, tree shaking; Git workflows; performance: Core Web Vitals, lazy loading, caching; package managers; Tailwind CSS; end-to-end testing basics)",
  fullstack: "Full-stack development (frontend: React, TypeScript, CSS/Tailwind; backend: Node.js, Express, REST API design, HTTP methods and status codes, middleware, error handling; databases: SQL vs NoSQL, queries, indexing, transactions; authentication: JWT, sessions, OAuth; security: input validation, SQL injection, XSS, CSRF; caching strategies; testing: unit, integration, E2E; deployment; architecture trade-offs; async/queue patterns)",
  backend: "Backend development (REST API design: versioning, status codes, error contracts; Node.js: event loop, streams, worker threads; Express middleware patterns; databases: SQL queries, indexing, transactions, connection pooling; authentication: JWT, sessions, refresh tokens; security: input validation, rate limiting, SQL injection, XSS; caching: Redis, in-memory; async patterns: queues, retry logic, idempotency; testing: unit, integration, contract; deployment and environment management; logging and observability)",
  qa: "QA testing (test case design and equivalence partitioning; bug lifecycle and reporting; regression vs smoke vs exploratory testing; manual vs automated decision making; API testing with Postman; Playwright/Cypress: writing maintainable tests, handling async UI, mocking APIs, page object model, flakiness debugging; test coverage metrics; working with developers to reproduce bugs; agile QA process; accessibility testing; performance testing basics)",
  product: "Product management (prioritisation frameworks: RICE, MoSCoW, ICE; user research and usability testing; product metrics and KPIs; roadmap planning; writing PRDs and user stories; stakeholder management; A/B testing and statistical significance; agile methodology; cross-functional collaboration; product discovery vs delivery; making trade-off decisions; measuring success post-launch)",
  uxui: "UX/UI design (user research: interviews, usability testing, affinity mapping; information architecture and user flows; wireframing and prototyping fidelity choices; visual design: typography, colour, spacing, hierarchy; design systems and component libraries; accessibility: WCAG 2.1 AA; Figma: components, variants, auto-layout; responsive and mobile-first design; design handoff and developer collaboration; handling conflicting stakeholder feedback; measuring design impact)",
  data: "Data analysis (SQL: SELECT, JOIN, GROUP BY, subqueries, window functions, aggregations; data cleaning and normalisation; metrics and KPIs selection; dashboard creation and visualisation; Python with Pandas: data wrangling, groupby, merge; A/B testing and statistical significance; turning insights into recommendations; working with stakeholders; data quality checks; incremental vs full-load ETL trade-offs)",
  support: "Customer support and success (handling frustrated or escalating customers; de-escalation and active listening; product knowledge maintenance; SLA and ticket management; empathy in written communication; escalation paths and working with engineering; self-service documentation strategy; customer satisfaction metrics: CSAT, NPS; retention and churn prevention; pattern-spotting across tickets)",
  general: "General interview topics (motivation and career goals; genuine strengths and development areas; conflict and teamwork stories; time management under competing priorities; learning from specific mistakes; giving and receiving constructive feedback; handling ambiguity; working under pressure; professional growth trajectory; why this company/role specifically)",
};

const TYPE_MIX = {
  technical:  (count) => `All ${count} questions must have type "technical".`,
  hr:         (count) => `All ${count} questions must have type "hr".`,
  behavioral: (count) => `All ${count} questions must have type "behavioral".`,
  mixed: (count) => {
    const tech = Math.max(1, Math.round(count * 0.5));
    const hr   = Math.max(1, Math.round(count * 0.25));
    const beh  = Math.max(1, count - tech - hr);
    return `Generate exactly: ${tech} type "technical", ${hr} type "hr", ${beh} type "behavioral" (total ${count}).`;
  },
};

const LEVEL_GUIDANCE = {
  junior: {
    label: "Junior (0-2 years)",
    description:
      "Test foundational knowledge and basic applied skills. Focus on: core concepts with concrete examples, reading and writing straightforward code, explaining why something works. A correct answer with one real example is strong.",
    examples:
      "How a custom hook differs from a regular function, basic TypeScript typing, a simple React Query useQuery call, handling an API error with try/catch.",
  },
  mid: {
    label: "Mid-Level (2-5 years)",
    description:
      "Test applied knowledge and trade-off reasoning. Focus on: composing hooks, debugging real scenarios, choosing between approaches, performance awareness, testing strategy, reusable component design.",
    examples:
      "Writing a generic typed custom hook, React Query cache invalidation after a mutation, handling race conditions, structuring a reusable component with TypeScript generics.",
  },
  senior: {
    label: "Senior (5+ years)",
    description:
      "Test system-level thinking and depth. Focus on: architecture decisions, scalability, performance bottlenecks, security, advanced TypeScript patterns, complex debugging, design patterns, and trade-off analysis at scale.",
    examples:
      "Architecting a large React app with React Query and TypeScript, identifying rendering bottlenecks, designing an E2E testing strategy for a complex UI, advanced generic constraints.",
  },
  lead: {
    label: "Lead / Staff",
    description:
      "Test leadership, cross-team impact, and long-term strategy. Focus on: technical strategy, mentoring, architecture reviews, RFC processes, API design decisions, build-vs-buy, long-term maintainability, product-engineering trade-offs.",
    examples:
      "Deciding whether to adopt TanStack Query org-wide, defining a TypeScript migration strategy, running an architecture review, calibrating interview panels, aligning engineering with product priorities.",
  },
};

const DIFFICULTY_GUIDANCE = {
  easy: "Ask direct, one-concept questions. The candidate should know the answer clearly if they have the stated experience. No trick questions, no edge cases. Expect a definition plus one concrete example.",
  medium: "Ask applied questions requiring explanation or comparison. The candidate should compare approaches, explain a trade-off, or describe how they would solve a realistic scenario. Expect a worked example.",
  hard: "Ask deep questions requiring architectural thinking, edge-case awareness, or debugging insight. The candidate must walk through reasoning, consider failure modes, and articulate trade-offs. No obvious single right answer.",
  mixed: "Mix difficulty across the session: roughly 30% easy (foundational check), 50% medium (applied/trade-off), 20% hard (deep/edge-case). Vary question styles accordingly.",
};

/**
 * @param {{ role, interviewType, count, lang, recentTexts?: string[], experienceLevel?: string, difficulty?: string, focusAreas?: string[] }} opts
 * @returns {{ system: string, user: string }}
 */
export function buildGenerateQuestionsPrompt({
  role,
  interviewType,
  count,
  lang = "en",
  recentTexts = [],
  experienceLevel = "junior",
  difficulty = "mixed",
  focusAreas = [],
}) {
  const topics     = ROLE_TOPICS[role] ?? ROLE_TOPICS.general;
  const typeInstruction = (TYPE_MIX[interviewType] ?? TYPE_MIX.mixed)(count);
  const level      = LEVEL_GUIDANCE[experienceLevel] ?? LEVEL_GUIDANCE.junior;
  const diffGuide  = DIFFICULTY_GUIDANCE[difficulty] ?? DIFFICULTY_GUIDANCE.mixed;

  const isTailored  = focusAreas.length > 0;
  // 80% of ALL questions must target focusAreas; 90% of TECHNICAL questions must.
  const minAll      = Math.max(1, Math.round(count * 0.8));
  const techCount   = interviewType === "technical"
    ? count
    : interviewType === "mixed" ? Math.max(1, Math.round(count * 0.5)) : 0;
  const minTech     = techCount > 0 ? Math.max(1, Math.round(techCount * 0.9)) : 0;

  // Language: instruct AI to generate the candidate language natively first.
  const isHebrew = lang === "he";
  const langBlock = isHebrew
    ? [
        "LANGUAGE GENERATION ORDER -- strictly follow:",
        "1. Write text_he FIRST — use the persona and rules below:",
        "",
        "PERSONA: You are a Senior React Tech Lead at an Israeli tech company (Wix, Monday, Fiverr, IronSource).",
        "You are conducting a live job interview RIGHT NOW, in Hebrew, with a React developer candidate.",
        "Generate every question exactly as you would say it out loud in this interview.",
        "",
        "SCRIPT RULE — absolute: Hebrew Unicode only (U+0590–U+05FF). NEVER use Arabic script characters (U+0600–U+06FF).",
        "Hebrew letters (ו כ י פ) and Arabic letters (و ك ي ف) look similar but are different code points. Using Arabic is a hard error.",
        "",
        "HOW TO WRITE:",
        "Think and write in Hebrew from word one — do NOT draft in English and translate.",
        "Use the voice of a real tech lead speaking across a table, not a form or a quiz.",
        "If a sentence sounds stiff or academic, rewrite it until it sounds like you are actually saying it.",
        "",
        "EXPERIENCE-DRIVEN, NOT TOPIC-DRIVEN — the most important rule:",
        "Every question starts from the CANDIDATE'S EXPERIENCE or a SITUATION they've been in.",
        "NEVER start from a concept, feature, or documentation topic.",
        "BAD (topic-driven, sounds like docs): 'React Query ניגש לטפל בנתונים ישנים — איך זה עובד?'",
        "GOOD (experience-driven): 'ספר לי על מקרה שבו ה-cache החזיר נתונים ישנים. איך גילית ואיך טיפלת בזה?'",
        "BAD (topic-driven): 'בעיית debug ב-useEffect — מה הגישה?'",
        "GOOD (experience-driven): 'קרה לך ש-useEffect רץ יותר פעמים ממה שציפית? ספר לי מה גרם לזה.'",
        "BAD (documentation language): 'custom hook שמאגד hooks לניהול state'",
        "GOOD (interviewer voice): 'יצא לך לבנות hook שמשמש כמה components שונים? ספר לי איך בנית אותו.'",
        "BAD (technology as subject, docs voice): 'React Query מאפשרת לנהל cache — איך משתמשים בזה?'",
        "GOOD (developer as subject): 'קרה לך שה-cache לא התרענן אחרי שה-mutation הצליחה? ספר לי מה עשית.'",
        "The question must sound like something a person SAYS, not something they WRITE.",
        "The developer — not the technology — is always the subject of the question.",
        "",
        "5 patterns that always sound translated — eliminate them:",
        "  (1) כיצד: nobody says this aloud. Always use איך.",
        "  (2) Construct-state noun openers: never open with בדיקת X / ניהול X / ביצוע X / טיפול ב-X. Start with a verb or situation.",
        "  (3) Hebrew attached to English: never 'cache אחד', 'generic קשה', 'component חדש'. Say 'ה-cache' or 'generic שהיה מסובך'.",
        "  (4) Weak translated verbs: avoid ניגש לטפל ב / מאגד / עוזר ל. Use מטפל / משלב / מרכז instead.",
        "  (5) English compound nouns dropped raw: not 'בעיית debug' — say 'באג שהיה קשה לאתר'; not 'cache invalidation' — say 'כשה-cache מתיישן'.",
        "",
        "TECHNICAL TERMS — always keep in English, never translate:",
        "React, TypeScript, hooks, custom hook, cache, mutation, query, props, state, component,",
        "React Query, TanStack Query, Playwright, Tailwind CSS, E2E, stale data, invalidation,",
        "bundle, build, CI/CD, generic, interface, useEffect, useState, useCallback, useMemo, useRef.",
        "",
        "ONE HARD RULE — NO EXCEPTIONS:",
        "NEVER use slash gender forms: תוכל/י, ניגש/ת, בחר/י, תאר/י, נתקל/ת, עשית/ית.",
        "Use impersonal: שומרים, ניגשים, בוחרים, עושים — or direct singular: ספר לי / מה היית עושה.",
        "",
        "QUESTION FORMAT — every technical question must have 2-3 sentences:",
        "(1) Open with a realistic scenario: נניח ש... / ספר לי על מקרה שבו... / יצא לך...",
        "(2) Describe the concrete problem",
        "(3) Ask what they would do or how they would reason about it",
        "NEVER write a one-line question. NEVER open with a bare definition request.",
        "",
        "QUESTION OPENERS — start every question with one of these (rotate, don't repeat):",
        "  ספר לי על מקרה שבו...",
        "  קרה לך ש...?",
        "  יצא לך לעבוד עם...?",
        "  בפרויקט האחרון שלך...",
        "  בפרויקט שעבדת עליו...",
        "  נניח שנתקלת ב...",
        "  נניח שיש לך... — מה היית עושה?",
        "  מה היו השיקולים שלך כש...",
        "NEVER open with a concept name, a technology name, or a documentation phrase.",
        "",
        "REFERENCE QUESTIONS — write in THIS exact voice and length (not similar topics, this style):",
        " 1. 'נניח שמשתמש מעדכן רשומה, אבל במסך אחר עדיין מוצג מידע ישן מה-cache. איך היית ניגש לפתרון עם React Query? מה היית בודק קודם?'",
        " 2. 'ספר לי על מקרה שבו ה-mutation הצליחה בשרת, אבל ה-UI לא התעדכן. מה ניסית ואיך מצאת את הגורם?'",
        " 3. 'נניח שה-E2E test עובר locally אבל נופל ב-CI. מה הדברים הראשונים שהיית בודק?'",
        " 4. 'יצא לך לכתוב custom hook שנהיה קשה לתחזק עם הזמן? ספר לי מה השתבש ואיך שיפרת.'",
        " 5. 'נניח שיש component עם עשרות Tailwind classes שמשתנות לפי מצב. איך היית מארגן את הקוד?'",
        " 6. 'ספר לי על TypeScript error שלקח לך זמן להבין — מה הייתה הבעיה ואיך פתרת?'",
        " 7. 'נניח שלוגיקה חוזרת ב-8 components שונים. מה השיקולים שלך לפני שמחצים אותה ל-custom hook?'",
        " 8. 'בפרויקט שעבדת עליו, איך ארגנת את ה-TypeScript types? מה עבד טוב ומה היה מסורבל?'",
        " 9. 'נניח שה-bundle size גדל ב-40% אחרי feature חדשה. מה הצעדים שלך לאיתור הגורם?'",
        "10. 'ספר לי על באג ב-useEffect שגרם ל-infinite loop — מה קרה, ואיך הגעת לגורם?'",
        "11. 'יצא לך לבנות custom hook שמשתמש בכמה hooks אחרים בפנים? ספר לי על המקרה — מה הלוגיקה שמיזגת ואיך בנית את ה-API שלו.'",
        "12. 'נניח שיש שני screens שצריכים לראות את אותו data מה-server, ואחד מהם מעדכן אותו. איך היית בונה את זה עם React Query כך שה-screen השני יתרענן אוטומטית?'",
        "",
        "",
        "2. Write text_en SECOND: a natural English equivalent (same meaning, not word-for-word).",
        "Same rules apply for tip_he (native Hebrew first) and tip_en (natural English equivalent).",
      ].join("\n")
    : [
        "LANGUAGE GENERATION ORDER -- strictly follow:",
        "1. Write text_en FIRST: natural spoken English as a real interviewer says it.",
        '   Varied phrasing: "Walk me through...", "How would you...", "What happens when..."',
        "2. Write text_he SECOND: a natural Hebrew equivalent -- NOT a translation.",
        "   Keep technical terms in English: React, TypeScript, hooks, API, cache, render, mutation, etc.",
        "   Use natural spoken Hebrew patterns (Israeli tech interview style):",
        "     'ספר/י לי על מקרה שבו...', 'מה ההבדל בין X ל-Y?'",
        "     'נניח שיש לך component ש..., איך היית מתמודד/ת?'",
        "     'איך שומרים על X כש-Y גדל?', 'כשה-X נכשל, מה עושים?'",
        "   NEVER use slash gender forms (תוכל/י, ניגש/ת, בחר/י) — use impersonal plural instead.",
        "   'שומרים', 'מממשים', 'ניגשים', 'בוחרים' — not 'אתה/את בוחר/ת'.",
        "   Prefer: לאגד/משלב (combine), לממש (implement), לאתר (locate a bug), לטפל ב (handle).",
        "   Avoid: 'לאחר ביצוע X' → use 'אחרי ש-X מסתיים'.",
        "   Avoid: 'hook שקורא ל-hooks' → use 'custom hook שמשלב hooks'.",
        "Same rule for tip_en (native English first) and tip_he (natural Hebrew equivalent).",
      ].join("\n");

  // Tailored mode: strong hard constraints that override generic defaults
  // When focusAreas.length >= count - 1, ALL questions must target a focusArea (no escape hatch).
  const allMustBeFocused = focusAreas.length >= count - 1;

  const tailoredSystemBlock = isTailored
    ? [
        "",
        "TAILORED SESSION -- STRICT OVERRIDES (highest priority):",
        "This interview targets SPECIFIC SKILL GAPS from a job-match analysis.",
        allMustBeFocused
          ? `ALL ${count} questions MUST directly target a FOCUS AREA. The ${focusAreas.length} focus areas give enough breadth for variety -- do NOT drift to generic role topics.`
          : `At least ${minAll} of the ${count} total questions MUST directly target a FOCUS AREA.`,
        techCount > 0
          ? `Of the ${techCount} technical question(s), at least ${minTech} MUST target a FOCUS AREA.`
          : "",
        "",
        "FOCUS AREA DISTRIBUTION:",
        `Cover EACH of the ${focusAreas.length} focus area(s) at least once before repeating any.`,
        focusAreas.length <= count
          ? `With ${focusAreas.length} focus areas and ${count} questions, aim for 1 question per focus area first.`
          : `Prioritise the highest-ranked focus areas (listed first) when count < focus area count.`,
        "",
        "FOCUS AREA TAG (required, non-empty, on EVERY question in a tailored session):",
        "  Set focusAreaTag to the EXACT focus area label this question targets — copy it verbatim.",
        "  NEVER return an empty focusAreaTag. Every question in a tailored session tests a focus area.",
        "  Do NOT paraphrase or shorten the label. Match it character-for-character to the list above.",
        "",
        "PROHIBITED topics for tailored sessions -- do NOT generate these:",
        "  - What is useState / how does useState work",
        "  - What is useEffect / what is it used for",
        "  - What is React / what is JSX / what is a component / what is a prop",
        "  - How do you create a React app / what is the virtual DOM (definition only)",
        "These are beginner fundamentals. Tailored interviews target IDENTIFIED GAPS.",
        "",
        "For each focus-area question, use a DIFFERENT angle (vary across the set):",
        "  - Practical scenario: 'You are building X, how would you...'",
        "  - Debugging: 'This code behaves unexpectedly -- what is wrong and how do you fix it?'",
        "  - Trade-off: 'When would you choose A over B and why?'",
        "  - Architecture: 'How would you design/structure X for Y use case?'",
        "  - Testing: 'How would you test X? What edge cases does your test cover?'",
        "  - Performance / production incident: 'X is slow in production -- how do you diagnose and fix it?'",
        "  - Edge case: 'What happens when X? What could go wrong?'",
        "",
        "SEMANTIC DEDUPLICATION: Before finalising, check each question against the others.",
        "If two questions test the same concept from a similar angle, replace one.",
        "Test: could a strong answer to Q1 also fully answer Q2? If yes, they are duplicates -- replace.",
        "",
        "The question MUST reveal whether the candidate has PRACTICAL experience,",
        "not just textbook knowledge. Require concrete examples, debugging steps, or trade-off reasoning.",
      ].filter(Boolean).join("\n")
    : "";

  const recentBlock = recentTexts.length > 0
    ? [
        "",
        "RECENTLY ASKED -- do NOT repeat these topics or ask from the same angle:",
        ...recentTexts.map((t, i) => `  ${i + 1}. ${t}`),
        "Items marked [focus:X] targeted that specific focus area in a prior session.",
        "Do NOT ask a question with the same [focus:X] tag AND the same question angle as a prior item.",
        "Rotate to different sub-topics and angles within each focus area.",
      ].join("\n")
    : "";

  // Clarifications for abstract focusArea labels so the AI doesn't drift to surface-level sub-topics
  const FOCUS_CLARIFICATIONS = [
    { match: /hooks?\s+compos/i,  note: "means: extracting reusable custom hooks, building hooks that reuse other hooks internally, shared hook APIs -- NOT generic useCallback/useMemo explanations" },
    { match: /custom\s+hook/i,    note: "means: designing reusable custom hook APIs, reusable hook design, stale closures, cleanup -- NOT listing built-in hooks" },
    { match: /end.to.end|\be2e\b/i, note: "means: Playwright/Cypress full-flow testing, async UI assertions, API mocking/stubbing, flakiness debugging, CI reliability -- NOT unit testing" },
    { match: /react\s+query|tanstack/i, note: "means: keeping data fresh after server updates, stale data handling, mutations, optimistic updates, query key design, dependent queries -- NOT 'what is React Query'" },
    { match: /typescript\s+generic/i, note: "means: writing and debugging generic constraints, conditional types, infer, generic utility types in real code -- NOT 'what is a generic'" },
    { match: /tailwind/i,          note: "means: advanced utility patterns, theme extension, responsive design, managing many utility classes per component, design tokens, @apply trade-offs -- NOT 'what is Tailwind'" },
  ];

  function addClarification(area) {
    for (const { match, note } of FOCUS_CLARIFICATIONS) {
      if (match.test(area)) return `${area}  [${note}]`;
    }
    return area;
  }

  const focusBlock = isTailored
    ? [
        "",
        allMustBeFocused
          ? `FOCUS AREAS (skill gaps) -- ALL ${count} questions MUST target one of these (set focusAreaTag to the exact label):`
          : `FOCUS AREAS (skill gaps) -- at least ${minAll} of ${count} questions MUST target one of these:`,
        ...focusAreas.map((a, i) => `  ${i + 1}. ${addClarification(a)}`),
        "",
        "For each focus-area question: reveal PRACTICAL experience, not textbook definitions.",
        "BAD: 'What is React Query?' -- do NOT ask this.",
        "GOOD: 'How would you handle stale data with React Query when the user navigates back to a page?'",
        "GOOD: 'Walk me through debugging a TypeScript generic constraint error in a reusable hook.'",
      ].join("\n")
    : "";

  const system = [
    "You are an expert technical recruiter and interview coach. You write realistic interview questions actually asked in real job interviews.",
    "Questions must be concrete and specific -- not generic. They reveal practical knowledge and real-world experience.",
    "",
    langBlock,
    "",
    `EXPERIENCE LEVEL: ${level.label}`,
    level.description,
    `Example topic areas at this level: ${level.examples}`,
    "",
    `DIFFICULTY: ${difficulty.toUpperCase()}`,
    diffGuide,
    tailoredSystemBlock,
    "",
    "GENERAL QUALITY RULES:",
    "- Calibrate strictly to the experience level -- junior questions are answerable by a junior.",
    "- Technical questions go beyond definitions -- ask for examples, observed behaviour, or application.",
    "- QUESTION DEPTH (mandatory): every technical question must be 2-3 sentences. Structure: (1) set up a realistic scenario, (2) describe a concrete problem, (3) ask what to reason about or do next. One-line questions are NOT acceptable.",
    "- BAD: 'How did you fix stale data in React Query?' -- too short, no context.",
    "- GOOD: 'Suppose a user updates a record but another screen still shows stale cache data. How would you approach the fix with React Query? What would you check first?' -- scenario + problem + reasoning.",
    "- Never ask for a definition. Never ask 'What is X?' or 'What is the difference between X and Y?' -- always embed the concept in a real scenario.",
    "- Vary question style: scenario-based, debugging, trade-off, architecture, testing.",
    "- No two questions cover the same specific sub-topic.",
  ].join("\n");

  const user = [
    `Role: ${role}`,
    `Topic space: ${topics}`,
    "",
    `Interview type: ${interviewType}`,
    typeInstruction,
    `Experience level: ${level.label}`,
    `Difficulty: ${difficulty}`,
    `Total questions to generate: ${count}`,
    focusBlock,
    recentBlock,
    "",
    "Generate exactly the requested number of questions.",
    isTailored
      ? `FINAL REMINDER: EVERY question must target a focus area. focusAreaTag must be the EXACT label (non-empty, verbatim). Cover all ${focusAreas.length} area(s) before repeating any. Vary angles. No beginner definitions.`
      : "Cover varied sub-topics -- do not cluster around one area.",
  ].join("\n");

  return { system, user };
}
