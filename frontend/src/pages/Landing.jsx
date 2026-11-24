import { useState, useEffect } from 'react'
import ThemeToggle from '../components/ThemeToggle'

const ATTACK_TYPES = [
  { label: 'SQL Injection', color: '#ff3b5c', icon: '⬡' },
  { label: 'XSS', color: '#ffa520', icon: '⬡' },
  { label: 'Command Injection', color: '#c47bff', icon: '⬡' },
  { label: 'Path Traversal', color: '#00d4ff', icon: '⬡' },
  { label: 'Brute Force', color: '#00ffcc', icon: '⬡' },
  { label: 'Phishing URLs', color: '#ff6eb4', icon: '⬡' },
  { label: 'CSRF', color: '#aaff44', icon: '⬡' },
  { label: 'Buffer Overflow', color: '#ff7c38', icon: '⬡' },
  { label: 'DNS Spoofing', color: '#00d4ff', icon: '⬡' },
  { label: 'Session Hijacking', color: '#ffa520', icon: '⬡' },
]

const STATS = [
  { value: '20', label: 'Attack Types', suffix: '' },
  { value: '< 1ms', label: 'DFA Detection', suffix: '' },
  { value: '100', label: 'Accuracy', suffix: '%' },
]

function Counter({ target, duration = 1200 }) {
  const [count, setCount] = useState(0)
  const isNumeric = !isNaN(parseInt(target))
  const numVal = parseInt(target)

  useEffect(() => {
    if (!isNumeric) return
    let start = 0
    const step = numVal / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= numVal) { setCount(numVal); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [])

  return <span>{isNumeric ? count : target}</span>
}

export default function Landing({ onStart, onHowItWorks, theme, onToggleTheme }) {
  const [visible, setVisible] = useState(false)
  const [scanActive, setScanActive] = useState(false)
  const [activeAttack, setActiveAttack] = useState(0)
  const [hoverBtn, setHoverBtn] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAttack(i => (i + 1) % ATTACK_TYPES.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  const handleStart = () => {
    setScanActive(true)
    setTimeout(() => { setScanActive(false); onStart() }, 600)
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

      {/* Theme toggle — top right */}
      <div style={{ position: 'fixed', top: 20, right: 24, zIndex: 200 }}>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      {/* Scan line flash */}
      <div className={`scan-line ${scanActive ? 'active' : ''}`} />

      {/* Background decorative grid lines */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
        opacity: theme === 'light' ? 0.5 : 1,
      }} />

      {/* Ambient glows */}
      <div style={{
        position: 'fixed', top: '10%', left: '5%', width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', animation: 'heroGlow 4s ease-in-out infinite',
      }} />
      <div style={{
        position: 'fixed', bottom: '10%', right: '5%', width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,59,92,0.05) 0%, transparent 70%)',
        pointerEvents: 'none', animation: 'heroGlow 5s ease-in-out infinite reverse',
      }} />

      {/* Main content */}
      <div style={{
        position: 'relative', zIndex: 1, flex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '4rem 2rem',
        opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease',
      }}>

        {/* Tag line */}
        <div style={{
          fontSize: 'var(--text-sm)', letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--accent)', fontFamily: 'var(--mono)',
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.8rem',
          animation: 'slideUp 0.6s ease both',
        }}>
          <span style={{ width: 30, height: 1, background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} />
          DFA-Based Intrusion Detection System
          <span style={{ width: 30, height: 1, background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} />
        </div>

        {/* Hero title */}
        <h1 style={{
          fontFamily: 'var(--display)', fontWeight: 800,
          fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 1,
          textAlign: 'center', marginBottom: '0.5rem',
          animation: 'slideUp 0.65s 0.1s ease both',
          letterSpacing: '-0.03em',
        }}>
          Cyber
          <span style={{
            color: 'var(--accent)',
            textShadow: '0 0 60px var(--accent-glow)',
          }}>
            Guard
          </span>
        </h1>

        <div style={{
          fontFamily: 'var(--mono)', fontSize: 'clamp(0.875rem, 2vw, 1.05rem)',
          color: 'var(--text-dim)', letterSpacing: '0.14em',
          textTransform: 'uppercase', marginBottom: '1rem',
          animation: 'slideUp 0.65s 0.15s ease both',
        }}>
          Real-time payload analysis · v2.0
        </div>

        {/* Animated attack type cycling */}
        <div style={{
          height: 32, marginBottom: '2.5rem', display: 'flex', alignItems: 'center',
          gap: 10, fontFamily: 'var(--mono)', fontSize: 'var(--text-md)',
          animation: 'slideUp 0.65s 0.2s ease both',
        }}>
          <span style={{ color: 'var(--text-muted)' }}>Detecting:</span>
          <span style={{
            color: ATTACK_TYPES[activeAttack].color,
            textShadow: `0 0 20px ${ATTACK_TYPES[activeAttack].color}80`,
            fontWeight: 600, letterSpacing: '0.05em',
            transition: 'color 0.3s ease',
          }}>
            {ATTACK_TYPES[activeAttack].label}
          </span>
          <span style={{
            display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
            background: ATTACK_TYPES[activeAttack].color,
            boxShadow: `0 0 10px ${ATTACK_TYPES[activeAttack].color}`,
            animation: 'pulse-dot 1.2s ease-in-out infinite',
          }} />
        </div>

        {/* CTA buttons */}
        <div style={{
          display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center',
          marginBottom: '4rem',
          animation: 'slideUp 0.65s 0.25s ease both',
        }}>
          {/* Primary CTA */}
          <button
            onClick={handleStart}
            onMouseEnter={() => setHoverBtn(true)}
            onMouseLeave={() => setHoverBtn(false)}
            style={{
              background: hoverBtn ? 'var(--accent)' : 'transparent',
              border: '1px solid var(--accent)',
              borderRadius: 'var(--r-md)',
              color: hoverBtn ? '#000' : 'var(--accent)',
              fontFamily: 'var(--mono)', fontWeight: 700,
              fontSize: 'var(--text-sm)', letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '1rem 2.5rem',
              boxShadow: hoverBtn ? '0 0 40px var(--accent-glow), inset 0 0 20px rgba(0,212,255,0.05)' : '0 0 20px var(--accent-dim)',
              transform: hoverBtn ? 'translateY(-2px)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', gap: 10,
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 16 }}>⬡</span>
            Start Scanning
            <span style={{ fontSize: 14 }}>→</span>
          </button>

          {/* Secondary */}
          <button
            onClick={onHowItWorks}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-med)',
              borderRadius: 'var(--r-md)',
              color: 'var(--text-muted)',
              fontFamily: 'var(--mono)', fontWeight: 500,
              fontSize: 'var(--text-sm)', letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '1rem 2rem',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--border-bright)'
              e.currentTarget.style.color = 'var(--text)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-med)'
              e.currentTarget.style.color = 'var(--text-muted)'
            }}
          >
            How It Works
          </button>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center',
          marginBottom: '4rem',
          animation: 'slideUp 0.65s 0.35s ease both',
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                fontWeight: 800, color: 'var(--accent)',
                textShadow: '0 0 30px var(--accent-glow)',
                lineHeight: 1,
              }}>
                <Counter target={s.value} />{s.suffix}
              </div>
              <div style={{
                fontSize: 'var(--text-sm)', letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--text-muted)', fontFamily: 'var(--mono)', marginTop: 8,
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Attack vectors grid */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center',
          maxWidth: 680,
          animation: 'slideUp 0.65s 0.45s ease both',
        }}>
          {ATTACK_TYPES.map((a, i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface)',
                border: `1px solid ${i === activeAttack ? a.color + '50' : 'var(--border)'}`,
                borderRadius: 'var(--r-sm)',
                padding: '7px 14px',
                fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase',
                color: i === activeAttack ? a.color : 'var(--text-muted)',
                fontFamily: 'var(--mono)',
                transition: 'all 0.3s ease',
                boxShadow: i === activeAttack ? `0 0 12px ${a.color}30` : 'none',
              }}
            >
              {a.label}
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '3rem', textAlign: 'center',
          fontSize: 'var(--text-sm)', color: 'var(--text-muted)', letterSpacing: '0.06em',
          fontFamily: 'var(--mono)', lineHeight: 2,
          animation: 'slideUp 0.65s 0.55s ease both',
        }}>
          <div style={{ color: 'var(--text-dim)', fontWeight: 500 }}>CyberGuard · DFA Intrusion Detection</div>
          <div>Eman · Hamna · Mahnoor · Tooba</div>
        </div>

      </div>
    </div>
  )
}