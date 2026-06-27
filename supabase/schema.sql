-- MindBalance — Supabase schema + Row-Level Security.
-- Run this once in your Supabase project → SQL Editor → New query → Run.
-- Each table is keyed to auth.users; RLS ensures a user can only ever read or
-- write their own rows.

-- ── Tables ──────────────────────────────────────────────────────────────
create table if not exists public.moods (
  id          text primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  ts          bigint not null,            -- epoch ms
  mood        int not null,
  energy      int not null,
  note        text,
  created_at  timestamptz not null default now()
);

create table if not exists public.journal_entries (
  id          text primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  ts          bigint not null,
  text        text not null,
  insight     jsonb,
  created_at  timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id          text primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  ts          bigint not null,
  role        text not null,
  content     text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.tasks (
  id            text primary key,
  user_id       uuid not null references auth.users (id) on delete cascade,
  ts            bigint not null,            -- created, epoch ms
  title         text not null,
  detail        text,
  done          boolean not null default false,
  completed_at  bigint,                     -- epoch ms when checked off
  acknowledged  boolean not null default false, -- companion has celebrated it
  source        text not null default 'companion',
  created_at    timestamptz not null default now()
);

-- ── Indexes (fast per-user, time-ordered reads) ─────────────────────────
create index if not exists moods_user_ts_idx   on public.moods (user_id, ts desc);
create index if not exists entries_user_ts_idx on public.journal_entries (user_id, ts desc);
create index if not exists chat_user_ts_idx    on public.chat_messages (user_id, ts asc);
create index if not exists tasks_user_ts_idx   on public.tasks (user_id, ts desc);

-- ── Row-Level Security ──────────────────────────────────────────────────
alter table public.moods           enable row level security;
alter table public.journal_entries enable row level security;
alter table public.chat_messages   enable row level security;
alter table public.tasks           enable row level security;

drop policy if exists "own moods"   on public.moods;
drop policy if exists "own entries" on public.journal_entries;
drop policy if exists "own chat"    on public.chat_messages;
drop policy if exists "own tasks"   on public.tasks;

-- auth.uid() wrapped in a subselect so it's evaluated once per query, not per
-- row (better performance at scale).
create policy "own tasks" on public.tasks
  for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "own moods" on public.moods
  for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "own entries" on public.journal_entries
  for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "own chat" on public.chat_messages
  for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
