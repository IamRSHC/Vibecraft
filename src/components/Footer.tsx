export default function Footer() {
  return (
    <footer className="site">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">VIBECRAFT</div>
          <div className="foot-links">
            <a href="#rules">Rules</a>
            <a href="#rules">Register</a>
            <a href="#rounds">Rounds</a>
            {/* TODO: swap in a real support email/link, e.g. mailto:ntt@yourdomain */}
            <a href="#rules">Need help?</a>
          </div>
        </div>
        <p className="fine-print">
          Organized by Neuro Tech Titans (NTT) · VibeCraft Season 1 · SRMIST Tiruchirappalli · 2026
        </p>
      </div>
    </footer>
  )
}
