import { REGISTER_URL } from '../config'

export default function Rules() {
  return (
    <section id="rules">
      <div className="wrap">
        <div className="section-head">
          <h2>Team &amp; Registration</h2>
          <p>What you need to know before you sign up.</p>
        </div>
        <div className="card-row">
          <div className="pixel-panel card">
            <h3>
              <span className="dot" aria-hidden="true" />
              Team Rules
            </h3>
            <p style={{ margin: '0 0 18px', fontSize: 15, color: '#3d3524' }}>
              Whoever you bring, bring them ready to build — how your team handles the pressure
              matters as much as what you ship.
            </p>
            <ul>
              <li>2–4 members per team — no solo runs, no teams of 5+.</li>
              <li>
                Bring your own device. Laptop, tablet, whatever you build on — the venue doesn't
                supply hardware. Get it charged and your tools installed before Round 1 starts.
              </li>
              <li>
                Technical <em>and</em> non-technical tasks both count toward evaluation. Show up and
                participate in both — sitting one out costs you.
              </li>
            </ul>
            <p className="bonus-note" style={{ marginTop: 18 }}>
              Tip: sort out who's doing what before the clock starts. There's no pause button for
              team huddles once Round 1 begins.
            </p>
          </div>

          <div className="pixel-panel card" id="register">
            <h3>
              <span className="dot" aria-hidden="true" />
              How to Register
            </h3>
            <ul>
              <li>₹500 per team, one payment covers the whole squad.</li>
              <li>
                Registration happens through CampusQuest only. If you expressed interest via Unstop,
                check your email for the CampusQuest link — Unstop is for event info, not
                registration.
              </li>
              <li>
                Double-check your name, department, and university before you submit. Certificates
                are printed from this data, and changes after registration aren't accepted.
              </li>
              <li>
                After payment, watch your inbox — a confirmation mail with further details follows
                from the official NTT team.
              </li>
            </ul>
            <a href={REGISTER_URL} className="btn block" target="_blank" rel="noopener noreferrer">
              Register on CampusQuest
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
