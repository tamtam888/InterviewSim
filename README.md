# InterviewSim — AI-Assisted Interview Practice

**Bilingual interview simulator · React · JavaScript · AI feedback · Job matching**

**Practice with purpose. Get actionable feedback. Build confidence.**

InterviewSim is a bilingual (English / Hebrew, RTL) web application for preparing for job interviews. It combines role-specific interview practice, selectable interviewer personas, structured answer feedback, and preparation tools in a responsive interface.

**[Live application](https://interview-sim-ten.vercel.app/)** · **[Portfolio](https://tamtam888.github.io/MyPortfolio/projects.html)**

## What you can do

- **Practice for 10 roles:** Frontend, React, Full-Stack, Backend, QA, Product Manager, UX/UI, Data Analyst, Customer Support / Success, and General.
- **Customize interviews:** technical, HR, behavioral, or mixed; 4, 6, or 8 questions; experience level and difficulty.
- **Choose an interviewer:** Sarah (Tech Lead), Daniel (Engineering Manager), or Maya (HR Manager). Personas change presentation and focus, not the scoring rules.
- **Answer questions:** type your response or use speech recognition when the browser supports it.
- **Hear interview questions:** play the exact displayed question using optional server-side AI text-to-speech, with browser voice as a fallback. A separate control plays an AI-generated rephrasing when clarification is requested; the UI identifies which voice engine is in use.
- **Start from a focused welcome page:** the primary action opens a new interview; the dashboard provides progress and recent-session insights. Saved interviews can be resumed explicitly instead of automatically interrupting the landing page.
- **Review feedback:** score, strengths, improvement opportunities, suggested answer, and follow-up practice prompts.
- **See a session summary:** overall score, answered/skipped statistics, recommendations, and question-by-question review.
- **Prepare beyond practice:** question bank, progress view, résumé tools, and job-description matching. AI-based generation and matching depend on backend configuration.
- **Use English or Hebrew:** interface language switching and right-to-left layouts.
- **Use guest mode:** the core practice flow works without a Supabase account; account-dependent persistence requires a configured Supabase backend.

## How evaluation works

| Mode | What happens | Requirements |
| --- | --- | --- |
| AI-assisted feedback | The app calls its own `/api/evaluate-answer` and `/api/summarize-session` endpoints; the backend calls OpenAI. | Server-side `OPENAI_API_KEY` |
| Local practice feedback | If AI is unavailable, the app uses a built-in heuristic evaluator and local session summary. | No API key |
| AI question generation / job matching | Dedicated backend endpoints generate questions and analyze résumé-to-job fit. | Configured AI backend; fallback behavior varies by feature |
| Account and saved sessions | Authentication and server-side session persistence through Supabase. | Supabase configuration |
| Interview speech | `/api/question-speech` generates optional narrated question audio, falling back to the device speech engine when AI audio is unavailable. | Server-side `OPENAI_API_KEY`, supported audio/browser features; API usage may incur charges |

**Important:** Local heuristic scores are practice indicators, not validated assessments of interview performance. AI output can also be imperfect; use the feedback as coaching guidance rather than an objective hiring prediction.

The frontend does not expose the OpenAI secret. Never place private API keys in `VITE_*` variables or commit `.env`.

## Tech stack

- **Frontend:** React 19, JavaScript, Vite 7, CSS, Lucide icons.
- **Backend:** Node.js, Express request handlers, Vercel serverless API functions.
- **AI:** OpenAI API through server-side handlers, with local heuristic fallback for answer evaluation and session summaries.
- **Authentication / persistence:** Supabase (optional for guest practice).
- **Voice input:** browser Web Speech API, where supported.
- **Voice output:** optional OpenAI speech endpoint with browser SpeechSynthesis fallback; output quality, particularly in Hebrew, depends on the selected voice and service availability. The server-side flag `AI_TTS_ENABLED=false` disables AI speech.
- **Deployment:** Vercel.

## Getting started

**Prerequisites:** Node.js compatible with Vite 7 (Node 20.19+ or 22.12+ recommended), npm.

```bash
git clone https://github.com/tamtam888/InterviewSim.git
cd InterviewSim
npm install
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`).

**One command is enough for local development.** `vite.config.js` mounts the Express API handlers into Vite's development server. If no OpenAI key is configured, answer evaluation and session summaries fall back to local feedback.

### Optional AI configuration

1. Copy `.env.example` to `.env` in the repository root.
2. Set `OPENAI_API_KEY` to your private OpenAI API key.
3. Optionally set `OPENAI_MODEL` (the example uses `gpt-4o-mini`). AI speech is available when the same key supports audio generation; set `AI_TTS_ENABLED=false` to disable it.
4. Restart `npm run dev`.

```dotenv
OPENAI_API_KEY=your_server_side_key
OPENAI_MODEL=gpt-4o-mini
```

Check `/api/health` to see whether the server recognizes the AI configuration. The health endpoint reports configuration, not a guarantee that an OpenAI request will succeed.

### Optional Supabase configuration

The `.env.example` documents the supported variables:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_public_anon_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_private_service_role_key
```

The `VITE_` variables are browser-visible by design; protect access using Supabase Row Level Security. The service-role key must remain server-only. Database schema and access policies must be configured for account-backed features; setting environment variables alone is not a complete database setup.

Without Supabase configuration, guest practice remains available, while account-backed functionality may be unavailable.

### Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite frontend and mounted local API routes |
| `npm run server` | Standalone Express API on port 3001 (alternative development setup) |
| `npm run build` | Production frontend build |
| `npm run preview` | Preview a production build |
| `npm run lint` | ESLint checks |
| `npm run test:ai` | AI-related test script; inspect its requirements before running |

Do not start `npm run server` alongside `npm run dev` expecting Vite to proxy to it: the current Vite configuration mounts its own handlers directly.

## Deployment

The project is configured for Vercel, with serverless handlers in `api/` and the Vite frontend.

1. Import this repository into Vercel using the Vite framework preset.
2. Configure `OPENAI_API_KEY` and optional `OPENAI_MODEL` as **server-side environment variables** if AI evaluation is required.
3. Configure Supabase variables and database policies if account-backed features are required.
4. Deploy and test the full interview flow, `/api/health`, language switching, and both AI-enabled and fallback behavior.

**Security and cost note:** The code includes request validation, payload limits, and rate-limiting logic. Local Express and Vite development use `express-rate-limit`; the in-memory limiter used in serverless handlers is per process and does **not** provide a shared global quota across Vercel instances. For a public AI-enabled deployment, add centralized rate limiting, abuse protection, monitoring, and spending limits before relying on it for cost control.

## Code organization

```text
src/
  App.jsx                  Application navigation and interview state
  screens/                 Welcome, dashboard, setup, interview, feedback, summary,
                           questions, progress, résumé, job match, settings
  data/                    Interviewers, roles, and question data
  api/evaluationClient.js  AI request adapter and local fallback
  utils/feedback.js        Local evaluation and session summaries
  i18n/                    English/Hebrew translations and RTL support
  hooks/                   Shared application hooks, including question-audio playback
  styles/                  Screen and application styles
server/
  core.js                  Shared API request handlers
  index.js                 Standalone Express development server
  openai.js                Server-side OpenAI integration
api/                       Vercel serverless entry points
public/images/             Interviewer portraits and public assets
vite.config.js             Vite configuration and development API mounting
.env.example               Optional configuration template (no real secrets)
```

## Demo, limitations, and privacy

InterviewSim is a portfolio application and practice tool, **not a hiring decision system**. Sample interview questions and local heuristic feedback do not require an OpenAI connection. AI-dependent features require a working backend and may incur API costs. Speech input availability depends on the browser and permissions.

Avoid submitting sensitive personal information in a demo. When account-backed features are enabled, review the deployed project's privacy, retention, authentication, and Supabase access policies before using real candidate data.

## Quality checklist

Before releasing changes, verify:

- [ ] `npm run lint` and `npm run build` pass.
- [ ] A complete interview works in English and Hebrew, including RTL.
- [ ] Listen to question and Listen to rephrased question play the correct texts; the AI/device voice status is truthful and Hebrew pronunciation is evaluated on real devices.
- [ ] The welcome page opens on fresh entry, saved-interview resume is deliberate, and the dashboard displays real progress rather than placeholder figures.
- [ ] All three interviewer portraits load correctly.
- [ ] Feedback clearly indicates whether it came from AI or local practice logic.
- [ ] Summary statistics match the completed session.
- [ ] Guest mode works without Supabase and without an OpenAI key.
- [ ] Authenticated session persistence works when Supabase is configured.
- [ ] Desktop and mobile layouts, keyboard navigation, and browser back/refresh behavior are checked.
- [ ] API secrets are not exposed and production abuse/cost controls are configured.

---

Built as a frontend and AI-product portfolio project. [Explore the live demo](https://interview-sim-ten.vercel.app/).
