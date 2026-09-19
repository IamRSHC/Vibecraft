const CRITERIA = [
  'Relevance of your solution to the problem statement',
  "Feasibility of what you've built",
  'How well you actually used the given dataset',
  'Overall user experience and solution design',
  'Performance during the Technical Tasks round',
]

export default function Prizes() {
  return (
    <section id="prizes">
      <div className="wrap split">
        <div>
          <div className="section-head">
            <h2>How We Judge</h2>
          </div>
          <ol className="num-list">
            {CRITERIA.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ol>
          <p className="bonus-note">
            Bonus: strong performance in the Non-Technical Tasks gives your team an added edge in the
            next round.
          </p>
        </div>

        <div>
          <div className="section-head">
            <h2>Prizes &amp; Certification</h2>
          </div>
          <div className="pixel-panel prize-block">
            <p className="prize-pool">₹10,000</p>
            <p className="sub">total prize pool</p>
            <ul className="prize-list">
              <li>Credits and surprise goodies for the winning team</li>
              <li>
                Certificates carrying the backing of partner tech companies and startups — something
                that actually holds weight
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
