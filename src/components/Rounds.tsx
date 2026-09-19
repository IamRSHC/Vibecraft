import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Round2Gate from './Round2Gate'

export default function Rounds() {
  const [which, setWhich] = useState<1 | 2 | null>(null)

  return (
    <section className="rounds-zone" id="rounds">
      <div className="wrap">
        <div className="section-head">
          <h2>The Rounds</h2>
          <p>
            Three rounds. Round 1 is open to everyone. What's past it only unlocks once you've cleared
            it.
          </p>
        </div>

        <div className="pill-row">
          <button
            className="pill-btn blue"
            id="pillBlue"
            aria-expanded={which === 1}
            aria-controls="panelRound1"
            onClick={() => setWhich(1)}
          >
            <span className="p-icon" aria-hidden="true" />
            <span className="p-label">ROUND 1</span>
            <span className="p-sub">Open to every registered team</span>
          </button>
          <button
            className="pill-btn red"
            id="pillRed"
            aria-expanded={which === 2}
            aria-controls="panelRound2"
            onClick={() => setWhich(2)}
          >
            <span className="p-icon" aria-hidden="true" />
            <span className="p-label">ROUND 2 + FINALE</span>
            <span className="p-sub">Unlocks after Round 1 results</span>
          </button>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {which === null && (
            <motion.p
              key="prompt"
              className="prompt-state"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              Pick a pill to see what's inside.
            </motion.p>
          )}

          {which === 1 && (
            <motion.div
              key="r1"
              className="pixel-panel round-panel"
              id="panelRound1"
              role="region"
              aria-label="Round 1 details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
            >
              <h3>Round 1 — The Elimination</h3>
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
            </motion.div>
          )}

          {which === 2 && (
            <motion.div
              key="r2"
              className="pixel-panel round-panel"
              id="panelRound2"
              role="region"
              aria-label="Round 2 and Finale details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
            >
              <Round2Gate />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
