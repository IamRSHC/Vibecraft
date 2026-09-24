import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { pad, type TimerView } from '../lib/timer'

interface Props {
  view: TimerView
  label: string
  live: boolean
}

const box: CSSProperties = {
  minWidth: 52,
  padding: '7px 5px 5px',
  borderRadius: 4,
  background: 'rgba(12,26,48,0.38)',
  border: '1px solid rgba(125,210,255,0.5)',
  textAlign: 'center',
}
const digit: CSSProperties = {
  fontFamily: '"Press Start 2P", monospace',
  fontSize: 24,
  color: '#cdeeff',
  textShadow: '0 0 8px rgba(110,200,255,0.95), 0 0 2px rgba(200,240,255,0.9)',
  lineHeight: 1.2,
}
const colon: CSSProperties = { ...digit, fontSize: 20, opacity: 0.85 }
const unit: CSSProperties = {
  display: 'block',
  marginTop: 5,
  fontSize: 8.5,
  letterSpacing: 1,
  color: '#84b9e2',
}
const overlay: CSSProperties = {
  position: 'absolute',
  inset: 0,
  borderRadius: 10,
  pointerEvents: 'none',
  mixBlendMode: 'screen',
}
const textRow: CSSProperties = { position: 'relative', zIndex: 2 }

export default function HologramTimer({ view, label, live }: Props) {
  const paused = view.status === 'paused'
  const ended = view.status === 'ended'
  const dotColor = ended ? '#E33D2E' : paused ? '#FFB35C' : '#6FA043'

  return (
    <motion.div
      role="timer"
      aria-live="off"
      aria-label={`${label}: ${view.h} hours ${view.m} minutes ${view.s} seconds`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: [0, -6, 0] }}
      transition={{
        opacity: { duration: 0.6 },
        y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
      }}
      style={{
        position: 'relative',
        width: 'max-content',
        padding: '14px 16px 12px',
        borderRadius: 10,
        // translucent, cyan-tinted glass so the scene shows through (holographic)
        background: 'linear-gradient(180deg, rgba(90,170,255,0.10), rgba(124,77,255,0.05))',
        border: '1px solid rgba(125,210,255,0.55)',
        boxShadow:
          '0 0 26px rgba(90,180,255,0.35), 0 0 60px rgba(124,77,255,0.22), inset 0 0 22px rgba(120,200,255,0.14)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
      }}
    >
      {/* moving scanlines */}
      <div
        aria-hidden
        className="holo-scan"
        style={{
          ...overlay,
          background:
            'repeating-linear-gradient(0deg, rgba(150,220,255,0.13) 0 1px, transparent 1px 4px)',
        }}
      />
      {/* flickering holographic sheen */}
      <div
        aria-hidden
        className="holo-flicker"
        style={{
          ...overlay,
          background: 'linear-gradient(180deg, rgba(120,200,255,0.12), rgba(124,77,255,0.04))',
        }}
      />
      {/* projector glow at the base */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '15%',
          right: '15%',
          bottom: -7,
          height: 12,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(120,205,255,0.55), transparent 72%)',
          filter: 'blur(5px)',
          pointerEvents: 'none',
        }}
      />

      {/* label */}
      <div
        style={{
          ...textRow,
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          marginBottom: 9,
          fontSize: 10.5,
          letterSpacing: 1.3,
          textTransform: 'uppercase',
          color: '#9fd8ff',
          fontWeight: 700,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: dotColor,
            boxShadow: `0 0 8px ${dotColor}`,
          }}
        />
        {label}
      </div>

      {/* digits */}
      <div style={{ ...textRow, display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={box}>
          <span style={digit}>{pad(view.h)}</span>
          <span style={unit}>HRS</span>
        </div>
        <span style={colon}>:</span>
        <div style={box}>
          <span style={digit}>{pad(view.m)}</span>
          <span style={unit}>MIN</span>
        </div>
        <span style={colon}>:</span>
        <div style={box}>
          <span style={digit}>{pad(view.s)}</span>
          <span style={unit}>SEC</span>
        </div>
      </div>
    </motion.div>
  )
}
