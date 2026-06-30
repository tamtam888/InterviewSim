/**
 * Role inference from job description + optional focus areas.
 *
 * Uses a scoring system: each role has high-weight title phrases (10 pts)
 * and lower-weight tech-signal keywords (2 pts each). The highest-scoring
 * role above MIN_SCORE wins.
 *
 * RULES:
 *  - QA: title phrases ONLY (no tech signals). Testing tools like cypress,
 *    playwright, and "end-to-end testing" appear in frontend/React JDs
 *    and must NOT trigger a QA role.
 *  - Keywords are word-boundary-matched (normalised to space-delimited tokens)
 *    so "react" never matches "interaction".
 *  - Returns null when no role scores above MIN_SCORE. The caller should
 *    then fall back to "general".
 *
 * @param {string}   jobDescription - Raw job description text (any casing)
 * @param {string[]} [focusAreas]   - Optional gap/topic strings from a Job Match
 * @returns {string|null} roleId (always in VALID_ROLE_IDS), or null
 */

export const VALID_ROLE_IDS = new Set([
  "frontend", "react", "fullstack", "backend",
  "qa", "product", "uxui", "data", "support", "general",
]);

const TITLE_WEIGHT  = 10;   // explicit job-title phrase
const SIGNAL_WEIGHT = 2;    // technology / skill keyword
const MIN_SCORE     = 4;    // minimum total to claim a role (2 signals OR 1 title)

/**
 * Normalise text to a space-padded, lower-case, space-delimited token string.
 * Padding ensures word-boundary checks work at the start/end.
 */
function norm(text) {
  return (
    " " +
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim() +
    " "
  );
}

/** Word-boundary substring test: does normText contain phrase as a whole token? */
function has(normText, phrase) {
  const token = " " + phrase.replace(/[^a-z0-9]+/g, " ").trim() + " ";
  return normText.includes(token);
}

/* ── Role definitions ───────────────────────────────────────────────────── */

const ROLES = [
  // --- Most specific first (breaks ties when scores are equal) ---
  {
    id: "react",
    titlePhrases: [
      "react developer", "react engineer",
      "react js developer", "react js engineer",
      "reactjs developer", "reactjs engineer",
      "react native developer", "react native engineer",
      "react specialist", "react frontend developer", "react frontend engineer",
      "react and typescript developer", "react typescript developer",
    ],
    signals: [
      // core React ecosystem
      "react", "react hooks", "react hook", "react query", "react context",
      "react native", "reactjs", "react js", "react router",
      "tanstack", "tanstack query",
      // React-adjacent frameworks
      "nextjs", "next js",
      // React file formats
      "jsx", "tsx",
      // React state management
      "zustand", "redux", "recoil",
      // React-specific testing
      "react testing library",
    ],
  },
  {
    id: "uxui",
    titlePhrases: [
      "ux designer", "ui designer", "ux ui designer", "ui ux designer",
      "product designer", "user experience designer", "interaction designer",
      "figma designer", "ux researcher",
    ],
    signals: [
      "figma", "user experience", "ux research", "wireframe",
      "prototype", "interaction design", "user research",
      "design system", "usability testing",
    ],
  },
  {
    id: "qa",
    titlePhrases: [
      "qa engineer", "qa developer", "qa analyst",
      "quality assurance engineer", "quality assurance developer",
      "quality engineer", "quality analyst",
      "test engineer", "testing engineer", "software tester",
      "software testing engineer", "automation engineer",
      "sdet", "software development engineer in test",
      "test automation engineer", "qa automation engineer",
    ],
    // ⚠ Intentionally empty: testing tools (cypress, playwright, e2e)
    // appear in React/frontend JDs and must not count toward QA.
    signals: [],
  },
  {
    id: "data",
    titlePhrases: [
      "data analyst", "data analysis engineer", "business analyst",
      "bi developer", "business intelligence engineer",
      "data engineer", "analytics engineer",
      "ml engineer", "machine learning engineer", "data scientist",
    ],
    signals: [
      "machine learning", "data analysis", "data pipeline",
      "sql", "spark", "pandas", "tensorflow", "pytorch",
      "bigquery", "dbt", "airflow", "kafka",
    ],
  },
  {
    id: "product",
    titlePhrases: [
      "product manager", "product management", "product owner",
      "program manager", "technical program manager", "tpm",
    ],
    signals: [
      "product roadmap", "product strategy", "stakeholder management",
      "user stories", "product discovery", "okrs",
    ],
  },
  {
    id: "support",
    titlePhrases: [
      "customer support", "customer success", "technical support",
      "support engineer", "help desk", "customer service",
    ],
    signals: [
      "ticketing", "zendesk", "intercom", "customer onboarding",
    ],
  },
  {
    id: "fullstack",
    titlePhrases: [
      "full stack developer", "full stack engineer",
      "full-stack developer", "full-stack engineer",
      "fullstack developer", "fullstack engineer",
      "full stack web developer",
    ],
    signals: [
      "full stack", "fullstack", "frontend and backend", "backend and frontend",
    ],
  },
  {
    id: "backend",
    titlePhrases: [
      "backend developer", "backend engineer",
      "back end developer", "back end engineer",
      "server side developer", "api developer", "api engineer",
      "node js developer", "node js engineer",
      "python developer", "python engineer",
      "java developer", "java engineer",
      "go developer", "go engineer",
      "ruby developer", "django developer",
      "spring boot developer", "php developer",
    ],
    signals: [
      "node js", "nodejs", "python", "java", "golang", "ruby",
      "django", "spring boot", "php", "laravel", "fastapi",
      "rest api", "graphql api", "microservices",
      "server side", "database design", "postgresql", "mongodb",
    ],
  },
  {
    id: "frontend",
    titlePhrases: [
      "frontend developer", "frontend engineer",
      "front end developer", "front end engineer",
      "ui developer", "ui engineer",
      "javascript developer", "javascript engineer",
      "vue developer", "vue js developer", "vue engineer",
      "angular developer", "angular engineer",
      "next js developer", "next js engineer",
      "nuxt developer", "svelte developer",
    ],
    signals: [
      "frontend", "front end", "typescript", "tailwind", "tailwindcss",
      "css", "html", "angular", "vue", "svelte",
      "webpack", "vite", "javascript", "web development",
      "responsive design", "browser compatibility",
    ],
  },
];

/* ── Main export ────────────────────────────────────────────────────────── */

/**
 * @param {string}   jobDescription - Raw job description text
 * @param {string[]} [focusAreas]   - Optional focus area strings from Job Match
 * @returns {string|null}
 */
export function inferRole(jobDescription, focusAreas) {
  const jd = typeof jobDescription === "string" ? jobDescription : "";
  const fa = Array.isArray(focusAreas) && focusAreas.length > 0
    ? focusAreas.join(" ")
    : "";

  if (!jd && !fa) return null;

  const combined = norm(jd + " " + fa);

  const scores = {};
  const details = {};

  for (const { id, titlePhrases, signals } of ROLES) {
    let score = 0;
    const hits = [];

    for (const phrase of titlePhrases) {
      if (has(combined, phrase)) {
        score += TITLE_WEIGHT;
        hits.push(phrase + "(+" + TITLE_WEIGHT + ")");
      }
    }
    for (const sig of signals) {
      if (has(combined, sig)) {
        score += SIGNAL_WEIGHT;
        hits.push(sig + "(+" + SIGNAL_WEIGHT + ")");
      }
    }

    scores[id] = score;
    details[id] = hits;
  }

  if (import.meta.env.DEV) {
    console.group("[inferRole] scoring");
    console.log("jobDesc preview:", jd.slice(0, 120) || "(none)");
    console.log("focusAreas:", fa || "(none)");
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    console.log("scores:");
    sorted.forEach(([id, score]) => {
      if (score > 0) {
        console.log("  " + id + ": " + score + " pts | hits:", details[id].join(", "));
      } else {
        console.log("  " + id + ": 0 pts");
      }
    });
    console.groupEnd();
  }

  // Pick highest-scoring role above threshold (ROLES order breaks ties → more specific wins)
  let best = null;
  let bestScore = MIN_SCORE - 1;
  for (const { id } of ROLES) {
    if (scores[id] > bestScore) {
      bestScore = scores[id];
      best = id;
    }
  }

  if (import.meta.env.DEV) {
    if (best) {
      console.log("[inferRole] result:", best, "(" + bestScore + " pts)");
    } else {
      console.log("[inferRole] result: null — no role scored >= " + MIN_SCORE + " (caller falls back to general)");
    }
  }

  return best;
}
