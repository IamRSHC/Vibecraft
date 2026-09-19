# VibeCraft 2026 — Website

Single self-contained static page. No build step, no dependencies.

## Deploy to Vercel

Drag this folder into vercel.com/new, or `vercel --prod` from inside it, or push to GitHub and import — no build command needed, output directory is root (`.`).

## Before you go live, edit these in index.html

- `ROUND2_PASSCODE`, `EVENT_START` / `EVENT_END` — in the first `<script>` block.
- Search `href="#"` — footer "Need help?" link and the Submit button's Google Form URL still need real links.

## What changed this round

- **Banner no longer crops top/bottom.** It's now two layers: a blurred, darkened full-bleed copy of the poster fills the entire screen edge-to-edge behind it, and the complete, uncropped poster sits centered on top at its full content. Nothing from the image is lost, and there's no empty space either.
- **3D rotation added to the reveal.** The banner now tips down and away hinged at its bottom edge (like a trapdoor), and the hero content tips up into place hinged at its top edge, turning the same direction — meant to read as a single coordinated wheel-turn rather than two things sliding past each other. This is layered on as pure `transform` (rotateX + perspective) on top of the already-working structure from last round — hero's `position` is never touched, so it can't reopen the overlap bug.
- **Hero section is plain again** — no background image on the countdown/timer page itself. The Minecraft poster now only appears once, in the intro banner; the functional site underneath stays clean and dark.

As always — please check this in a real browser tab. The rotation in particular is the kind of thing that can look different across browsers/GPUs, so it's worth a direct look before you trust it.
