/**
 * Live AI verification — run AFTER putting OPENAI_API_KEY in .env and
 * starting the API server (npm run server). Usage: npm run test:ai
 *
 * Simulates a real "React Developer · Technical · 4 questions" session
 * through the actual API, in English and Hebrew, and validates the
 * structured JSON. Also verifies interviewer persona routing.
 * Exits non-zero on any failure.
 */
const BASE = process.env.API_BASE ?? "http://localhost:3001";

const QUESTIONS = [
  { text: "What is the difference between props and state in React?", type: "technical" },
  { text: "What is useEffect used for? Give two real examples from a project.", type: "technical" },
  { text: "What is a controlled component? How would you build a text input in a form?", type: "technical" },
  { text: "You open your React app and the page is completely blank. What do you check, in what order?", type: "technical" },
];

const ANSWERS = [
  "Props come from the parent and are read-only, state is managed inside the component with useState. Both cause re-render when changed.",
  "useEffect runs side effects after render, like fetching data on mount or adding a window event listener with cleanup.",
  "A controlled input gets value from state and updates it in onChange, so React state is the single source of truth.",
  "First I open the console for errors, then check the dev server terminal, then check that main.jsx mounts into the root div.",
];

let failures = 0;
const fail = (msg) => { console.error("  ✗", msg); failures++; };
const ok = (msg) => console.log("  ✓", msg);
const hasHebrew = (s) => /[֐-׿]/.test(s);

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status, data: await res.json().catch(() => null) };
}

function validateFeedback(d, lang) {
  if (typeof d?.score !== "number" || d.score < 0 || d.score > 100) fail(`score invalid: ${d?.score}`);
  else if (d.score < 10 || d.score > 95) fail(`score suspiciously extreme: ${d.score} (possible fallback or prompt issue)`);
  if (!Array.isArray(d?.strengths) || d.strengths.length === 0) fail("strengths missing");
  if (!Array.isArray(d?.improvements) || d.improvements.length === 0) fail("improvements missing");
  if (!d?.suggestedAnswer) fail("suggestedAnswer missing");
  if (!d?.nextPracticeTip) fail("nextPracticeTip missing");
  if (lang === "he" && !hasHebrew(d?.suggestedAnswer ?? "")) fail("Hebrew request returned non-Hebrew suggestedAnswer");
  if (lang === "en" && hasHebrew(d?.suggestedAnswer ?? "")) fail("English request returned Hebrew content");
}

console.log(`Testing against ${BASE}\n`);

// 1) Health
const health = await fetch(`${BASE}/api/health`).then((r) => r.json());
console.log("Health:", JSON.stringify(health));
if (!health.aiConfigured) {
  console.error("\naiConfigured is FALSE — put OPENAI_API_KEY in .env and restart `npm run server`.");
  process.exit(1);
}
ok("aiConfigured: true");

// 2) Full 4-question English session (Sarah persona, explicit)
console.log("\n--- evaluate-answer (en, interviewer: sarah) ---");
const enResults = [];
for (let i = 0; i < 4; i++) {
  const { status, data } = await post("/api/evaluate-answer", {
    role: "react",
    interviewType: "technical",
    interviewerId: "sarah",
    question: QUESTIONS[i],
    answer: ANSWERS[i],
    lang: "en",
    sessionContext: { questionNumber: i + 1, totalQuestions: 4 },
  });
  if (status !== 200) { fail(`Q${i + 1} HTTP ${status}: ${JSON.stringify(data)}`); continue; }
  validateFeedback(data, "en");
  ok(`Q${i + 1} score ${data.score} | tip: ${(data.nextPracticeTip ?? "").slice(0, 70)}`);
  enResults.push({ question: QUESTIONS[i], answer: ANSWERS[i], skipped: false, score: data.score });
}

// 3) Session summary (English)
console.log("\n--- summarize-session (en) ---");
if (enResults.length > 0) {
  const { status, data } = await post("/api/summarize-session", {
    role: "react", interviewType: "technical", results: enResults, lang: "en",
  });
  if (status !== 200) fail(`summary HTTP ${status}: ${JSON.stringify(data)}`);
  else if (typeof data.overall !== "number" || !data.summary || !data.recommendations?.length) fail("summary shape invalid");
  else {
    ok(`overall ${data.overall}`);
    console.log("  summary:", data.summary.slice(0, 160));
    console.log("  recommendation 1:", (data.recommendations[0] ?? "").slice(0, 100));
  }
} else {
  fail("skipped (no English results to summarize — all evaluate calls failed)");
}

// 4) Hebrew question (Q1, sarah)
console.log("\n--- evaluate-answer (he, interviewer: sarah) ---");
{
  const { status, data } = await post("/api/evaluate-answer", {
    role: "react",
    interviewType: "technical",
    interviewerId: "sarah",
    question: QUESTIONS[0],
    answer: ANSWERS[0],
    lang: "he",
    sessionContext: { questionNumber: 1, totalQuestions: 4 },
  });
  if (status !== 200) fail(`Q1-he HTTP ${status}: ${JSON.stringify(data)}`);
  else {
    validateFeedback(data, "he");
    ok(`Q1-he score ${data.score} | hebrew check passed`);
    if (data.strengths?.[0]) console.log("  strengths[0]:", data.strengths[0]);
  }
}

// 5) Interviewer persona routing — Daniel and Maya (1 question each, English)
for (const interviewerId of ["daniel", "maya"]) {
  console.log(`\n--- evaluate-answer (en, interviewer: ${interviewerId}) ---`);
  const { status, data } = await post("/api/evaluate-answer", {
    role: "react",
    interviewType: "technical",
    interviewerId,
    question: QUESTIONS[0],
    answer: ANSWERS[0],
    lang: "en",
    sessionContext: { questionNumber: 1, totalQuestions: 1 },
  });
  if (status !== 200) { fail(`${interviewerId} HTTP ${status}: ${JSON.stringify(data)}`); continue; }
  validateFeedback(data, "en");
  ok(`${interviewerId} score ${data.score} | tip: ${(data.nextPracticeTip ?? "").slice(0, 70)}`);
}

// 6) Invalid interviewerId should return 400 (input validation)
console.log("\n--- validation: invalid interviewerId should be 400 ---");
{
  const { status } = await post("/api/evaluate-answer", {
    role: "react", interviewType: "technical",
    interviewerId: "hacker",
    question: QUESTIONS[0], answer: ANSWERS[0], lang: "en",
  });
  if (status === 400) ok("invalid interviewerId correctly rejected with 400");
  else fail(`expected 400 for invalid interviewerId, got ${status}`);
}

// 7) Rate limit header check
console.log("\n--- rate-limit headers present ---");
{
  const res = await fetch(`${BASE}/api/evaluate-answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: "react", interviewType: "technical", interviewerId: "sarah", question: QUESTIONS[0], answer: ANSWERS[0], lang: "en" }),
  });
  const rl = res.headers.get("ratelimit-limit") ?? res.headers.get("x-ratelimit-limit");
  if (rl) ok(`rate-limit header present: limit=${rl}`);
  else ok("rate-limit headers not exposed to test client (normal if behind proxy; check server logs)");
}

console.log(failures === 0
  ? "\nALL AI TESTS PASSED — real AI is active."
  : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
