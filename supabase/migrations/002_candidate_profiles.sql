-- ── candidate_profiles ───────────────────────────────────────────────────────
-- One row per auth user (upserted on user_id, not appended).
-- Stores raw resume text plus optional structured JSON fields for future use.

create table public.candidate_profiles (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  resume_text  text not null,
  skills       jsonb,
  experience   jsonb,
  education    jsonb,
  languages    jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- One profile per user — upsert uses this as the conflict target.
create unique index on public.candidate_profiles(user_id);

-- Auto-bump updated_at on every update.
create or replace function public.set_candidate_profile_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger candidate_profiles_updated_at
  before update on public.candidate_profiles
  for each row execute procedure public.set_candidate_profile_updated_at();

-- Row-level security: users can only access their own row.
alter table public.candidate_profiles enable row level security;

create policy "Users manage own candidate profile"
  on public.candidate_profiles
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
