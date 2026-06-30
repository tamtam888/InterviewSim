# InterviewSim — Project Status Summary

## What Works Now

The app is a fully functional AI-powered interview simulator with cloud sync, job matching, and tailored interview generation. All core flows are complete and demo-ready. `npm run dev` starts everything in a single process (no separate Express server required).

---

## Main Features Completed

**Practice flow**
- Role selection (10 roles), interview type, session length, experience level, difficulty
- AI question generation via `/api/generate-questions` with static-bank fallback
- Voice input (Web Speech API) on supported browsers
- Per-answer AI evaluation with score, strengths, improvements, suggested answer
- Adaptive follow-up coaching: AI proposes a follow-up question after weak answers, user can optionally practice it
- Summary screen with overall score, stats, recommendations, per-question accordion

**Tailored interview**
- Job Match analyzes resume + job description, returns match score, gaps, recommended topics, preparation plan
- "Start Tailored Interview" routes directly to SetupScreen with matched role pre-selected
- Focus areas (gaps + recommended topics) injected into the AI prompt: 90% of technical questions must target them
- Tailored banner visible during interview (badge, focus area count, match %)
- Focus area coverage diagnostics on SummaryScreen (hit/miss chips per area, coverage %)

**Job Match**
- Paste resume text or load from Supabase profile
- Paste job description, click Analyze
- AI returns match score, strengths, gaps, recommended topics, preparation plan, tailored focus
- Result persists to Supabase + localStorage
- Match history panel for signed-in users (view old results, start tailored interview from any row)

**Resume**
- PDF upload with pdfjs-dist extraction; drag-and-drop supported
- Manual text paste/edit
- Auto-extracted keyword cloud (top 30 skills)
- Cloud sync to Supabase `candidate_profiles` on save
- Delete propagates to Supabase so refresh does not restore cleared resume

**Auth**
- Supabase email/password signup, sign-in, forgot password, password reset via email link
- Auth modal accessible from header and sidebar
- Session cloud saves (interview history) gated behind sign-in
- Guest mode: all practice features and localStorage persistence work without an account

**Progress / History**
- Dashboard with streak, session count, avg score, answered count
- Per-role skill breakdown
- Session list with detail panel (per-session summary, recommendations, per-type breakdown)
- Cloud history fetched from Supabase for signed-in users, merged with localStorage for guests

**UI / UX**
- Bilingual (English + Hebrew), full RTL support
- Hamburger drawer sidebar
- Page persistence on refresh (resume, job match, progress, settings survive reload; mid-interview refresh goes to dashboard)
- Interviewer personas: Sarah (supportive), Daniel (direct), Maya (strategic)

---

## Technical Architecture

```
Browser (React 19 SPA)
  └── Vite dev server  ←─ configureServer plugin mounts Express in-process
       └── Express middlewares (rate limiting, JSON body parsing)
            └── server/core.js  (shared handlers — also used by Vercel api/*.js)
                 ├── /api/evaluate-answer     → OpenAI GPT-4o
                 ├── /api/summarize-session   → OpenAI GPT-4o
                 ├── /api/analyze-match       → OpenAI GPT-4o
                 ├── /api/generate-questions  → OpenAI GPT-4o
                 ├── /api/sessions (POST/GET) → Supabase (auth-gated)
                 └── /api/health
```

**Key libraries:** React 19, Vite 7, Express 5, OpenAI SDK, Supabase JS, pdfjs-dist, lucide-react, express-rate-limit

**State management:** `useReducer` with a flat state machine in `App.jsx`. No external state library.

**No secrets in the browser.** All OpenAI calls go through server-side handlers. The client only holds the Supabase anon key (public by design, scoped by RLS).

---

## Supabase Tables

| Table | Purpose |
|---|---|
| `profiles` | One row per auth user, auto-created on signup via trigger |
| `interview_sessions` | Completed sessions with score, recommendations, per-type breakdown; RLS enforced |
| `candidate_profiles` | Resume text + optional structured fields; one row per user, upserted |
| `job_matches` | One row per analysis run; links to `candidate_profiles` (nullable); stores full AI result JSON |

All tables use Row-Level Security — users can only access their own rows.

---

## AI Flows

| Endpoint | Model | Schema enforcement | Fallback |
|---|---|---|---|
| `/api/evaluate-answer` | GPT-4o | JSON schema (score, strengths, improvements, suggestedAnswer, followUp) | Local score formula |
| `/api/summarize-session` | GPT-4o | JSON schema (overall, summary, recommendations) | Local average + static recs |
| `/api/analyze-match` | GPT-4o | JSON schema (matchScore, gaps, recommendedTopics, preparationPlan, tailoredFocus) | None (user sees error) |
| `/api/generate-questions` | GPT-4o (temp 0.85) | JSON schema (questions array with bilingual text, tip, type, tags) | Static question bank |

**Question generation prompt rules:**
- 80% of all questions MUST target the role's known topics
- 90% of technical questions MUST target `focusAreas` (job match gaps) when provided
- Hebrew generates `text_he` natively first (no translation); English generates `text_en` natively first
- 6 named question angles enforced: practical scenario, debugging, trade-off, architecture, testing, edge case
- Prohibited beginner topics list (e.g. "What is useEffect")
- Semantic dedup instruction to prevent near-identical questions

---

## What Was Fixed Today

| Fix | File(s) |
|---|---|
| 8 missing i18n keys (`clearJobBtn`, 7 auth screen keys) causing `undefined` in UI | `src/i18n/strings.js` |
| GET `/api/sessions` SELECT missing 4 columns (`interviewer_id`, `lang`, `summary_text`, `recommendations`) — cloud history showed `undefined` for signed-in users | `server/core.js` |
| `server/prompts.js` literal newline inside `.join("\n")` strings (syntax error) | `server/prompts.js` |
| `src/App.jsx`, `InterviewScreen.jsx`, `SummaryScreen.jsx` truncated by Write tool at special characters — repaired | All three |
| Unused `ANGLE_GUIDE` constant causing ESLint error | `server/prompts.js` |
| Duplicate modal div block in `InterviewScreen.jsx` from bad repair | `src/screens/InterviewScreen.jsx` |
| Null bytes at end of `SummaryScreen.jsx` causing parse error | `src/screens/SummaryScreen.jsx` |

---

## Known Limitations

- **No server in production Vercel setup** — `vite.config.js` plugin only runs in dev. Production uses `api/*.js` Vercel functions. These exist but haven't been tested in this session.
- **PDF only** — DOCX upload is gracefully rejected with an error message; text extraction for DOCX is not implemented.
- **Coverage diagnostics are keyword-based** — `isFocusAreaCovered` matches by keywords in question text/tags; it doesn't semantically understand if a question truly covered a topic. Can produce false positives/negatives.
- **No offline support** — AI features require network. Static bank fallback works offline.
- **Chunk size** — JS bundle is ~714 kB minified (warning threshold). Caused by pdfjs-dist. Could be code-split.
- **ResumeScreen load logic** — Cloud resume only loads if localStorage is empty. Local edits take precedence over cloud on the same device.
- **`matchScore` not shown on SummaryScreen** — prop is passed but removed from destructuring (unused). Only shown on InterviewScreen banner.

---

## Suggested Next Improvements

1. **Code-split pdfjs-dist** — dynamic import on first PDF drop; reduces initial bundle by ~400 kB
2. **Semantic coverage** — have the AI tag each generated question with the focusArea it targets; use that tag for accurate coverage, not keyword matching
3. **Streak + calendar view** — visual practice calendar on the Progress page
4. **Share results** — generate a shareable summary card (OG image or PDF export)
5. **Question bank filters** — filter by role, type, difficulty in the QuestionBank screen
6. **Mobile polish** — textarea resize, drawer animation, voice button placement on small screens
7. **Rate limit UI feedback** — surface 429 errors to users rather than silent fail
8. **Vercel production smoke test** — verify `api/*.js` functions work with env vars on a deployed instance

---

## Demo Checklist

- [ ] `.env` has `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `OPENAI_API_KEY`
- [ ] `npm install` done
- [ ] `npm run dev` — confirm `[api] AI key: present` in console
- [ ] Visit `http://localhost:5173` — homepage loads
- [ ] Start a React interview → SetupScreen → interview starts, questions are AI-generated (check console for `✓ AI SUCCESS`)
- [ ] Answer 1–2 questions → feedback screen appears with score and follow-up suggestion
- [ ] Finish interview → SummaryScreen shows overall score, stats, recommendations
- [ ] Sign in → session saves → Progress page shows the session
- [ ] Job Match: paste a resume and a React job description → Analyze → match score appears → "Start Tailored Interview" → confirm tailored banner in InterviewScreen
- [ ] Finish tailored interview → SummaryScreen shows Focus Area Coverage section
- [ ] Resume: upload a PDF → text extracted → Save → signed in → refresh → resume loads from cloud
- [ ] Clear resume → refresh → resume does not return
- [ ] Switch to Hebrew → UI flips RTL, all labels translate
- [ ] Check browser console — no JS errors, no `undefined` keys
