import ThemeToggle from './ThemeToggle'

export default function Header({ currentPage, onNavigate, theme, onToggleTheme }) {
  const tabs = [
    { id: 'home', label: '⬡ Scanner' },
    { id: 'simulator', label: '⬡ Simulator' },
    { id: 'converter', label: '⬡ NFA → DFA' },
    { id: 'about', label: '⬡ How It Works' },
  ]

  return (
    <header style={{
      position: 'relative', padding: '2.5rem 0 0',
      borderBottom: '1px solid var(--border)',
      maxWidth: 1280, margin: '0 auto',
      paddingLeft: '1.5rem', paddingRight: '1.5rem',
    }}>
      {/* Ambient blobs */}
      <div style={{ position: 'fixed', top: -120, right: -80, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: 0, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,59,92,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Left: Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <div style={{ fontSize: 'var(--text-sm)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--mono)' }}>
            <span style={{ display: 'inline-block', width: 20, height: 1, background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)' }} />
            DFA-Based Intrusion Detection System
          </div>

          <h1
            onClick={() => onNavigate('landing')}
            style={{
              fontFamily: 'var(--display)', fontSize: 'clamp(1.8rem,4.5vw,3rem)',
              fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.05,
              cursor: 'pointer',
            }}
          >
            Cyber<span style={{ color: 'var(--accent)', textShadow: '0 0 40px var(--accent-glow)', position: 'relative' }}>Guard</span>
            <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.55em', letterSpacing: '0.1em', marginLeft: '0.4em', fontFamily: 'var(--mono)' }}>v2.0</span>
          </h1>

          <div style={{ fontSize: 'var(--text-base)', color: 'var(--text-dim)', letterSpacing: '0.06em', fontWeight: 400, fontFamily: 'var(--sans)' }}>
            10 Attack Vectors · 10 SQL Injection Variants · Deterministic Finite Automata
          </div>
        </div>

        {/* Right: Theme toggle + Status + Team */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
          {/* Theme toggle */}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--success-dim)', border: '1px solid rgba(0,229,153,0.18)', borderRadius: 8, padding: '9px 16px', fontSize: 'var(--text-sm)', color: 'var(--success)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--mono)', fontWeight: 600 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success-glow)', animation: 'pulse-dot 2s ease-in-out infinite', display: 'inline-block' }} />
            DFA Engine Online
          </div>

          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', letterSpacing: '0.04em', textAlign: 'right', fontFamily: 'var(--mono)', lineHeight: 1.8 }}>
            <div style={{ color: 'var(--text-dim)', fontWeight: 500, marginBottom: 2 }}>Security Research Team</div>
            <div>Eman · Hamna · Mahnoor · Tooba</div>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <nav style={{ display: 'flex', gap: 0, marginTop: '1.75rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            style={{
              background: 'none', border: 'none',
              borderBottom: currentPage === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
              color: currentPage === tab.id ? 'var(--accent)' : 'var(--text-muted)',
              fontSize: 'var(--text-sm)', letterSpacing: '0.1em',
              padding: '1rem 1.5rem', transition: 'all 0.25s var(--ease-out)',
              whiteSpace: 'nowrap', marginBottom: -1,
              textTransform: 'uppercase', fontFamily: 'var(--mono)',
              position: 'relative', cursor: 'pointer',
            }}
          >
            {tab.label}
            {currentPage === tab.id && (
              <span style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, background: 'var(--accent)', borderRadius: '50%', boxShadow: '0 0 6px var(--accent)' }} />
            )}
          </button>
        ))}
      </nav>
    </header>
  )
}
