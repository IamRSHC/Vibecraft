import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { mapTimerRow, toView, type TimerState, type TimerView } from '../lib/timer'
import { EVENT_END, DEFAULT_DURATION_MS } from '../config'

const TIMER_ID = 1

/**
 * Preview shown when Supabase isn't configured. We deliberately DON'T count down the
 * ~days to the event (that showed huge hour values). Instead we show the configured event
 * duration as an idle clock, so it always reads as a clean sub-day HRS:MIN:SEC.
 */
function fallbackState(now: number): { state: TimerState; label: string } {
  const end = new Date(EVENT_END).getTime()
  if (now >= end) {
    return {
      state: { status: 'ended', ends_at: null, remaining_ms: null, duration_ms: DEFAULT_DURATION_MS },
      label: 'VibeCraft has wrapped',
    }
  }
  return {
    state: { status: 'idle', ends_at: null, remaining_ms: null, duration_ms: DEFAULT_DURATION_MS },
    label: 'Event timer',
  }
}

function liveLabel(state: TimerState): string {
  switch (state.status) {
    case 'running':
      return 'Time remaining'
    case 'paused':
      return 'Paused by the organisers'
    case 'ended':
      return "Time's up"
    case 'idle':
    default:
      return 'Waiting to begin'
  }
}

export interface UseTimerResult {
  view: TimerView
  label: string
  source: 'live' | 'fallback'
  ready: boolean
}

export function useTimer(): UseTimerResult {
  const [dbState, setDbState] = useState<TimerState | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const source: 'live' | 'fallback' = isSupabaseConfigured ? 'live' : 'fallback'

  // tick
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [])

  // load + realtime subscribe
  useEffect(() => {
    if (!supabase) return
    let active = true

    supabase
      .from('timer_state')
      .select('*')
      .eq('id', TIMER_ID)
      .single()
      .then(({ data }) => {
        if (active && data) setDbState(mapTimerRow(data))
      })

    const channel = supabase
      .channel('timer_state_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'timer_state', filter: `id=eq.${TIMER_ID}` },
        (payload) => {
          if (payload.new) setDbState(mapTimerRow(payload.new as Record<string, unknown>))
        },
      )
      .subscribe()

    return () => {
      active = false
      supabase?.removeChannel(channel)
    }
  }, [])

  if (source === 'live' && dbState) {
    return { view: toView(dbState, now), label: liveLabel(dbState), source, ready: true }
  }
  if (source === 'live' && !dbState) {
    // configured but row not loaded yet
    const fb = fallbackState(now)
    return { view: toView(fb.state, now), label: fb.label, source, ready: false }
  }
  const fb = fallbackState(now)
  return { view: toView(fb.state, now), label: fb.label, source, ready: true }
}
