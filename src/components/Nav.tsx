import { useState } from 'react'

const LINKS = [
  { href: '#rules', label: 'Rules' },
  { href: '#register', label: 'Register' },
  { href: '#rounds', label: 'Rounds' },
  { href: '#submit', label: 'Submit' },
  { href: '#prizes', label: 'Prizes' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site">
      <nav className="nav">
        <a href="#top" className="brand" onClick={() => setOpen(false)}>
          <span className="block-icon" aria-hidden="true" />
          VIBECRAFT
        </a>
        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="navLinks"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
        <div className={`nav-links${open ? ' open' : ''}`} id="navLinks">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#register" className="btn torch nav-cta" onClick={() => setOpen(false)}>
            Register Now
          </a>
        </div>
      </nav>
    </header>
  )
}
