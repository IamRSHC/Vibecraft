// Shared look for the organiser panel (/admin).
import type { CSSProperties, ReactNode } from 'react'

export const page: CSSProperties = {
  minHeight: '100vh',
  background: '#0B0E1F',
  color: '#F1E9D2',
  fontFamily: 'Rubik, system-ui, sans-serif',
  padding: '40px 20px',
}
export const card: CSSProperties = {
  maxWidth: 560,
  margin: '0 auto',
  background: '#141A35',
  border: '3px solid #1B140C',
  borderRadius: 6,
  padding: 28,
  boxShadow: '6px 6px 0 rgba(0,0,0,0.5)',
}
export const input: CSSProperties = {
  padding: '10px 12px',
  border: '2px solid #1B140C',
  borderRadius: 3,
  background: '#fff',
  color: '#1B140C',
  fontSize: 15,
  width: '100%',
}

export function Btn({
  children,
  onClick,
  tone = 'grass',
  disabled,
}: {
  children: ReactNode
  onClick?: () => void
  tone?: 'grass' | 'torch' | 'tnt' | 'ghost'
  disabled?: boolean
}) {
  const bg = { grass: '#4C7A2E', torch: '#FF9130', tnt: '#E33D2E', ghost: 'transparent' }[tone]
  const col = tone === 'torch' ? '#1B140C' : '#F1E9D2'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: bg,
        color: col,
        border: '3px solid #1B140C',
        borderRadius: 3,
        padding: '10px 16px',
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  )
}
