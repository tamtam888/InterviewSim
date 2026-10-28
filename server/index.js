/**
 * Local development API server (Express).
 * Same handlers as the Vercel functions in /api -- see server/core.js.
 *
 * Run:  npm run server
 * Dev:  Vite dev server proxies /api/* here (see vite.config.js).
 */
import express from "express";
import clarifyQuestion from "../api/clarify-question.js";
import { rateLimit } from "express-rate-limit";
import { hasApiKey } from "./openai.js";
import {
  handleHealth,
  handleEvaluateAnswer,
  handleSummarizeSession,
  handleAnalyzeMatch,
  handleGenerateQuestions,
  handleSaveSession,
  handleGetSessions,
} from "./core.js";

const app = express();
app.use(express.json({ limit: "400kb" }));

const evaluateLimiter = rateLimit({
  windowMs: 60 * 1000, max: 60,
  standardHeaders: "draft-7", legacyHeaders: false,
  message: { error: "rate_limited", message: "Too many requests -- slow down." },
});

const summarizeLimiter = rateLimit({
  windowMs: 60 * 1000, max: 30,
  standardHeaders: "draft-7", legacyHeaders: false,
  message: { error: "rate_limited", message: "Too many requests -- slow down." },
});

const generateLimiter = rateLimit({
  windowMs: 60 * 1000, max: 20,
  standardHeaders: "draft-7", legacyHeaders: false,
  message: { error: "rate_limited", message: "Too many requests -- slow down." },
});

const matchLimiter = rateLimit({
  windowMs: 60 * 1000, max: 15,
  standardHeaders: "draft-7", legacyHeaders: false,
  message: { error: "rate_limited", message: "Too many requests -- slow down." },
});

// Auth-gated but still worth capping to prevent DB flooding
const sessionsLimiter = rateLimit({
  windowMs: 60 * 1000, max: 30,
  standardHeaders: "draft-7", legacyHeaders: false,
  message: { error: "rate_limited", message: "Too many requests -- slow down." },
});

const PORT = process.env.PORT || 3001;

app.get("/api/health", handleHealth);
app.post("/api/clarify-question", generateLimiter, clarifyQuestion);
app.post("/api/evaluate-answer", evaluateLimiter, handleEvaluateAnswer);
app.post("/api/summarize-session", summarizeLimiter, handleSummarizeSession);
app.post("/api/analyze-match", matchLimiter, handleAnalyzeMatch);
app.post("/api/generate-questions", generateLimiter, handleGenerateQuestions);

// Session persistence -- auth-required + rate-limited
app.post("/api/sessions", sessionsLimiter, handleSaveSession);
app.get("/api/sessions", sessionsLimiter, handleGetSessions);

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
  console.log(`[server] AI configured: ${hasApiKey() ? "yes" : "no (503s; frontend falls back to local)"}`);
});
