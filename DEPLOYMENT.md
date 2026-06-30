# InterviewSim — Deployment Guide

**Version:** 1.0 (Production)  
**Stack:** React 19 + Vite · Vercel Serverless Functions · Supabase · OpenAI

---

## Prerequisites

| Account | Purpose | URL |
|---|---|---|
| Vercel | Hosting + serverless functions | https://vercel.com |
| Supabase | Auth + database | https://supabase.com |
| OpenAI | AI evaluation and question generation | https://platform.openai.com |

---

## 1. Supabase Setup

### 1.1 Create a Supabase project

1. Go to https://supabase.com → **New project**
2. Choose a region close to your users
3. Note the **Project URL** and **API keys** (used in step 3)

### 1.2 Run database migrations

Open the **SQL Editor** in the Supabase dashboard and run each migration file in order:

**Migration 1 — `supabase/migrations/001_initial_schema.sql`**  
Creates the `profiles` and `interview_sessions` tables, RLS policies, and the auto-profile trigger.

**Migration 2 — `supabase/migrations/002_candidate_profiles.sql`**  
Creates the `candidate_profiles` table for resume storage.

**Migration 3 — `supabase/migrations/003_job_matches.sql`**  
Creates the `job_matches` table for job match history.

Run each file in the SQL Editor and confirm **"Success. No rows returned"** before proceeding to the next.

### 1.3 Verify Row Level Security

After running migrations, go to **Table Editor** and confirm RLS is enabled (shield icon) on all three tables:
- `interview_sessions`
- `candidate_profiles`
- `job_matches`

### 1.4 Configure Auth settings

In **Authentication → URL Configuration**:
- **Site URL:** Set to your Vercel production URL (e.g. `https://your-app.vercel.app`)
- **Redirect URLs:** Add `https://your-app.vercel.app` and `https://your-app.vercel.app/**`

This is required for password-reset emails to redirect correctly.

---

## 2. Environment Variables

### Required variables

| Variable | Where to get it | Used by |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase → Settings → API → Project URL | Browser (bundled at build time) |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public key | Browser (bundled at build time) |
| `SUPABASE_URL` | Same as `VITE_SUPABASE_URL` | Vercel serverless functions only |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role secret key | Vercel serverless functions only |
| `OPENAI_API_KEY` | https://platform.openai.com/api-keys | Vercel serverless functions only |
| `OPENAI_MODEL` | Optional — defaults to `gpt-4o-mini` | Vercel serverless functions only |

### Critical prefix rules

> **`VITE_` prefix = bundled into the public browser JavaScript.**  
> Never set `SUPABASE_SERVICE_ROLE_KEY` or `OPENAI_API_KEY` with a `VITE_` prefix.  
> Those keys would be visible to anyone who inspects the page source.

| Variable | Prefix | Visible in browser bundle? |
|---|---|---|
| `VITE_SUPABASE_URL` | ✅ VITE_ | Yes — safe (anon, public by design) |
| `VITE_SUPABASE_ANON_KEY` | ✅ VITE_ | Yes — safe (RLS protects all data) |
| `SUPABASE_URL` | ❌ no VITE_ | No — server only |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ no VITE_ | No — server only, bypasses RLS |
| `OPENAI_API_KEY` | ❌ no VITE_ | No — server only |
| `OPENAI_MODEL` | ❌ no VITE_ | No — server only |

> **Note:** `PORT` is a dev-only variable for the local Express server. Do **not** add it to Vercel.

---

## 3. Vercel Setup

### 3.1 Import the project

1. Go to https://vercel.com → **Add New Project**
2. Import your Git repository
3. Framework preset will auto-detect as **Vite** — leave it

### 3.2 Add environment variables

In **Settings → Environment Variables**, add all six variables from section 2.

Set each variable for **Production** (and optionally Preview if you want a staging environment).

### 3.3 Deploy

Click **Deploy**. Vercel will:
1. Run `npm install`
2. Run `npm run build` (Vite production build)
3. Deploy the `dist/` output as a static SPA
4. Deploy all `api/*.js` files as serverless functions

Build time is approximately 30–60 seconds.

---

## 4. Deployment Procedure

```bash
# 1. Ensure all changes are committed
git status

# 2. Push to the main branch (or open a PR)
git push origin main

# 3. Vercel auto-deploys on push — monitor in the Vercel dashboard
# 4. Run the verification checklist below after deployment completes
```

For manual deploys without Git integration:
```bash
npm i -g vercel
vercel --prod
```

---

## 5. Post-Deployment Verification Checklist

Run through each item after every production deployment.

### 5.1 Infrastructure

- [ ] Vercel deployment shows **Ready** status (green)
- [ ] Visit `https://your-app.vercel.app/api/health` — response should be `{"ok":true,"aiConfigured":true}`
- [ ] If `aiConfigured` is `false`, check that `OPENAI_API_KEY` is set in Vercel env vars

### 5.2 Authentication

- [ ] Open the app → click **Sign In** — the auth modal opens
- [ ] Sign up with a new email address — confirmation email arrives
- [ ] Sign in with the new account — dashboard loads with user name visible in header
- [ ] Sign out → confirm user is logged out
- [ ] Use **Forgot password** — reset email arrives and redirect URL points to the production domain

### 5.3 Interview Flow

- [ ] Start a new interview (any role, any type)
- [ ] Answer a question — AI feedback loads (score, strengths, improvements, suggested answer)
- [ ] If feedback source badge shows **AI**, OpenAI is working
- [ ] If it shows **Local**, check `OPENAI_API_KEY` in Vercel env vars
- [ ] Complete the interview — Summary screen loads with overall score and recommendations
- [ ] Session is saved — visible in Progress page

### 5.4 Tailored Interview (Job Match → Interview)

- [ ] Go to **Job Match** → paste a resume and a job description → click **Analyze Match**
- [ ] Match score and gaps appear (AI source badge confirms API is working)
- [ ] Click **Start Tailored Interview** → SetupScreen shows the tailored banner with focus areas
- [ ] Complete the interview → Summary shows focus area coverage section

### 5.5 Resume Upload

- [ ] Go to **Resume** → drag and drop a PDF resume
- [ ] Text is extracted and appears in the textarea
- [ ] If signed in: cloud sync badge shows **Saved** — refresh the page and resume is still there

### 5.6 History and Progress

- [ ] Go to **Progress** — all completed interviews appear in the list
- [ ] Click a session row — detail panel expands with score, answers, and recommendations
- [ ] Filter by interview type — list updates correctly
- [ ] Dashboard (Home) shows: last session hero card, skill focus section, trend chart, recent sessions

### 5.7 Supabase Persistence

- [ ] Complete an interview while signed in
- [ ] Sign out, sign back in
- [ ] Progress page still shows the session (confirms server-side save via `/api/sessions`)

### 5.8 Security Headers

Open DevTools → **Network** → click any request → **Response Headers** and confirm:
- [ ] `x-content-type-options: nosniff`
- [ ] `x-frame-options: DENY`
- [ ] `referrer-policy: strict-origin-when-cross-origin`
- [ ] `permissions-policy: camera=(), geolocation=()`

### 5.9 Language (RTL)

- [ ] Click the language toggle in the header → app switches to Hebrew
- [ ] Layout flips to RTL (text aligns right, navigation mirrors)
- [ ] Complete a short interview in Hebrew — questions and feedback arrive in Hebrew

---

## 6. Known Limitations (v1.0)

- **Rate limiting is per-serverless-instance.** The in-process rate limiter in `server/core.js` resets on every Vercel cold start. Under heavy load, a user could exceed the soft limit across instances. Acceptable for v1.0; upgrade to Vercel KV for a shared store if traffic warrants it.
- **No React error boundary.** An unhandled render error will show a blank screen. Users should refresh. This will be addressed in v1.1.
- **DOCX resume upload is not supported.** Only PDF files are accepted. The UI shows an error message for DOCX uploads.
- **Keyboard focus is not trapped in modals.** The auth modal and the end-interview confirmation dialog do not trap Tab focus. Will be addressed in v1.1.

---

## 7. Rollback

If a deployment causes a regression:

1. Go to **Vercel Dashboard → Deployments**
2. Find the last known-good deployment
3. Click **⋯ → Promote to Production**

Vercel promotes instantly with no rebuild required.
