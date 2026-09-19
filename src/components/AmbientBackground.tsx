import { motion, useReducedMotion } from 'framer-motion'

const BLOCKS = [
  { left: '6%', top: '18%', size: 46, color: 'rgba(124,77,255,0.10)', dur: 15 },
  { left: '88%', top: '12%', size: 34, color: 'rgba(255,145,48,0.09)', dur: 18 },
  { left: '80%', top: '62%', size: 54, color: 'rgba(76,122,46,0.10)', dur: 21 },
  { left: '4%', top: '70%', size: 40, color: 'rgba(227,61,46,0.08)', dur: 17 },
  { left: '50%', top: '85%', size: 30, color: 'rgba(124,77,255,0.08)', dur: 19 },
  { left: '94%', top: '40%', size: 26, color: 'rgba(255,179,92,0.08)', dur: 16 },
]

export default function AmbientBackground() {
  const reduce = useReducedMotion()
  return (
    <div className="ambient" aria-hidden="true">
      {BLOCKS.map((b, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size,
            borderRadius: 6,
            background: b.color,
            border: `1px solid ${b.color}`,
          }}
          animate={reduce ? {} : { y: [0, -22, 0], rotate: [0, 8, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
        />
      ))}
    </div>
  )
}
