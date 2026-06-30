# InterviewSim — Multi-User SaaS Architecture Plan

## 1. Option Comparison

### Supabase Auth + Supabase Postgres ✅ RECOMMENDED

**Pros**
- Single vendor: auth and DB share the same project, same connection pool, no JWT bridging
- Postgres is the right engine for this data — highly relational (users → sessions → results → resumes → jobs)
- Row Level Security (RLS) handles multi-tenancy at the DB layer: a misconfigured API can't leak another user's data
- Progress queries are trivial SQL: `AVG(score) GROUP BY role_id, week`; Firestore cannot do this
- Open source — self-hostable if needed later
- Free tier: 500 MB DB, 50k MAU, 1 GB file storage — enough for a working beta
- REST + realtime + JS client already; no new dependencies for the frontend

**Cons**
- RLS policies require careful setup and testing — easy to get wrong
- Supabase Auth is good, not exceptional (no device fingerprinting, no advanced MFA)
- Vendor concentration risk (mitigated by open-source / self-host path)

---

### Firebase Auth + Firestore ❌ NOT RECOMMENDED

Firestore is a document store. This app's core value is analytics:
"Show average technical score per role, week over week."
That query requires a collection scan + client-side aggregation in Firestore.
In Postgres it's a single indexed query. The data model is inherently relational —
users → sessions → results, resumes → job matches — and Firestore makes every
cross-collection join expensive. The only advantage (offline sync) is not
a priority for a web app focused on deliberate practice sessions.

---

### Clerk + Supabase ⚠️ VALID ALTERNATIVE

Use this if auth UX is a top priority (Clerk has the best-in-class magic link,
passkey, and OAuth flows). The cost is two vendors and a JWT bridging step:
Clerk issues JWTs; Supabase must be configured to verify them via JWKS.
Adds ~1 week of integration complexity. Recommended only after the MVP is
validated and auth UX becomes a differentiator.

---

### Custom Auth ❌ NOT RECOMMENDED

Email verification, password reset, session management, CSRF protection, refresh
token rotation — 4–6 weeks for parity with Supabase Auth. No competitive advantage.

---

## 2. Recommended Stack

| Layer | Choice | Why |
|---|---|---|
| Auth | Supabase Auth | Email + magic link, JWT, free, same project as DB |
| Database | Supabase Postgres | SQL, RLS, relational schema, analytics-ready |
| File storage | Supabase Storage | Resume PDF uploads later; same project |
| Serverless API | Existing Vercel functions | Already works; add Supabase JWT verification |
| Frontend | Existing React + Vite | No change |
| AI | Existing OpenAI via server | No change |
| ORM | None — raw Supabase JS client | Lightweight, RLS-aware |

---

## 3. Database Schema

### 3.1 Users (extends Supabase auth.users)

```sql
-- Supabase creates auth.users automatically.
-- We add a public profile table synced via trigger.

create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  display_name text,
  lang        text not null default 'en',     -- 'en' | 'he'
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;
create policy "Users see own profile"
  on public.profiles for all using (auth.uid() = id);
```

---

### 3.2 Resumes

Multiple resumes per user. One marked default.

```sql
create table public.resumes (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  title        text not null default 'My Resume',   -- user-facing label
  content      text not null,                        -- full plain-text resume
  keywords     text[] not null default '{}',         -- extracted client-side on save
  is_default   boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Enforce one default per user at DB layer
create unique index one_default_resume_per_user
  on public.resumes(user_id) where is_default = true;

alter table public.resumes enable row level security;
create policy "Users own resumes"
  on public.resumes for all using (auth.uid() = user_id);
```

---

### 3.3 Companies

User-scoped company list. Populated by the user as they add jobs.

```sql
create table public.companies (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  website     text,
  notes       text,
  created_at  timestamptz not null default now()
);

alter table public.companies enable row level security;
create policy "Users own companies"
  on public.companies for all using (auth.uid() = user_id);
```

---

### 3.4 Jobs

One row per job description. Linked to a company. Similarity grouping via
`similarity_group_id` (jobs with the same group ID are near-duplicates).

```sql
create table public.jobs (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  company_id          uuid references public.companies(id) on delete set null,
  title               text not null,
  description         text not null,          -- full JD text
  keywords            text[] not null default '{}',
  source_url          text,
  is_archived         boolean not null default false,
  similarity_group_id uuid,                   -- null until similarity detection runs
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index on public.jobs(user_id, company_id);
create index on public.jobs(user_id, similarity_group_id);

alter table public.jobs enable row level security;
create policy "Users own jobs"
  on public.jobs for all using (auth.uid() = user_id);
```

---

### 3.5 Job Match Analyses

One row per (resume × job) analysis run. Keeps history of past analyses
so the user can see how their resume improved across versions.

```sql
create table public.job_match_analyses (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  resume_id           uuid not null references public.resumes(id) on delete cascade,
  job_id              uuid not null references public.jobs(id) on delete cascade,
  match_score         smallint not null check (match_score between 0 and 100),
  strengths           text[] not null default '{}',
  gaps                text[] not null default '{}',
  recommended_topics  text[] not null default '{}',
  preparation_plan    text[] not null default '{}',
  tailored_focus      text not null default '',
  source              text not null check (source in ('ai', 'local')),
  created_at          timestamptz not null default now()
);

create index on public.job_match_analyses(user_id, job_id);
create index on public.job_match_analyses(user_id, resume_id);

alter table public.job_match_analyses enable row level security;
create policy "Users own analyses"
  on public.job_match_analyses for all using (auth.uid() = user_id);
```

---

### 3.6 Interview Sessions

One row per practice session. Optionally linked to a job and resume
(so the user can prepare specifically for a saved role).

```sql
create table public.interview_sessions (
  id               uuid primary key,            -- client-generated sessionId (already exists)
  user_id          uuid not null references public.profiles(id) on delete cascade,
  role_id          text not null,               -- 'frontend' | 'backend' | 'fullstack' etc.
  interview_type   text not null,               -- 'technical' | 'behavioral' | 'hr' | 'mixed'
  interviewer_id   text not null default 'sarah',
  question_count   smallint not null,
  lang             text not null default 'en',
  job_id           uuid references public.jobs(id) on delete set null,
  resume_id        uuid references public.resumes(id) on delete set null,
  summary_score    smallint check (summary_score between 0 and 100),
  summary_text     text,
  summary_recommendations text[] default '{}',
  completed_at     timestamptz,
  created_at       timestamptz not null default now()
);

create index on public.interview_sessions(user_id, created_at desc);
create index on public.interview_sessions(user_id, role_id);
create index on public.interview_sessions(user_id, job_id);

alter table public.interview_sessions enable row level security;
create policy "Users own sessions"
  on public.interview_sessions for all using (auth.uid() = user_id);
```

---

### 3.7 Session Results

One row per question answered within a session.
`is_follow_up = true` identifies follow-up coaching questions.

```sql
create table public.session_results (
  id                  uuid primary key default gen_random_uuid(),
  session_id          uuid not null references public.interview_sessions(id) on delete cascade,
  user_id             uuid not null references public.profiles(id) on delete cascade,
  question_id         text not null,            -- id from the question bank ('jr-arrow-fn')
  question_text       text not null,            -- snapshot at answer time (question bank evolves)
  question_type       text not null,            -- 'technical' | 'behavioral' | 'hr'
  question_category   text,
  answer              text not null default '',
  score               smallint check (score between 0 and 100),
  strengths           text[] not null default '{}',
  improvements        text[] not null default '{}',
  suggested_answer    text,
  next_practice_tip   text,
  skipped             boolean not null default false,
  is_follow_up        boolean not null default false,
  follow_up_question  text,
  follow_up_reason    text,
  source              text not null check (source in ('ai', 'local')),
  created_at          timestamptz not null default now()
);

create index on public.session_results(session_id);
create index on public.session_results(user_id, question_id);   -- "how did I do on this Q over time?"
create index on public.session_results(user_id, question_type);  -- per-type progress

alter table public.session_results enable row level security;
create policy "Users own results"
  on public.session_results for all using (auth.uid() = user_id);
```

---

## 4. Entity Relationship Summary

```
profiles
  ├── resumes (1:many)              ← multiple resume versions
  ├── companies (1:many)
  │     └── jobs (1:many)           ← jobs grouped by company
  ├── jobs (1:many, also direct)    ← jobs without a known company
  │     └── job_match_analyses      ← resume × job → analysis result
  └── interview_sessions (1:many)
        ├── → job_id (optional)     ← session prepared for this job
        ├── → resume_id (optional)  ← resume in context during session
        └── session_results (1:many)
```

---

## 5. Auth Flow

1. User visits app → `supabase.auth.getSession()` checks for active JWT in cookie/storage
2. No session → render `<AuthScreen>` (email + magic link; password optional)
3. On magic link click → Supabase issues JWT (1 hour expiry) + refresh token (7 days)
4. Supabase JS client auto-refreshes before expiry — no manual handling needed
5. Client attaches JWT as `Authorization: Bearer <token>` on all API calls
6. Server (Vercel function) calls `supabase.auth.getUser(token)` to verify + extract `user_id`
7. All DB queries scoped to that `user_id` — RLS enforces this at the DB layer too

**No user_id should ever come from the request body.** Always derive it from the verified JWT.

---

## 6. Server-Side Auth Middleware

In `server/core.js`, add a `requireAuth(req)` helper:

```js
// Pseudocode — not implementing yet
async function requireAuth(req) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) throw { status: 401, code: "unauthenticated" };
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) throw { status: 401, code: "invalid_token" };
  return user; // { id, email, ... }
}
```

`supabaseAdmin` uses the `service_role` key (server-only env var, never client-facing).

---

## 7. Migration Path from localStorage

### Strategy: migrate-on-login (one-time, client-initiated)

1. On successful first login, client checks `interviewsim.migrated` flag in localStorage
2. If flag is absent: read all localStorage keys and POST to `/api/migrate-local-data`
3. Server saves: resume text → `resumes`, history records → `interview_sessions` (compact form), last JD → `jobs`
4. On success: server returns `{ migrated: true }`; client sets `interviewsim.migrated = "1"` and clears data keys
5. If migration fails: retry next login; old data stays intact

### What to migrate

| localStorage key | → DB table | Notes |
|---|---|---|
| `interviewsim.resumeText` | `resumes` | title = "Imported resume"; is_default = true |
| `interviewsim.jobDescription` | `jobs` | title = "Imported job"; no company |
| `interviewsim.history.v1` | `interview_sessions` | Compact records only; no per-question results |

### What to NOT migrate

| Key | Reason |
|---|---|
| `interviewsim.lang` | Saved to `profiles.lang` from auth context, not from localStorage migration |
| `interviewsim.sidebarCollapsed` | Pure UI preference; keep local |
| `interviewsim.recentQuestions.v1` | Ephemeral dedup list; not meaningful as permanent history |

---

## 8. What Stays Local vs. Cloud

| Data | Stay local | Go to cloud | Reason |
|---|---|---|---|
| Language preference | ✅ (instant) | ✅ (synced to profile) | Synced on login, local for instant apply |
| Sidebar state | ✅ | ❌ | Pure UI chrome |
| In-progress answer (mid-interview) | ✅ | ❌ | Ephemeral; save on completion only |
| Completed session + results | ❌ | ✅ | Core product value |
| Resume text | ❌ | ✅ | Needed for job matching across devices |
| Job descriptions | ❌ | ✅ | Needed for prepared sessions |
| Job match analyses | ❌ | ✅ | User's history, progress value |
| Recent questions dedup list | ✅ | ❌ | Session-scoped; server can deduplicate from DB |

---

## 9. Privacy and Security Considerations

### Critical
- **RLS on every table** — test with two separate accounts; confirm account B cannot read account A's data even with valid JWT
- **Never trust client-provided user_id** — always derive from verified JWT server-side
- **Service role key** is server-only; never in `VITE_*` env vars or client bundles
- **Resume and JD text** are PII-adjacent — stored encrypted at rest by Supabase (AWS AES-256)

### Important
- **Rate limiting** — once authenticated, move rate limiting from IP to `user_id`; prevents VPN-based bypass
- **GDPR / right to erasure** — `on delete cascade` on all user_id FKs means deleting from `auth.users` cascades everywhere; expose a "Delete my account" endpoint
- **OpenAI data retention** — Supabase stores data; OpenAI by default does not train on API inputs but confirm via their data processing agreement for EU users
- **Token expiry** — Supabase JS client handles auto-refresh; server should return 401 (not 500) on expired tokens so the client can re-auth

### Deferred (not MVP)
- End-to-end encryption for resume text (if targeting enterprise)
- Audit log table for data access
- SOC 2 compliance

---

## 10. MVP Scope (v1)

**Goal: a logged-in user can practice interviews and see their history from any device.**

What's included:
- Supabase project, Auth (email + magic link), DB tables with RLS
- `profiles` auto-created on signup via Supabase trigger
- `resumes` — save/load the single current resume (title auto-generated)
- `interview_sessions` + `session_results` — saved on SummaryScreen completion
- Auth middleware in `server/core.js` for all API endpoints
- `<AuthScreen>` in React (email input → magic link sent)
- Progress screen reads session history from DB
- localStorage migration on first login
- "Delete my account" endpoint (GDPR baseline)

What's excluded from MVP:
- Multiple named resumes UI
- Companies and jobs tables (JD still localStorage-only initially)
- Job match history persistence
- Similarity detection
- Prepare-for-job flow

---

## 11. Later Version Scope (v2+)

| Feature | Tables involved | Notes |
|---|---|---|
| Multiple named resumes | `resumes` | UI to create/rename/set-default |
| Job description library | `jobs`, `companies` | Save JDs with title + company |
| Job match history | `job_match_analyses` | "How has my score for this role improved?" |
| Company grouping | `companies` | See all jobs + matches per company |
| Similar JD detection | `jobs.similarity_group_id` | Keyword Jaccard first; embeddings later |
| Prepare-for-job flow | `interview_sessions.job_id` | Select saved job → session pre-configured |
| Progress by company | All tables | "How do I perform for Google-type JDs?" |
| Embeddings for semantic match | pgvector extension | Resume ↔ JD semantic similarity |
| Resume PDF upload | Supabase Storage | Extract text server-side; store in `resumes.content` |

---

## 12. First 5 Implementation Steps

**Step 1 — Supabase project and schema**
Create Supabase project. Run SQL migrations for all 6 tables.
Set up RLS policies. Create DB trigger: `on insert into auth.users → insert into public.profiles`.
Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` (client) and `SUPABASE_SERVICE_ROLE_KEY` (server-only) to `.env`.

**Step 2 — Auth middleware in server/core.js**
Add `requireAuth(req)` using `supabaseAdmin.auth.getUser(token)`.
Gate `handleEvaluateAnswer`, `handleSummarizeSession`, and `handleAnalyzeMatch` behind it.
Return 401 with `{ error: "unauthenticated" }` if missing or invalid.

**Step 3 — AuthScreen in React**
New `<AuthScreen>` component: email input → `supabase.auth.signInWithOtp({ email })` → "Check your email" confirmation state.
Add auth state listener in `App.jsx`: `supabase.auth.onAuthStateChange` → if no session, render AuthScreen; if session, render normal app.
Gate all sidebar navigation behind auth.

**Step 4 — Save sessions to DB**
In `SummaryScreen` (or wherever `recordSession` is called), add a `saveSessionToDb(session, results, lang)` call that:
- POSTs to `/api/save-session`
- Server inserts into `interview_sessions` then batch-inserts `session_results`
- Fire-and-forget on the client (don't block UX on save)

**Step 5 — Load history from DB**
Replace `getHistory()` (localStorage) with a `/api/get-history` endpoint that queries `interview_sessions` for the authed user, ordered by `created_at desc`, limit 50.
Progress screen fetches on mount. Keep `computeDashboard()` logic unchanged — just swap the data source.

---

## 13. Risks Before Production

| Risk | Severity | Mitigation |
|---|---|---|
| RLS misconfiguration leaks cross-user data | Critical | Write integration tests with two users; add Supabase's `auth.uid()` check to every policy; test with service role disabled |
| JWT not verified server-side (trusting client user_id) | Critical | Never read user_id from req.body; always use `requireAuth()` |
| OpenAI cost spike from authenticated users with no per-user limits | High | Move rate limiter from IP → auth.uid; add daily token budget per user |
| DB size growth from large resume text * many users | Medium | Add `content` length limit server-side (already at 12k chars for match); monitor Supabase dashboard |
| Supabase free tier limits hit in early beta | Medium | 50k MAU and 500 MB is generous; set billing alert at 80% |
| Missing GDPR cascade on account delete | High | Verify `on delete cascade` works end-to-end before any EU users |
| Session save fails silently (network issue on SummaryScreen) | Low | Add a "saving..." indicator + retry; show warning if save failed |
