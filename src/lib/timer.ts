export type TimerStatus = 'idle' | 'running' | 'paused' | 'ended'

/** Canonical timer state (mirrors the `timer_state` row in Supabase). */
export interface TimerState {
  status: TimerStatus
  ends_at: string | null // ISO timestamp — the moment the clock hits zero (when running)
  remaining_ms: number | null // frozen remaining time (when paused)
  duration_ms: number // last-used / default duration
}

export interface TimerView {
  status: TimerStatus
  ms: number
  h: number // total hours remaining (not capped at 24 — event clock is configurable)
  m: number
  s: number
}

/** Milliseconds remaining, computed purely from state + current time. */
export function computeRemaining(state: TimerState, now: number): number {
  switch (state.status) {
    case 'running':
      return state.ends_at ? Math.max(0, new Date(state.ends_at).getTime() - now) : 0
    case 'paused':
      return Math.max(0, state.remaining_ms ?? 0)
    case 'idle':
      return Math.max(0, state.duration_ms)
    case 'ended':
    default:
      return 0
  }
}

/** Display-ready view. A running clock that has hit zero is reported as 'ended'. */
export function toView(state: TimerState, now: number): TimerView {
  let ms = computeRemaining(state, now)
  let status: TimerStatus = state.status
  if (status === 'running' && ms <= 0) {
    status = 'ended'
    ms = 0
  }
  const totalSec = Math.floor(ms / 1000)
  return {
    status,
    ms,
    h: Math.floor(totalSec / 3600),
    m: Math.floor((totalSec % 3600) / 60),
    s: totalSec % 60,
  }
}

export function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** Map a raw Supabase row (bigint columns arrive as number|string) to TimerState. */
export function mapTimerRow(row: Record<string, unknown>): TimerState {
  return {
    status: (row.status as TimerStatus) ?? 'idle',
    ends_at: (row.ends_at as string | null) ?? null,
    remaining_ms: row.remaining_ms == null ? null : Number(row.remaining_ms),
    duration_ms: row.duration_ms == null ? 0 : Number(row.duration_ms),
  }
}
