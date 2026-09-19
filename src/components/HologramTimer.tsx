import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { pad, type TimerView } from '../lib/timer'

interface Props {
  view: TimerView
  label: string
  live: boolean
}

const box: CSSProperties = {
  minWidth: 58,
  padding: '8px 4px 6px',
  borderRadius: 4,
  background: 'rgba(11,14,31,0.55)',
  border: '1px solid rgba(168,139,255,0.55)',
  textAlign: 'center',
}
const digit: CSSProperties = {
  fontFamily: '"Press Start 2P", monospace',
  fontSize: 26,
  color: '#CFC4FF',
  textShadow: '0 0 10px rgba(124,77,255,0.9)',
  lineHeight: 1.2,
}
const unit: CSSProperties = {
  display: 'block',
  marginTop: 6,
  fontSize: 9,
  letterSpacing: 1,
  color: '#9a8fd6',
}

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
        padding: '16px 18px 14px',
        borderRadius: 10,
        background:
          'linear-gradient(180deg, rgba(124,77,255,0.16), rgba(124,77,255,0.05))',
        border: '1px solid rgba(168,139,255,0.6)',
        boxShadow: '0 0 30px rgba(124,77,255,0.35), inset 0 0 22px rgba(124,77,255,0.12)',
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
      }}
    >
      {/* scanlines */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 10,
          pointerEvents: 'none',
          background:
            'repeating-linear-gradient(0deg, rgba(168,139,255,0.10) 0 1px, transparent 1px 4px)',
          mixBlendMode: 'screen',
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 10,
          fontSize: 11,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: '#A88BFF',
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
        {!live && (
          <span style={{ fontSize: 9, opacity: 0.7, letterSpacing: 0.5 }}>· preview</span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={box}>
          <span style={digit}>{pad(view.h)}</span>
          <span style={unit}>HRS</span>
        </div>
        <span style={{ ...digit, fontSize: 22 }}>:</span>
        <div style={box}>
          <span style={digit}>{pad(view.m)}</span>
          <span style={unit}>MIN</span>
        </div>
        <span style={{ ...digit, fontSize: 22 }}>:</span>
        <div style={box}>
          <span style={digit}>{pad(view.s)}</span>
          <span style={unit}>SEC</span>
        </div>
      </div>
    </motion.div>
  )
}
