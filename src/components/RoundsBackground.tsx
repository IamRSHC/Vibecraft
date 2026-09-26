import { useEffect, useRef } from 'react'

// Decorative backdrop for "The Rounds": a churning nether-portal vortex (the majority) with a
// sparse field of drifting ender particles and rune glyphs over it (the minority).
// CSS-only motion (transform/opacity), paused while the section is off-screen.

interface Particle {
  x: number // % of the section
  y: number
  size: number // px
  dur: number // s
  delay: number // s
  sway: number // px of sideways drift over the rise
}

// Fixed positions (not random) so the layout is stable; weighted toward the portal's centre.
// The last six are hidden on phones.
const PARTICLES: Particle[] = [
  { x: 38, y: 62, size: 5, dur: 12, delay: 0, sway: -40 },
  { x: 60, y: 58, size: 4, dur: 14, delay: 3, sway: 30 },
  { x: 47, y: 74, size: 6, dur: 13, delay: 6, sway: -25 },
  { x: 55, y: 80, size: 3, dur: 11, delay: 1.5, sway: 35 },
  { x: 30, y: 70, size: 4, dur: 15, delay: 8, sway: -35 },
  { x: 68, y: 72, size: 5, dur: 12.5, delay: 4.5, sway: 20 },
  { x: 42, y: 50, size: 3, dur: 16, delay: 10, sway: -20 },
  { x: 62, y: 44, size: 4, dur: 13.5, delay: 7, sway: 40 },
  { x: 24, y: 58, size: 3, dur: 14.5, delay: 2, sway: -30 },
  { x: 76, y: 60, size: 4, dur: 11.5, delay: 9, sway: 25 },
  { x: 52, y: 90, size: 7, dur: 15.5, delay: 5, sway: -45 },
  { x: 34, y: 86, size: 3, dur: 12, delay: 11, sway: 30 },
  { x: 72, y: 86, size: 5, dur: 16, delay: 12.5, sway: -20 },
  { x: 18, y: 76, size: 3, dur: 13, delay: 6.5, sway: 35 },
]

// Enchanting-table style runes (Standard Galactic look-alikes).
const GLYPHS = [
  { char: 'ᔑ', x: 27, y: 66, dur: 18, delay: 0 },
  { char: '⍑', x: 71, y: 52, dur: 20, delay: 6 },
  { char: 'ᒷ', x: 58, y: 84, dur: 19, delay: 11 },
  { char: '⎓', x: 40, y: 40, dur: 21, delay: 15 },
]

export default function RoundsBackground() {
  const root = useRef<HTMLDivElement>(null)

  // Pause every animation while the section is scrolled out of view.
  useEffect(() => {
    const el = root.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([entry]) => {
      el.toggleAttribute('data-paused', !entry.isIntersecting)
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="rounds-bg" ref={root} aria-hidden="true">
      <div className="portal">
        <div className="portal-core" />
        <div className="portal-swirl a" />
        <div className="portal-swirl b" />
        <div className="portal-ring" />
      </div>

      <div className="ender-field">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="ender-p"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
              ['--sway' as string]: `${p.sway}px`,
            }}
          />
        ))}
      </div>

      <div className="ender-glyphs">
        {GLYPHS.map((g, i) => (
          <span
            key={i}
            className="ender-glyph"
            style={{ left: `${g.x}%`, top: `${g.y}%`, animationDuration: `${g.dur}s`, animationDelay: `${g.delay}s` }}
          >
            {g.char}
          </span>
        ))}
      </div>

      <div className="rounds-vignette" />
    </div>
  )
}
