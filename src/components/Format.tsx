const TILES = [
  { glyph: '🏫', text: 'Fully offline. All rounds run in person on the 4th floor.' },
  { glyph: '🤖', text: "AI tools are fair game — it's a vibe-coding event. Use what makes you faster." },
  { glyph: '🤝', text: 'Play fair and follow event-day instructions so rounds run on schedule.' },
  { glyph: '⏱️', text: "Submit within the window you're given. Late work risks elimination." },
]

export default function Format() {
  return (
    <section>
      <div className="wrap">
        <div className="section-head">
          <h2>Format &amp; Ground Rules</h2>
        </div>
        <div className="rules-grid">
          {TILES.map((t, i) => (
            <div className="pixel-panel rule-tile" key={i}>
              <div className="glyph">{t.glyph}</div>
              <p>{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
