-- ============================================================
--  VibeCraft — Supabase schema
--  Run this in the Supabase SQL editor (Dashboard → SQL → New query).
--  BEFORE running: replace ADMIN_EMAIL_HERE (line ~34) with the email
--  you will use for the organiser admin account.
-- ============================================================

-- ---------- 1) TIMER ----------------------------------------
create table if not exists public.timer_state (
  id           integer primary key default 1,
  status       text not null default 'idle'
                 check (status in ('idle','running','paused','ended')),
  ends_at      timestamptz,
  remaining_ms bigint,
  duration_ms  bigint not null default 32400000,  -- 9h default (editable live)
  updated_at   timestamptz not null default now(),
  constraint timer_single_row check (id = 1)
);

insert into public.timer_state (id) values (1)
  on conflict (id) do nothing;

alter table public.timer_state enable row level security;

-- everyone can READ the timer
drop policy if exists "timer read" on public.timer_state;
create policy "timer read" on public.timer_state
  for select using (true);

-- only the admin (matched by email in their JWT) can WRITE it
drop policy if exists "timer admin update" on public.timer_state;
create policy "timer admin update" on public.timer_state
  for update
  using      ( (auth.jwt() ->> 'email') = 'ADMIN_EMAIL_HERE' )
  with check ( (auth.jwt() ->> 'email') = 'ADMIN_EMAIL_HERE' );

-- keep updated_at fresh on every write
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists timer_touch on public.timer_state;
create trigger timer_touch before update on public.timer_state
  for each row execute function public.touch_updated_at();

-- broadcast row changes over Realtime
alter publication supabase_realtime add table public.timer_state;

-- ---------- 2) ROUND 2 PROBLEM STATEMENT (server-gated) -----
create table if not exists public.round2 (
  id          integer primary key default 1,
  access_code text not null,
  title       text not null,
  body        text not null,
  constraint round2_single_row check (id = 1)
);

alter table public.round2 enable row level security;
-- NOTE: no SELECT policy on purpose → the anon/public key can NEVER read
-- this table directly, so the problem statement never reaches a browser.

-- The only way in: this function, which checks the code server-side and
-- returns the PS ONLY on a match. SECURITY DEFINER lets it read the table
-- while callers still cannot.
create or replace function public.verify_round2(code text)
returns table(title text, body text)
language sql
security definer
set search_path = public
as $$
  select r.title, r.body
  from public.round2 r
  where r.id = 1
    and upper(trim(code)) = upper(trim(r.access_code));
$$;

revoke all on function public.verify_round2(text) from public;
grant execute on function public.verify_round2(text) to anon, authenticated;

-- seed row — EDIT the code + text before the event
insert into public.round2 (id, access_code, title, body)
values (
  1,
  'CHANGE-ME-BEFORE-EVENT',
  'Round 2 — Level Up',
  'Replace this with the real Round 2 problem statement text.'
)
on conflict (id) do nothing;

-- To update it later:
--   update public.round2
--     set access_code = 'REAL-CODE', title = '…', body = '…'
--   where id = 1;
