# Round 2 — Access Code & Problem Statements Setup

Round 2 shows a **list of problem statements** (same for every team) that stays hidden until a
qualified team enters the **access code** on the `/round/2` page. The check runs **server-side**
(`verify_round2`), so the statements never reach a browser until the code matches.

Data model:
- **`round2`** — one row holding the `access_code`.
- **`round2_problems`** — one row **per problem statement** (`sort_order`, `title`, `body`). Add as
  many as you like.

> Prereq: Supabase project created and `supabase/schema.sql` run (see `supabase/SETUP.md`).

---

## Step 1 — Upgrade the DB (only if you ran an earlier schema)

If you ran an **older** `schema.sql` (single-PS version), just **re-run the current
`supabase/schema.sql`** once — it's safe/idempotent and adds the `round2_problems` table + the new
`verify_round2`. (It won't touch your timer or admin email.)

SQL Editor → **+ New query** → paste the whole `schema.sql` → **Run**.

You'll now have a `round2` row (placeholder code) and one seeded `round2_problems` row
("Sample Problem 1").

---

## Step 2 — Set the access code

```sql
update public.round2 set access_code = 'VIBECRAFT-R2' where id = 1;
```
- The code is **case-insensitive** and trimmed (`vibecraft-r2` also works). Pick something memorable
  to hand to teams that clear Round 1.

---

## Step 3 — Add / edit the problem statements

**Add** each problem as a new row (use `$$ … $$` around the body so apostrophes / quotes / line
breaks are safe). `sort_order` controls display order (lowest first):

```sql
insert into public.round2_problems (sort_order, title, body) values
  (1, 'Problem A — <short name>', $$Full text of problem statement A.
Multiple lines and don't / you're are fine inside these $$ markers.$$),
  (2, 'Problem B — <short name>', $$Full text of problem statement B.$$),
  (3, 'Problem C — <short name>', $$Full text of problem statement C.$$);
```

**Edit** an existing one (find its `id` first):
```sql
select id, sort_order, title from public.round2_problems order by sort_order;

update public.round2_problems
  set title = 'New title', body = $$New text…$$, sort_order = 1
  where id = 2;
```

**Delete** one, or clear the seeded sample:
```sql
delete from public.round2_problems where id = 1;         -- one row
-- or start clean:
-- delete from public.round2_problems;
```

> Tip: remove the seeded "Sample Problem 1" once you've added the real ones.

---

## Step 4 — Verify

```sql
-- what the page will show once unlocked (run with your real code):
select * from public.verify_round2('VIBECRAFT-R2');

-- a wrong code returns 0 rows:
select * from public.verify_round2('nope');
```
The first should return your problems (ordered by `sort_order`); the second, nothing.

---

## Notes
- **Security:** `round2` and `round2_problems` have Row-Level Security with **no read policy**, so the
  public anon key can never read them directly. The only way in is `verify_round2(code)`
  (SECURITY DEFINER), which returns the list **only** on a code match.
- **No real PS yet?** Leave the placeholder and re-run these UPDATE/INSERT statements anytime before
  the event. Nothing in the app needs to change.
- **Where it's used:** the `/round/2` (Nether) page — locked screen → enter code → the problem
  statements + the "Submit Your Project" button appear.
