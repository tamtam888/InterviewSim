# InterviewSim — Interview Practice Simulator

Practice job interviews for 10 different roles, answer questions by typing or
speaking, and get instant local feedback with a score, strengths, improvement
points and a suggested stronger answer. Fully bilingual: English and Hebrew
(RTL), switchable from the header.

## Run it

```bash
npm install
npm run dev      # frontend only — works fully offline with local feedback
npm run build    # production build
npm run lint     # eslint
```

## AI feedback (optional)

The app works without any setup using a local heuristic feedback engine.
To enable real AI evaluation:

1. Copy `.env.example` to `.env` in the project root
   (`interview-sim/.env`).
2. Put your OpenAI API key in it: `OPENAI_API_KEY=sk-...`
   The key is read **only** by the Node server — it is never bundled into
   frontend code (never use a `VITE_` prefix for secrets).
3. Run both processes in two terminals:

```bash
npm run server   # terminal 1 — API server on http://localhost:3001
npm run dev      # terminal 2 — Vite proxies /api/* to the server
```

`GET http://localhost:3001/api/health` shows whether the key is configured.
If the server is down or the key is missing, the app automatically falls
back to local feedback — nothing breaks. Feedback cards show an
"AI feedback" / "Practice feedback" badge so you always know the source.

`.env` is git-ignored. Never commit real keys.

**Before any public release:** add rate limiting to the two POST endpoints —
they spend OpenAI credits. The exact insertion point is marked with a
`SECURITY TODO` comment at the top of `server/core.js` (locally:
`express-rate-limit` in `server/index.js`; on Vercel: WAF rules or an
Upstash Redis check inside the handlers). Cost caps already in place:
8,000-char answer limit, 12-result summary limit, `max_tokens` 700/450,
default model `gpt-4o-mini`.

### Deploying to Vercel

The repo is Vercel-ready: the same handlers run as serverless functions from
`/api` (`api/evaluate-answer.js`, `api/summarize-session.js`, `api/health.js`).

1. Import the repo in Vercel (framework preset: Vite).
2. In **Project Settings → Environment Variables**, add `OPENAI_API_KEY`
   (and optionally `OPENAI_MODEL`). This is the ONLY place the key lives in
   production — it is never bundled into frontend code.
3. Deploy. The frontend calls `/api/*` on the same domain; no proxy needed.

Locally you can either run `npm run server` (Express, port 3001, proxied by
Vite) or `vercel dev` (runs the /api functions directly). Both read `.env`.

## Features

- **10 roles**: Frontend, React, Full-Stack, Backend, QA, Product Manager,
  UX/UI, Data Analyst, Customer Support/Success, General.
- **4 interview types**: Technical, HR, Behavioral, Mixed.
- **Session lengths**: 4 / 6 / 8 questions.
- **Question flow**: one question at a time, with a tip per question, typed
  answers or voice input (Web Speech API where supported).
- **Per-answer feedback**: 0–100 score, strengths, what to improve, and a
  model answer.
- **Session summary**: overall score, stats, tailored recommendations, full
  Q&A review, and restart options.
- **Interviewer personas**: pick who interviews you (Tech Lead / Engineering
  Manager / HR Lead) — presentational only, scoring is identical.

## Architecture

```
src/
  App.jsx                 # screen state machine (useReducer)
  i18n/                   # language context, useLanguage hook, EN/HE strings
  data/
    roles.js              # role/interview-type/session-length definitions
    interviewers.js       # interviewer personas
    questions/            # bilingual question bank (technical, HR, behavioral)
  api/evaluationClient.js # evaluation adapter — tries /api/* (AI), falls
                          # back to the local heuristic on any failure
  utils/feedback.js       # local heuristic scoring + session summary
  utils/scoreLevel.js     # score -> UI label mapping (presentation only)
  hooks/useSpeechInput.js # Web Speech API wrapper (graceful fallback)
  components/             # AppHeader, AppFooter, ScoreRing, RoleIcon
  screens/                # Home, RoleSelect, Setup, Interview, Feedback, Summary
  styles/                 # one CSS file per screen/component + tokens in index.css
```

```
server/
  index.js                # Express API: POST /api/evaluate-answer,
                          # POST /api/summarize-session, GET /api/health
  openai.js               # server-side OpenAI call (key from process.env only)
  prompts.js              # prompt builders
```

Questions are local data. Feedback comes from OpenAI when the server is
running with a key, otherwise from the local heuristic engine (answer length,
STAR structure signals, specificity, keyword coverage). The UI labels the
source of every piece of feedback.
