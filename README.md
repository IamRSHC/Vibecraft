# VibeCraft 2026 — Website

Single self-contained static page. No build step, no dependencies.

## Deploy to Vercel

Drag this folder into vercel.com/new, or `vercel --prod` from inside it, or push to GitHub and import.

## Before you go live

- `ROUND2_PASSCODE`, `EVENT_START` / `EVENT_END` — in the first `<script>` block.
- Search `href="#"` — footer "Need help?" link + Submit button's Google Form URL.

## What changed this round

- **Banner fills the frame completely.** The banner is now built as a grid of image "blocks," each showing its own slice of the poster from a COVER-fitted image — so the blocks together reconstruct the whole banner AND fill the screen edge-to-edge with the poster's own content. Behind them sits a blurred, darkened copy of the same poster, so even the outer bleed is the poster's own art, not black bars. (Note: I can't generate brand-new AI art to invent scenery in the side gaps — that's not something I can do here — so this fills with the poster's own extended/covered content, which is the honest good-looking version of "fill the sides.")
- **Minecraft block-dissolve reveal.** As you scroll down, the banner breaks apart block by block, top rows first, each block shrinking and fading out — de-pixelating like a Minecraft structure. The page underneath is revealed progressively top-to-bottom as the blocks clear. The dissolve is tied directly to scroll position (not a one-shot animation), so it tracks your finger.
- **Scroll-up now cleanly RE-ASSEMBLES.** Because every block's state is a pure function of scroll position, scrolling back up rebuilds the banner block-by-block in reverse — no more tilted/faded ghost of the hero like in the old rotation version. That whole 3D-rotation mechanism (the thing that looked broken on reverse scroll) is gone entirely; the hero section is never transformed anymore.

Block size adapts to screen size and rebuilds on rotate/resize.

Please check in a real browser tab — the dissolve is GPU-driven and worth eyeballing directly.
