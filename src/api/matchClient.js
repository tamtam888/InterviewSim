/**
 * Job match client — calls /api/analyze-match (server-side OpenAI).
 * Falls back to a local keyword-overlap heuristic if the server is unavailable.
 * The resume text and job description are NEVER stored server-side;
 * they are sent to the server only when analyzeMatch() is called, and used
 * only for a single OpenAI request.
 */

const REQUEST_TIMEOUT_MS = 30000;

async function postJson(url, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`API ${url} responded ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Very simple local fallback: overlap of meaningful words between resume and JD. */
function localAnalyze(resumeText, jobDescription, lang) {
  const stopwords = new Set([
    "the","a","an","and","or","of","in","to","for","with","on","at","is","are",
    "was","were","be","been","by","as","from","this","that","it","we","our","you",
    "your","their","its","will","have","has","had","not","but","if","can","do",
    "did","so","than","then","when","which","who","what","how","all","any","each",
    "more","also","both","other","into","about","after","up","out","over","such",
    "i","me","my","myself","he","she","they","them","his","her",
  ]);

  const tokenize = (text) =>
    text.toLowerCase().match(/[a-zא-ת]{3,}/g)?.filter((w) => !stopwords.has(w)) ?? [];

  const resumeTokens = new Set(tokenize(resumeText));
  const jdTokens = tokenize(jobDescription);
  const jdUnique = [...new Set(jdTokens)];

  const matched = jdUnique.filter((w) => resumeTokens.has(w));
  const missing = jdUnique.filter((w) => !resumeTokens.has(w)).slice(0, 10);

  const matchScore = Math.min(95, Math.round((matched.length / Math.max(jdUnique.length, 1)) * 100));

  const isEn = lang !== "he";

  return {
    matchScore,
    strengths: matched.slice(0, 4).map((w) =>
      isEn ? `Your resume mentions "${w}" which appears in the job description.`
             : `קורות החיים שלך מזכירים "${w}" שמופיע בתיאור התפקיד.`
    ),
    gaps: missing.slice(0, 4).map((w) =>
      isEn ? `The job description requires "${w}" — not clearly shown in your resume.`
             : `תיאור התפקיד דורש "${w}" — לא מופיע בצורה ברורה בקורות החיים שלך.`
    ),
    recommendedTopics: missing.slice(0, 5).map((w) =>
      isEn ? `Practice questions about "${w}"` : `שאלות תרגול על "${w}"`
    ),
    preparationPlan: [
      isEn ? "Add specific project examples for any missing keywords from the JD."
           : "הוסף/י דוגמאות ספציפיות מפרויקטים עבור מילות מפתח חסרות מתיאור התפקיד.",
      isEn ? "Research the company to understand their stack and culture."
           : "חקור/י את החברה כדי להבין את הסטאק והתרבות שלהם.",
      isEn ? "Prepare 2-3 STAR stories that cover the main behavioral requirements."
           : "הכן/י 2-3 סיפורי STAR שמכסים את הדרישות ההתנהגותיות העיקריות.",
    ],
    tailoredFocus: isEn
      ? `Based on keyword overlap, focus on demonstrating your experience with the specific technologies and responsibilities mentioned in the job description. Quantify your impact where possible.`
      : `על פי חפיפת מילות המפתח, התמקד/י בהדגמת הניסיון שלך עם הטכנולוגיות והאחריות הספציפיות המוזכרות בתיאור התפקיד. כמת את ההשפעה שלך היכן שניתן.`,
    source: "local",
  };
}

export async function analyzeMatch(resumeText, jobDescription, lang) {
  try {
    const result = await postJson("/api/analyze-match", {
      resumeText,
      jobDescription,
      lang,
    });
    return { ...result, source: "ai" };
  } catch {
    return { ...localAnalyze(resumeText, jobDescription, lang), source: "local", aiUnavailable: true };
  }
}
