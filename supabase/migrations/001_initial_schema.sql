-- ── profiles ──────────────────────────────────────────────────────────────────
-- One row per auth user. Created automatically on signup via trigger.
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  display_name text,
  lang         text not null default 'en',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Auto-create profile row the moment a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
create policy "Users see own profile"
  on public.profiles for all using (auth.uid() = id);


-- ── interview_sessions ────────────────────────────────────────────────────────
-- `id` is TEXT to match the client-generated sessionId already in use:
--   `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`
-- `per_type` stores {technical?: number, behavioral?: number, hr?: number}.
create table public.interview_sessions (
  id               text primary key,
  user_id          uuid not null references public.profiles(id) on delete cascade,
  role_id          text not null,
  interview_type   text not null,
  interviewer_id   text not null default 'sarah',
  question_count   smallint not null default 0,
  lang             text not null default 'en',
  overall          smallint check (overall between 0 and 100),
  summary_text     text,
  recommendations  text[] not null default '{}',
  answered         smallint not null default 0,
  skipped          smallint not null default 0,
  per_type         jsonb not null default '{}',
  completed_at     timestamptz not null default now(),
  created_at       timestamptz not null default now()
);

create index on public.interview_sessions(user_id, completed_at desc);
create index on public.interview_sessions(user_id, role_id);

alter table public.interview_sessions enable row level security;
create policy "Users own sessions"
  on public.interview_sessions for all using (auth.uid() = user_id);
