-- ── job_matches ──────────────────────────────────────────────────────────────
-- One row per match analysis. Created when the user clicks "Analyze Match".
-- candidate_profile_id is nullable because a user might not have a saved profile
-- (they pasted directly into the textarea).

create table public.job_matches (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  candidate_profile_id  uuid references public.candidate_profiles(id) on delete set null,
  job_description       text not null,
  match_score           integer,
  missing_skills        jsonb,
  strengths             jsonb,
  interview_focus_areas jsonb,
  analysis              jsonb,
  created_at            timestamptz not null default now()
);

create index on public.job_matches(user_id, created_at desc);

alter table public.job_matches enable row level security;

create policy "Users select own job_matches"
  on public.job_matches for select
  using (auth.uid() = user_id);

create policy "Users insert own job_matches"
  on public.job_matches for insert
  with check (auth.uid() = user_id);

create policy "Users update own job_matches"
  on public.job_matches for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users delete own job_matches"
  on public.job_matches for delete
  using (auth.uid() = user_id);
