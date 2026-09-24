import type { World } from './WorldBackground'

/**
 * Blocky, world-specific Minecraft pixel-art drawn as inline SVG, layered behind the
 * card / page text. Keeps each dimension's palette; adds signature elements so it reads
 * as a real world, not a flat gradient. viewBox is anchored to the bottom so the ground
 * stays put when the layer is cover-fitted into wide/short cards or tall pages.
 */
function Overworld() {
  return (
    <>
      {/* sun */}
      <rect x="330" y="22" width="30" height="30" fill="#ffe873" />
      <rect x="335" y="27" width="20" height="20" fill="#fff4b0" opacity="0.7" />
      {/* clouds (drift) */}
      <g className="ws-drift" fill="#eef3ff" opacity="0.9">
        <rect x="40" y="40" width="60" height="14" />
        <rect x="52" y="30" width="34" height="12" />
        <rect x="210" y="26" width="52" height="12" />
        <rect x="222" y="18" width="28" height="10" />
      </g>
      {/* ground: dirt + grass top with block seams */}
      <rect x="0" y="212" width="400" height="60" fill="#7a5230" />
      <rect x="0" y="212" width="400" height="12" fill="#5a9b39" />
      <g stroke="#3f5e22" strokeWidth="1" opacity="0.5">
        {Array.from({ length: 13 }, (_, i) => (
          <line key={i} x1={i * 32} y1="212" x2={i * 32} y2="272" />
        ))}
      </g>
      <g fill="#8a5f38" opacity="0.6">
        <rect x="20" y="234" width="6" height="6" />
        <rect x="120" y="246" width="6" height="6" />
        <rect x="250" y="238" width="6" height="6" />
        <rect x="340" y="250" width="6" height="6" />
      </g>
      {/* oak tree */}
      <rect x="62" y="168" width="14" height="46" fill="#6b4a2a" />
      <rect x="64" y="168" width="4" height="46" fill="#5a3d22" />
      <g fill="#4e8c30">
        <rect x="40" y="128" width="58" height="40" />
        <rect x="34" y="138" width="70" height="22" />
      </g>
      <g fill="#5fa83a" opacity="0.8">
        <rect x="46" y="132" width="12" height="12" />
        <rect x="76" y="146" width="12" height="12" />
        <rect x="58" y="152" width="10" height="10" />
      </g>
      {/* creeper on the grass */}
      <g>
        <rect x="292" y="170" width="24" height="24" fill="#57a842" />
        <rect x="294" y="194" width="8" height="18" fill="#57a842" />
        <rect x="306" y="194" width="8" height="18" fill="#57a842" />
        <rect x="292" y="170" width="24" height="24" fill="#4f9b3a" opacity="0.4" />
        <rect x="297" y="176" width="5" height="5" fill="#0e1a0b" />
        <rect x="306" y="176" width="5" height="5" fill="#0e1a0b" />
        <rect x="301" y="182" width="6" height="9" fill="#0e1a0b" />
      </g>
      {/* flowers */}
      <g>
        <rect x="160" y="204" width="3" height="10" fill="#3f7a2e" />
        <rect x="158" y="200" width="7" height="6" fill="#e34b4b" />
        <rect x="200" y="205" width="3" height="9" fill="#3f7a2e" />
        <rect x="198" y="201" width="7" height="6" fill="#ffd23f" />
      </g>
    </>
  )
}

function Nether() {
  return (
    <>
      {/* glowstone clusters in the ceiling */}
      <g>
        <rect x="12" y="10" width="46" height="30" fill="#e0a84f" />
        <rect x="12" y="10" width="46" height="30" fill="#ffcf6b" opacity="0.5" />
        <rect x="330" y="16" width="40" height="26" fill="#e0a84f" />
        <rect x="330" y="16" width="40" height="26" fill="#ffcf6b" opacity="0.5" />
        <g fill="#fff0c0" opacity="0.8">
          <rect x="20" y="18" width="6" height="6" />
          <rect x="40" y="26" width="6" height="6" />
          <rect x="340" y="24" width="6" height="6" />
          <rect x="356" y="20" width="6" height="6" />
        </g>
      </g>
      {/* ghast (floats) */}
      <g className="ws-float">
        <rect x="238" y="70" width="48" height="46" fill="#e9e9ea" />
        <rect x="238" y="70" width="48" height="46" fill="#cfcfd2" opacity="0.35" />
        {/* tentacles */}
        <rect x="244" y="116" width="6" height="16" fill="#d7d7da" />
        <rect x="258" y="116" width="6" height="22" fill="#d7d7da" />
        <rect x="272" y="116" width="6" height="16" fill="#d7d7da" />
        {/* sad face */}
        <rect x="248" y="84" width="8" height="9" fill="#3a3a3a" />
        <rect x="268" y="84" width="8" height="9" fill="#3a3a3a" />
        <rect x="252" y="100" width="20" height="5" fill="#3a3a3a" />
        <rect x="250" y="104" width="5" height="4" fill="#3a3a3a" />
        <rect x="269" y="104" width="5" height="4" fill="#3a3a3a" />
      </g>
      {/* netherrack floor */}
      <rect x="0" y="216" width="400" height="56" fill="#5c1512" />
      <g fill="#7a1f17" opacity="0.7">
        <rect x="16" y="230" width="8" height="6" />
        <rect x="90" y="244" width="8" height="6" />
        <rect x="300" y="236" width="8" height="6" />
        <rect x="360" y="250" width="8" height="6" />
      </g>
      <g fill="#3a0d0d" opacity="0.7">
        <rect x="50" y="238" width="7" height="6" />
        <rect x="150" y="250" width="7" height="6" />
        <rect x="250" y="242" width="7" height="6" />
      </g>
      {/* lava pool (glows) */}
      <g className="ws-glow">
        <rect x="120" y="220" width="150" height="20" fill="#ff8a2a" />
        <rect x="120" y="220" width="150" height="7" fill="#ffd23f" />
        <rect x="150" y="224" width="24" height="4" fill="#fff2b0" opacity="0.8" />
        <rect x="220" y="226" width="20" height="4" fill="#fff2b0" opacity="0.7" />
      </g>
      {/* fire flames on netherrack */}
      <g>
        <polygon points="60,216 68,196 76,216" fill="#ff8a2a" />
        <polygon points="63,216 68,204 73,216" fill="#ffd23f" />
        <polygon points="330,216 337,200 344,216" fill="#ff8a2a" />
        <polygon points="333,216 337,206 341,216" fill="#ffd23f" />
      </g>
    </>
  )
}

function End() {
  return (
    <>
      {/* ender dragon silhouette (hovers) */}
      <g className="ws-float-slow" fill="#160f28">
        {/* wings */}
        <polygon points="150,70 92,44 70,72 120,86" />
        <polygon points="250,70 308,44 330,72 280,86" />
        <g fill="#241640">
          <polygon points="150,72 108,54 96,72 128,82" />
          <polygon points="250,72 292,54 304,72 272,82" />
        </g>
        {/* body + neck + head */}
        <rect x="176" y="70" width="48" height="20" />
        <rect x="196" y="86" width="16" height="16" />
        <rect x="192" y="58" width="16" height="16" />
        <rect x="188" y="48" width="18" height="14" />
        {/* snout */}
        <rect x="180" y="52" width="10" height="8" />
        {/* tail */}
        <rect x="212" y="76" width="26" height="9" />
        <rect x="236" y="79" width="18" height="6" />
        {/* magenta eye */}
        <rect x="192" y="52" width="5" height="4" fill="#d46bff" />
        <rect x="192" y="52" width="5" height="4" fill="#d46bff" className="ws-pulse" />
      </g>

      {/* obsidian pillars with end crystals */}
      <g>
        <rect x="46" y="150" width="26" height="122" fill="#241a3a" />
        <rect x="46" y="150" width="8" height="122" fill="#160f28" />
        <rect x="330" y="132" width="26" height="140" fill="#241a3a" />
        <rect x="330" y="132" width="8" height="140" fill="#160f28" />
        {/* crystals */}
        <g className="ws-pulse">
          <rect x="52" y="134" width="14" height="14" fill="#e05cff" transform="rotate(45 59 141)" />
          <rect x="336" y="116" width="14" height="14" fill="#e05cff" transform="rotate(45 343 123)" />
        </g>
      </g>

      {/* end-stone island (floating over the void) */}
      <g>
        <polygon points="120,214 280,214 264,244 136,244" fill="#c9c48f" />
        <rect x="120" y="204" width="160" height="12" fill="#e6e0a8" />
        <g fill="#b7b17a" opacity="0.6">
          <rect x="150" y="207" width="8" height="5" />
          <rect x="200" y="206" width="8" height="5" />
          <rect x="240" y="208" width="8" height="5" />
        </g>
        <polygon points="150,244 250,244 210,266 186,266" fill="#a49c68" />
      </g>

      {/* enderman on the island */}
      <g fill="#0d0d14">
        <rect x="192" y="150" width="16" height="16" />
        <rect x="196" y="166" width="8" height="26" />
        <rect x="190" y="166" width="5" height="24" />
        <rect x="205" y="166" width="5" height="24" />
        <rect x="193" y="192" width="5" height="12" />
        <rect x="202" y="192" width="5" height="12" />
      </g>
      <g className="ws-pulse" fill="#c56bff">
        <rect x="195" y="156" width="4" height="3" />
        <rect x="201" y="156" width="4" height="3" />
      </g>
    </>
  )
}

const SCENES: Record<World, () => JSX.Element> = {
  overworld: Overworld,
  nether: Nether,
  end: End,
}

export default function WorldScene({ world }: { world: World }) {
  const Scene = SCENES[world]
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMax slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <Scene />
    </svg>
  )
}
