import { useEffect, useRef, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const LS_KEY = 'vibecraft_r2_code'

interface PS {
  title: string
  body: string
}

type Status = 'locked' | 'checking' | 'unlocked' | 'error'

export default function Round2Gate() {
  const [status, setStatus] = useState<Status>('locked')
  const [ps, setPs] = useState<PS | null>(null)
  const [msg, setMsg] = useState('')
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Re-verify a remembered code on mount (the PS itself is never persisted locally).
  useEffect(() => {
    let stored: string | null = null
    try {
      stored = localStorage.getItem(LS_KEY)
    } catch {
      /* ignore */
    }
    if (stored && isSupabaseConfigured) void verify(stored, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function verify(code: string, silent = false) {
    const clean = code.trim()
    if (!clean) return

    if (!isSupabaseConfigured || !supabase) {
      setStatus('error')
      setMsg('Round 2 access opens on event day. Check back once Round 1 results are out.')
      return
    }

    setStatus('checking')
    setMsg(silent ? '' : 'Checking…')
    const { data, error } = await supabase.rpc('verify_round2', { code: clean })

    if (error) {
      setStatus('error')
      setMsg('Something went wrong verifying that code. Try again.')
      return
    }
    const rows = (data as PS[]) ?? []
    if (rows.length > 0) {
      setPs(rows[0])
      setStatus('unlocked')
      setMsg('')
      try {
        localStorage.setItem(LS_KEY, clean)
      } catch {
        /* ignore */
      }
    } else {
      setStatus('error')
      setMsg('Wrong code. Clear Round 1 first.')
      setShake(true)
      setTimeout(() => setShake(false), 400)
      try {
        localStorage.removeItem(LS_KEY)
      } catch {
        /* ignore */
      }
      if (inputRef.current) {
        inputRef.current.value = ''
        inputRef.current.focus()
      }
    }
  }

  if (status === 'unlocked' && ps) {
    return (
      <div>
        <h3>{ps.title}</h3>
        <p style={{ whiteSpace: 'pre-wrap' }}>{ps.body}</p>
        <div className="round3-block">
          <h3>Round 3 — The Finale</h3>
          <p>
            Submit your final working prototype and present it. Like the reality shows, strong
            performance in earlier rounds earns you an edge here too. This is where VibeCraft Season 1
            crowns its winner.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3>Only Round 1 survivors get this far</h3>
      <p>If you've cleared Round 1, you've already got the code. Enter it below.</p>
      <div className={`gate${shake ? ' shake' : ''}`}>
        <label htmlFor="gateInput">Access code</label>
        <input
          ref={inputRef}
          type="text"
          id="gateInput"
          autoComplete="off"
          placeholder="Enter your code"
          aria-describedby="gateMsg"
          onKeyDown={(e) => {
            if (e.key === 'Enter') void verify((e.target as HTMLInputElement).value)
          }}
        />
        <button
          className="btn torch"
          disabled={status === 'checking'}
          onClick={() => void verify(inputRef.current?.value ?? '')}
        >
          {status === 'checking' ? 'Checking…' : 'Unlock'}
        </button>
      </div>
      <p
        className={`gate-msg${status === 'error' ? ' err' : ''}`}
        id="gateMsg"
        aria-live="polite"
      >
        {msg}
      </p>
    </div>
  )
}
