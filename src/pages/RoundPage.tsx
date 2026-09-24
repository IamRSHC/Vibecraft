import { Link, useParams } from 'react-router-dom'
import WorldBackground, { type World } from '../components/WorldBackground'
import { REGISTER_FORM_URL, ROUND1_SUBMIT_URL, ROUND3_PPT_URL } from '../config'

function FormCta({ url, label }: { url: string; label: string }) {
  if (!url || url === 'REPLACE_ME') {
    return (
      <button className="btn torch round-cta" disabled>
        {label} — coming soon
      </button>
    )
  }
  return (
    <a className="btn torch round-cta" href={url} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  )
}

export default function RoundPage() {
  const { id } = useParams()
  const round = id === '2' ? 2 : id === '3' ? 3 : 1
  const world: World = round === 1 ? 'overworld' : round === 2 ? 'nether' : 'end'
  const eyebrowColor =
    round === 1 ? 'var(--grass-light)' : round === 2 ? 'var(--torch-light)' : 'var(--ender-light)'
  const eyebrow = round === 1 ? 'OVERWORLD · ROUND 1' : round === 2 ? 'NETHER · ROUND 2' : 'THE END · ROUND 3'

  return (
    <div className="round-page">
      <WorldBackground world={world} />

      <header className="site">
        <nav className="nav">
          <Link to="/" className="brand">
            <span className="block-icon" aria-hidden="true" />
            VIBECRAFT
          </Link>
          <a
            href={REGISTER_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn torch nav-cta"
          >
            Register Now
          </a>
        </nav>
      </header>

      <main className="round-main">
        <div className="round-card">
          <p className="round-eyebrow" style={{ color: eyebrowColor }}>
            {eyebrow}
          </p>

          {round === 1 && (
            <>
              <h1>Round 1 — The Elimination</h1>
              <p>
                You'll get a problem statement and a fixed window to submit a working technical
                solution. This round tests raw problem-solving — how fast and how well you can build
                under pressure.
              </p>
              <p>
                Non-technical tasks are optional here, but finishing them banks you bonus points that
                carry into Round 2.
              </p>
              <p className="hint">
                The exact problem statement drops on the morning of the event — this page covers the
                rules, not the puzzle.
              </p>
              <FormCta url={ROUND1_SUBMIT_URL} label="Submit Round 1" />
            </>
          )}

          {round === 2 && (
            <>
              <h1>Round 2 — Level Up</h1>
              <p>
                Shortlisted teams get an advanced problem statement and move through multiple build
                stages, with extra points on the Technical Tasks — and a few surprises built in.
              </p>
              <div className="round-locked">
                🔒 This round unlocks after Round 1 results — you'll need the access code given to
                qualified teams.
              </div>
              <p className="hint" style={{ marginTop: 16 }}>
                The secure access gate and submission open in a later build step.
              </p>
            </>
          )}

          {round === 3 && (
            <>
              <h1>Round 3 — The Finale</h1>
              <p>
                Submit your final working prototype as a presentation and present it live. Like the
                reality shows, strong performance in earlier rounds earns you an edge here too — this
                is where VibeCraft Season 1 crowns its winner.
              </p>
              <FormCta url={ROUND3_PPT_URL} label="Submit your PPT" />
            </>
          )}

          <div>
            <Link to="/" className="round-back">
              ← Back to VibeCraft
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
