# VibeCraft — Update Instructions (Phase-by-Phase Build Spec)

> **Purpose:** a complete, self-contained plan for a **fresh Claude Code session** to implement the next round of VibeCraft upgrades. Build **one phase at a time**, verify + commit after each, and do **not** attempt the whole thing in one shot (protects tokens and keeps debugging isolated).
>
> The phase order below is **optimal** (foundational/low-risk first → complex/backend last), but the order is **not mandatory** — respect the dependency notes and you can resequence.

---

## 0. Repo context (read first)

- **Location:** `F:\NTT\vibecraft-website` (its own git repo; remote `https://github.com/IamRSHC/Vibecraft`, branch `main`).
- **Stack:** Vite + React 18 + TypeScript + Tailwind 3 + Framer Motion 11 + React Three Fiber/three (hero 3D) + `@supabase/supabase-js` + react-router-dom 6. No build step surprises: `npm run dev`, `npm run build`, `npm run typecheck`.
- **Current HEAD:** `d90356f` ("Updated readme"). The "good" baseline layout (full-height hero) is from `f315718`.
- **Key files:**
  - `src/App.tsx` — page composition + routes (`/`, `/admin`).
  - `src/main.tsx` — Router setup.
  - `src/config.ts` — event + link constants (**put all GForm URLs here**).
  - `src/components/` — `Nav, Hero, VoxelDiorama, HologramTimer, About, Rules, Format, Rounds, Round2Gate, Submit, Prizes, Partners, Footer, AmbientBackground`. `voxel/parts.tsx` = shared 3D pieces.
  - `src/hooks/useTimer.ts`, `src/lib/timer.ts`, `src/lib/supabase.ts`.
  - `src/admin/AdminPanel.tsx` — `/admin` timer control.
  - `supabase/schema.sql`, `supabase/SETUP.md` — Supabase timer + Round 2 gate (already written).
  - `src/index.css` — all bespoke CSS (design tokens at `:root`).
  - `public/banner.jpg` — poster used by the intro.
- **Design tokens (`:root` in `src/index.css`):** `--night #0B0E1F`, `--night-2 #141A35`, `--parchment #F1E9D2`, `--ink #1B140C`, `--grass #4C7A2E`, `--grass-dark #345319`, `--grass-light #6FA043`, `--torch #FF9130`, `--torch-light #FFB35C`, `--tnt #E33D2E`, `--ender #7C4DFF`, `--ender-light #A88BFF`. Fonts: `Press Start 2P` (headings/pixel), `Rubik` (body).

### Current working-tree state (IMPORTANT)
As of writing, the working tree has **uncommitted edits** in `HologramTimer.tsx`, `VoxelDiorama.tsx`, `index.css` that contain 3 **good fixes to KEEP**:
1. **Hologram fits inside its box** (card sizes to content, centered) + a **holographic look** (translucent cyan, moving scanlines, flicker, glowing digits, base glow).
2. **Moving divider blocks** (the green pixel strip's blocks scroll horizontally).
3. **"PREVIEW" removed** from the timer label.

…and **one edit to REVERT**: `.hero { min-height: auto; padding: clamp(...) }` must go **back to `min-height:100vh; padding:56px 0`** (the "square" dimensions).

If you are on a clean checkout **without** these edits, implement all four per **Appendix A**. Phase 0 reconciles this.

---

## 1. Global conventions & guardrails

- **Per phase:** implement → `npm run typecheck` (0 errors) → `npm run build` (success) → run `npm run dev`, sanity-check in a browser → **commit** with the phase's message → stop. Do not start the next phase in the same commit.
- **Commit messages:** `Phase N: <short summary>`. End each with:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`
- **Never one-shot.** If a phase feels large (Phases 4/6), split into sub-commits.
- **Placeholders:** all Google Form URLs live in `src/config.ts` as clearly-named constants set to `'REPLACE_ME'` (or a comment). Never hardcode a form URL in a component.
- **Accessibility & motion:** honor `prefers-reduced-motion` for every new animation (the global rule in `index.css` neutralizes CSS animations; for JS/Framer/R3F use `useReducedMotion()` and gate loops). Keyboard-navigable interactive elements.
- **Responsive:** verify at desktop (~1280) and phone (~380) widths. Body already has `overflow-x:hidden`.
- **Keep as-is (do not touch unless a phase says so):** the 3D hero scene (`VoxelDiorama` scene contents / `voxel/parts.tsx`), `AmbientBackground`, `About`, `Prizes`, `Partners`, `Footer`, hidden scrollbar, `HRS:MIN:SEC` timer format.

### Google Form placeholders (owner will supply real URLs)
Add to `src/config.ts`:
```ts
export const REGISTER_FORM_URL   = 'REPLACE_ME' // ① team registration (hero + nav)
export const ROUND1_SUBMIT_URL   = 'REPLACE_ME' // ② Round 1 submission
export const ROUND2_SUBMIT_URL   = 'REPLACE_ME' // ③ Round 2 project submission
export const ROUND3_PPT_URL      = 'REPLACE_ME' // ④ Round 3 PPT submission
```
Until filled, CTAs should still render but point at the placeholder (open in a new tab). Optionally, if a URL is still `'REPLACE_ME'`, show a small "coming soon" disabled state — nice-to-have, not required.

---

## 2. The Phases

### Phase 0 — Baseline reconcile + config  *(trivial · no deps)*
**Goal:** clean, correct starting point.
- Keep the 3 good uncommitted fixes (hologram-in-box + holo effect, moving divider, PREVIEW removed). Verify against **Appendix A**; if missing, implement them.
- **Revert only** the `.hero` rule in `src/index.css` back to:
  ```css
  .hero{ min-height:100vh; display:flex; align-items:center; position:relative; padding:56px 0; }
  ```
- Add the 4 GForm placeholder constants (section 1) to `src/config.ts`.
**Accept:** builds clean; hero is full-viewport height again; hologram sits fully inside its box with a hologram look and no "PREVIEW"; divider's green blocks slide; timer reads `HRS:MIN:SEC`.
**Commit:** `Phase 0: baseline reconcile + form config`

---

### Phase 1 — "Register" opens the GForm  *(easy · deps: Phase 0)*
**Goal:** registration goes to a Google Form, not the on-page section.
- In `Hero.tsx`, the **"Register your team"** button → `<a href={REGISTER_FORM_URL} target="_blank" rel="noopener noreferrer">`.
- In `Nav.tsx`, the **"Register Now"** CTA → same GForm URL, new tab.
- Leave the plain **"Register"** nav text-link pointing at the Team & Registration section for now (its target changes in Phase 2).
**Accept:** both CTAs open the placeholder form in a new tab; no scroll-to-section behavior on them.
**Commit:** `Phase 1: register CTAs open the registration GForm`

---

### Phase 2 — Team & Registration restructure  *(easy–medium · deps: Phase 1)*
**Goal:** remove How-to-Register; merge Format & Ground Rules; delete the standalone Submit section; trim page space.
- In `Rules.tsx` (the "Team & Registration" section): **delete the "How to Register" card entirely** (removes the CampusQuest button/content).
- Put **"Format & Ground Rules"** into the right column beside **Team Rules**. Its 4 tiles (🏫 offline, 🤖 AI tools, 🤝 play fair, ⏱️ submit window) stack **vertically** in that column. Reuse the copy from `Format.tsx`.
- **Delete the standalone `Format.tsx` section** usage from `App.tsx` (the tiles now live inside Team & Registration).
- **Delete the standalone `Submit.tsx` section** usage from `App.tsx` (submission moves into round pages, Phases 3/6).
- **Nav cleanup** (`Nav.tsx`): remove the **"Submit"** link (submission is per-round now). Keep Rules, Register, Rounds, Prizes + "Register Now" CTA. Point the **"Register"** text-link at the Team & Registration section (`#rules`) or the GForm — pick `#rules` (info) to complement the CTA.
- Ensure the section has balanced spacing (two equal columns; stack to 1 column under ~760px).
**Accept:** Team & Registration shows **Team Rules | Format & Ground Rules** side-by-side; no separate F&GR or Submit sections remain; nav has no "Submit"; no large empty band left behind.
**Commit:** `Phase 2: merge Format+Ground Rules into Team & Registration, drop standalone sections`

---

### Phase 3 — Routing + world backgrounds + Round 1 & Round 3 pages  *(medium · deps: Phase 2)*
**Goal:** separate pages per round; the two open rounds fully built.
- Add routes in `main.tsx` (or a `routes.tsx`): `/round/1`, `/round/2`, `/round/3` (keep `/` and `/admin`). Lazy-load round pages.
- Build **`WorldBackground`** component (see **Appendix D**) with `world: 'overworld' | 'nether' | 'end'` — stylized CSS worlds, no images.
- Build a shared **`RoundPage` layout**: `<Nav>` + full-bleed `WorldBackground` + a readable content panel + **"← Back to VibeCraft"** link (react-router `Link` to `/`). Themed per round.
- **`/round/1` (Overworld, OPEN):** heading "Round 1 — The Elimination"; reuse the Round 1 copy currently in `Rounds.tsx`; add a **"Submit Round 1"** CTA → `ROUND1_SUBMIT_URL` (new tab).
- **`/round/3` (The End, OPEN):** heading "Round 3 — The Finale"; finale copy; **"Submit your PPT"** CTA → `ROUND3_PPT_URL` (new tab).
- **`/round/2` (Nether):** create the page shell + `WorldBackground("nether")` but show a **temporary "Locked — enter access code" stub** (the real Supabase gate + content arrive in Phase 6). Do NOT put secret content here yet.
**Accept:** visiting `/round/1` and `/round/3` shows themed pages with working GForm CTAs and a back link; `/round/2` shows a themed locked stub; direct URL loads work (SPA rewrite `vercel.json` already present).
**Commit:** `Phase 3: round routes + WorldBackground + Round 1 & Round 3 pages`

---

### Phase 4 — Rounds "stacked deck" carousel (home)  *(medium–complex · deps: Phase 3)*
**Goal:** replace the current 2-pill + expand-panel Rounds UI with an **OxygenOS-style stacked-widget deck** (one round shown at a time, others peeking behind) that links to the round pages. Full spec in **Appendix C**.
- Replace the pills/`Round2Gate` panel inside `Rounds.tsx` with a new **`RoundsDeck`** component. (The gate logic is not needed here anymore — it lives on `/round/2`.)
- 3 cards: Round 1 (overworld), Round 2 (nether), Round 3 (end). Each card = `WorldBackground` + round title + one-line sub + a "front" affordance.
- Behavior: **auto-advance ~5s, pause on hover/focus/drag, resume after**; **click a peeking card → bring it to front**; **click the front card → navigate to `/round/N`**; **dots + drag/swipe + keyboard arrows** for manual nav; reduced-motion → static, dot/arrow-navigable stack, no auto-shuffle.
**Accept:** only one round is prominent at a time with the others stacked behind; it auto-cycles and pauses on hover; clicking behind cards cycles; clicking the front card opens that round's page; dots/keyboard/drag all work; smooth, no jank; reduced-motion path works.
**Commit (may split):** `Phase 4: stacked-deck rounds carousel`

---

### Phase 5 — Supabase live admin timer (verify + wire setup)  *(complex/backend · deps: Phase 0; mostly already built)*
**Goal:** the hero "EVENT TIMER" is a real, organizer-controlled live timer; **only the admin** can start/pause/adjust, participants read-only.
- The code already exists: `useTimer.ts`, `AdminPanel.tsx` (`/admin`), `lib/supabase.ts`, `lib/timer.ts`, `supabase/schema.sql`. **Verify it's intact and wired to `HologramTimer`.**
- Confirm graceful fallback when Supabase env is absent (shows a plain countdown; `/admin` shows "not configured").
- Follow `supabase/SETUP.md`: create the Supabase project, run `schema.sql` (replace `ADMIN_EMAIL_HERE`), create the single admin user + disable public signups, add `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` to `.env.local` and to Vercel env. (**Owner action** — see Appendix B.)
- Test: with env set, `/admin` login → Start/Pause/Resume/Stop/Reset + ±minute adjust; verify the hero timer updates on a second browser within ~1s; verify a non-admin cannot write.
**Accept:** fallback works with no env; with env + admin login, timer is controllable and syncs; participants can't mutate it.
**Commit:** `Phase 5: verify + wire Supabase live admin timer`

---

### Phase 6 — Round 2 secret gate (Supabase) on `/round/2`  *(complex/backend · deps: Phases 3 & 5)*
**Goal:** Round 2's problem statement/content is **truly secret** — never shipped to the browser until a code is verified server-side.
- Reuse `round2` table + `verify_round2(code)` RPC from `supabase/schema.sql`; set the real code + Round 2 text via SQL (Appendix B).
- Move/adapt `Round2Gate.tsx` into the **`/round/2` page** (replacing the Phase 3 stub): a code input → `supabase.rpc('verify_round2', { code })` → on match, render the returned **Round 2 details/PS** + the **"Submit Your Project"** CTA → `ROUND2_SUBMIT_URL` (new tab). On wrong code, shake/error. Remember unlock per-device (re-verify a stored code on load; never persist the PS text itself).
- If Supabase isn't configured, the page shows a clear "Round 2 opens on event day" state (no fake content).
**Accept:** with a wrong/no code, the Round 2 text is **not present in the DOM/source**; correct code reveals details + submit CTA; refresh keeps it unlocked (re-verified); Round 3 stays open (no code).
**Commit:** `Phase 6: server-gated Round 2 page + submit CTA`

---

### Phase 7 — Polish, QA, deploy  *(final · deps: all)*
- Cross-check **dimensions**: hero full-height ("square"), no excess empty bands anywhere (tune per-section paddings, don't collapse the hero).
- Full pass: responsive (desktop/tablet/phone), reduced-motion on every animation (hero, deck, divider, hologram), all links/CTAs, `/admin`, all `/round/*` routes via direct URL.
- `npm run build` clean; deploy to Vercel; set the 4 form URLs in `config.ts`; set Supabase env vars in Vercel; run `supabase/schema.sql`.
- Update `README.md` with the new structure + setup.
**Commit:** `Phase 7: polish, QA, deploy prep`

---

## Appendix A — Baseline small-fix specs (only if not already present)

**Hologram (`HologramTimer.tsx` + `index.css`):**
- Card `width: max-content` (so the border wraps HRS/MIN/SEC + label — nothing overflows), centered in the overlay via the wrapper `left:50%; transform:translateX(-50%)` (in `VoxelDiorama.tsx`, no fixed width).
- Holographic look: translucent cyan-tinted glass bg; a **moving scanlines** layer (`@keyframes holoScan` translating `background-position` ~8px, ~0.7s linear infinite); a **flicker** layer (`@keyframes holoFlicker` opacity flutter ~3.6s); digits `#cdeeff` with cyan text-shadow glow; a soft **projector glow** ellipse at the base. Text rows `position:relative; z-index:2` above the overlays. Guard both keyframes under `prefers-reduced-motion: reduce { animation:none }`.
- Remove the `· preview` span entirely.

**Divider (`index.css`):**
```css
@keyframes dividerScroll{ from{background-position:0 0;} to{background-position:44px 0;} }
.divider{ /* keep existing */ animation:dividerScroll 3s linear infinite; }
```

**Hero (`index.css`):** `min-height:100vh; padding:56px 0;` (the square feel).

---

## Appendix B — Supabase setup checklist (owner)
Follow `supabase/SETUP.md`. Summary:
1. Create a free Supabase project; copy the **URL** + **anon key**.
2. `supabase/schema.sql` → replace `ADMIN_EMAIL_HERE` with the organiser email → run in SQL editor.
3. Auth → add the organiser user; **disable public sign-ups**.
4. Set the real Round 2 gate + text:
   ```sql
   update public.round2 set access_code='REAL-CODE', title='Round 2 — …', body='…full PS…' where id=1;
   ```
5. `.env.local` (and Vercel env): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
> Anon key is public/safe; RLS enforces admin-only timer writes and keeps `round2` unreadable except via `verify_round2`.

---

## Appendix C — `RoundsDeck` component spec (Phase 4)

**Data**
```ts
const ROUNDS = [
  { id:1, title:'Round 1',  sub:'Open to every registered team', world:'overworld', href:'/round/1' },
  { id:2, title:'Round 2',  sub:'Unlocks after Round 1 results', world:'nether',    href:'/round/2' },
  { id:3, title:'Round 3',  sub:'The grand finale',              world:'end',        href:'/round/3' },
]
```
**State:** `active` (0..2), `paused` (bool). `depth = (i - active + 3) % 3` → 0 front, 1 middle, 2 back.

**Layout:** a `position:relative` section container with a fixed height (e.g. `clamp(300px, 42vw, 380px)`). Each card `position:absolute; inset:0`, animated by `depth` with Framer Motion:
- depth 0: `scale 1, y 0, opacity 1, zIndex 30`, pointer to navigate.
- depth 1: `scale ~0.94, y +18px, opacity .8, zIndex 20`.
- depth 2: `scale ~0.88, y +34px, opacity .6, zIndex 10`.
(So the two behind peek below the front card like a stacked deck. Tune offsets for a clean "OxygenOS" look; you may offset slightly up instead of down — pick what reads best.)

**Card:** `WorldBackground(world)` + dark gradient overlay for contrast + `title` (Press Start 2P) + `sub` + a subtle "click to open" hint on the front card + a round-colored corner icon.

**Interactions**
- Auto-advance: `setInterval(() => setActive(a => (a+1)%3), 5000)`; **clear/skip while `paused`**.
- `paused` = true on `onMouseEnter`/`onFocusCapture`/drag-start of the container; false on leave/blur/drag-end.
- Click a **peeking** card (depth≠0) → `setActive(thatIndex)`.
- Click the **front** card (depth 0) → `useNavigate()(href)`.
- **Dots:** 3 buttons under the deck; `aria-current` on active; click → `setActive`.
- **Drag/swipe:** Framer `drag="x"` on the front card, `dragConstraints` tight, `onDragEnd` → left past threshold = next, right = prev; snap back.
- **Keyboard:** container `tabIndex=0`; ArrowRight/Down = next, ArrowLeft/Up = prev; Enter/Space = navigate front card.
- **Reduced motion (`useReducedMotion()`):** no auto-advance; no big transition (instant/simple); still navigable by dots/arrows/keyboard. Acceptable fallback: render the 3 as a simple vertical list of linked cards.

**A11y:** container `role="group" aria-roledescription="carousel"`; an `aria-live="polite"` node announcing the active round title; each card labeled; dots are real `<button>`s.

**Perf:** animate only `transform`/`opacity`. No layout thrash.

---

## Appendix D — `WorldBackground` component spec (Phase 3)

`WorldBackground({ world })` → an absolutely-positioned filler div, **stylized CSS only (no images)**, plus a dark overlay for text legibility. Suggestions (tune freely, keep it "blocky/Minecraft-y" via repeating gradients):
- **overworld:** top sky gradient `#6fb0ff → #bfe0ff` fading to a grass band `--grass-light/--grass/--grass-dark`; a faint pixel grid via `repeating-linear-gradient` in both axes; soft clouds (blurred white ellipses).
- **nether:** deep maroon `#3a0d0d → #7a1f17` with an orange **lava glow** (radial `--torch` at the bottom) and netherrack speckle via layered `repeating-linear-gradient`.
- **end:** dark navy/void `#0b0f1f` with pale **end-stone** tint (`#d8d8a8` low-opacity blotches) and a purple ender haze (`--ender`).
Each variant ends with a `linear-gradient(rgba(11,14,31,.55), rgba(11,14,31,.75))` overlay so white/parchment text stays readable. Expose a `dim` prop if a card needs more contrast than a full page.

---

## Open items the owner must provide
- **4 Google Form URLs:** registration, Round 1 submit, Round 2 submit, Round 3 PPT.
- **Supabase:** project + env vars + run `schema.sql` + set admin email + set real Round 2 code/text (Appendix B).
- Confirm the exact **Round 2 secret content** (title + full problem statement) to store in `round2`.

## Assumptions baked in (flag if wrong)
- Registration is now the GForm; **CampusQuest is removed**.
- Round→world mapping: **R1 Overworld, R2 Nether, R3 End**.
- Nav loses its **"Submit"** item (submission is per-round).
- Round 1 & Round 3 pages are **open**; **only Round 2** is code-gated.
