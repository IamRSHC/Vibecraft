-- ============================================================
--  VibeCraft Dragon v2 — run AFTER supabase/dragon.sql. Safe to re-run.
--  Adds: hints, two AI engines (Cloudflare first, laptop standby, or the reverse),
--  per-engine counters, and removes level 5. Level texts/hints live in the
--  git-ignored supabase/private/dragon_private.sql.
--  Backward compatible with the v1 site, so it can be run before deploying v2.
-- ============================================================

-- ---------- columns ----------------------------------------------------------
alter table public.dragon_levels add column if not exists hint1 text not null default '';
alter table public.dragon_levels add column if not exists hint2 text not null default '';

alter table public.dragon_config add column if not exists engine_mode text not null default 'cloudflare';
alter table public.dragon_config add column if not exists cf_exhausted_until timestamptz;
alter table public.dragon_config add column if not exists hint1_after int not null default 2;
alter table public.dragon_config add column if not exists hint2_after int not null default 4;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'dragon_config_engine_mode_check') then
    alter table public.dragon_config
      add constraint dragon_config_engine_mode_check check (engine_mode in ('cloudflare', 'laptop'));
  end if;
end $$;

-- which engine answered each message ('cloudflare' | 'laptop' | 'fallback')
alter table public.dragon_msgs add column if not exists engine text;

-- four levels from now on
delete from public.dragon_clears where level = 5;
delete from public.dragon_levels where level = 5;

-- ---------- server functions (secret-gated) ---------------------------------
create or replace function public.dragon_status(p_secret text, p_key text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  c public.dragon_config;
  t public.teams;
begin
  perform public.dragon_check_server(p_secret);
  select * into c from public.dragon_config where id = 1;
  select * into t from public.teams where key_hash = public.team_key_hash(p_key);
  if t.id is null then
    return jsonb_build_object('status', c.status, 'team', null);
  end if;
  return jsonb_build_object(
    'status', c.status,
    'team', jsonb_build_object('id', t.id, 'name', t.name),
    'cleared', coalesce((select jsonb_agg(d.level order by d.level) from public.dragon_clears d where d.team_id = t.id), '[]'::jsonb),
    'msgs', coalesce((select jsonb_object_agg(m.level::text, m.n)
                      from (select level, count(*) as n from public.dragon_msgs where team_id = t.id group by level) m), '{}'::jsonb),
    'cooldown_s', c.cooldown_s,
    'cooldown_left', greatest(0, ceil(extract(epoch from (t.last_msg_at + make_interval(secs => c.cooldown_s) - now()))))::int,
    'levels', coalesce((
      select jsonb_agg(jsonb_build_object('level', l.level, 'title', l.title, 'intro', l.intro, 'points', l.points) order by l.level)
      from public.dragon_levels l), '[]'::jsonb)
  );
end $$;

create or replace function public.dragon_chat_begin(p_secret text, p_key text, p_level int, p_message text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  c        public.dragon_config;
  t        public.teams;
  v_recent int;
  v_msg_id bigint;
  v_level_msgs int;
begin
  perform public.dragon_check_server(p_secret);
  select * into c from public.dragon_config where id = 1;
  if c.status <> 'open' then
    return jsonb_build_object('ok', false, 'reason', c.status);
  end if;

  select * into t from public.teams where key_hash = public.team_key_hash(p_key) for update;
  if t.id is null then
    return jsonb_build_object('ok', false, 'reason', 'no_team');
  end if;
  if not exists (select 1 from public.dragon_levels where level = p_level) then
    return jsonb_build_object('ok', false, 'reason', 'bad_level');
  end if;
  if p_level > 1 and not exists (select 1 from public.dragon_clears where team_id = t.id and level = p_level - 1) then
    return jsonb_build_object('ok', false, 'reason', 'locked');
  end if;
  if exists (select 1 from public.dragon_clears where team_id = t.id and level = p_level) then
    return jsonb_build_object('ok', false, 'reason', 'already_cleared');
  end if;
  if t.last_msg_at is not null and t.last_msg_at > now() - make_interval(secs => c.cooldown_s) then
    return jsonb_build_object('ok', false, 'reason', 'cooldown', 'retry_after',
      greatest(1, ceil(extract(epoch from (t.last_msg_at + make_interval(secs => c.cooldown_s) - now())))::int));
  end if;

  select count(*) into v_recent from public.dragon_msgs where created_at > now() - interval '60 seconds';
  if v_recent >= c.global_per_min then
    return jsonb_build_object('ok', false, 'reason', 'busy', 'retry_after', 8);
  end if;

  insert into public.dragon_msgs (team_id, level, message)
  values (t.id, p_level, left(coalesce(p_message, ''), 1000))
  returning id into v_msg_id;
  update public.teams set last_msg_at = now() where id = t.id;
  select count(*) into v_level_msgs from public.dragon_msgs where team_id = t.id and level = p_level;

  return jsonb_build_object('ok', true, 'team_id', t.id, 'msg_id', v_msg_id,
                            'prev_last', t.last_msg_at, 'cooldown_s', c.cooldown_s, 'level_msgs', v_level_msgs);
end $$;

-- Record which engine answered (for the /admin counters).
create or replace function public.dragon_chat_finish(p_secret text, p_msg_id bigint, p_engine text)
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  perform public.dragon_check_server(p_secret);
  update public.dragon_msgs set engine = left(p_engine, 20) where id = p_msg_id;
end $$;

-- Cloudflare said "daily free allocation used up": stay on the laptop until 00:00 UTC (05:30 IST).
create or replace function public.dragon_mark_cf_exhausted(p_secret text)
returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  perform public.dragon_check_server(p_secret);
  update public.dragon_config
     set cf_exhausted_until = (date_trunc('day', now() at time zone 'utc') + interval '1 day') at time zone 'utc'
   where id = 1;
end $$;

-- ---------- organiser overview --------------------------------------------------
create or replace function public.admin_dragon_overview()
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  v_today timestamptz := date_trunc('day', now() at time zone 'utc') at time zone 'utc';
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  return jsonb_build_object(
    'config', (select to_jsonb(c) from public.dragon_config c where c.id = 1),
    'msgs_last_min', (select count(*) from public.dragon_msgs where created_at > now() - interval '60 seconds'),
    'msgs_total', (select count(*) from public.dragon_msgs),
    'engine_today', jsonb_build_object(
      'cloudflare', (select count(*) from public.dragon_msgs where engine = 'cloudflare' and created_at >= v_today),
      'laptop',     (select count(*) from public.dragon_msgs where engine = 'laptop' and created_at >= v_today),
      'fallback',   (select count(*) from public.dragon_msgs where engine = 'fallback' and created_at >= v_today)),
    'levels', coalesce((
      select jsonb_agg(jsonb_build_object(
        'level', l.level, 'title', l.title,
        'cleared_by', (select count(*) from public.dragon_clears d where d.level = l.level)) order by l.level)
      from public.dragon_levels l), '[]'::jsonb),
    'teams', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'name', t.name, 'created_at', t.created_at,
        'cleared', coalesce((select jsonb_agg(d.level order by d.level) from public.dragon_clears d where d.team_id = t.id), '[]'::jsonb),
        'msgs', (select count(*) from public.dragon_msgs m where m.team_id = t.id)) order by t.name_key)
      from public.teams t), '[]'::jsonb)
  );
end $$;
