import type { CSSProperties } from 'react'
import WorldScene from './WorldScene'

export type World = 'overworld' | 'nether' | 'end'

/* stylized (CSS-only) Minecraft dimensions — no images */
const BASE: Record<World, string> = {
  overworld: 'linear-gradient(180deg,#5c93d6 0%,#7fb0e0 24%,#4c7a2e 52%,#2f5018 100%)',
  nether: 'radial-gradient(130% 95% at 50% 108%, #ff8a2a 0%, #b3311c 30%, #5c1512 62%, #2a0a0a 100%)',
  end: 'radial-gradient(120% 90% at 50% 38%, #342d5a 0%, #1a1636 52%, #0b0d1e 100%)',
}
const ACCENT: Record<World, string> = {
  // clouds
  overworld:
    'radial-gradient(52% 26% at 22% 14%, rgba(255,255,255,0.5), transparent 62%), radial-gradient(40% 20% at 74% 10%, rgba(255,255,255,0.35), transparent 62%)',
  // lava glow
  nether: 'radial-gradient(70% 42% at 50% 102%, rgba(255,150,40,0.55), transparent 72%)',
  // ender haze
  end: 'radial-gradient(52% 40% at 50% 58%, rgba(124,77,255,0.30), transparent 72%)',
}
const GRID =
  'repeating-linear-gradient(0deg, rgba(0,0,0,0.14) 0 1px, transparent 1px 26px),' +
  'repeating-linear-gradient(90deg, rgba(0,0,0,0.14) 0 1px, transparent 1px 26px)'
// lighter than before so the world-scene art stays visible; still enough for text contrast
const OVERLAY =
  'linear-gradient(180deg, rgba(11,14,31,0.26) 0%, rgba(11,14,31,0.34) 45%, rgba(11,14,31,0.60) 100%)'

/**
 * Stylized world backdrop. `fixed` (default) fills the viewport behind page content;
 * pass `fixed={false}` inside a `position:relative` parent (e.g. a deck card).
 */
export default function WorldBackground({ world, fixed = true }: { world: World; fixed?: boolean }) {
  const layer: CSSProperties = { position: fixed ? 'fixed' : 'absolute', inset: 0, pointerEvents: 'none' }
  return (
    <div aria-hidden="true" style={{ ...layer, zIndex: fixed ? -1 : 0, overflow: 'hidden' }}>
      <div style={{ ...layer, background: BASE[world] }} />
      <div style={{ ...layer, background: ACCENT[world] }} />
      <WorldScene world={world} />
      <div style={{ ...layer, background: GRID, opacity: 0.32 }} />
      <div style={{ ...layer, background: OVERLAY }} />
    </div>
  )
}
