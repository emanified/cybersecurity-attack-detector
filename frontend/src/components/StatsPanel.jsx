import { useEffect, useRef, useState } from 'react'

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(typeof value === 'number' ? 0 : value)
  const prev = useRef(0)

  useEffect(() => {
    if (typeof value !== 'number') { setDisplay(value); return }
    const start = prev.current
    const end = value
    if (start === end) return
    const dur = 500
    const startTime = performance.now()
    const frame = (t) => {
      const elapsed = t - startTime
      const progress = Math.min(elapsed / dur, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(start + (end - start) * ease))
      if (progress < 1) requestAnimationFrame(frame)
      else prev.current = end
    }
    requestAnimationFrame(frame)
  }, [value])

  return <span>{display}</span>
}

export default function StatsPanel({ history = [] }) {
  // Compute stats from history array
  const total  = history.length
  const safe   = history.filter(e => e.attack_type === 'SAFE').length
  const threat = history.filter(e => e.attack_type !== 'SAFE' && e.attack_type !== 'ERROR').length
  const threatRate = total > 0 ? Math.round(threat / total * 100) : 0
  const threatRateDisplay = total > 0 ? threatRate + '%' : '—'

  const cards = [
    {
      val: total,
      lbl: 'Total Scans',
      sublbl: 'inputs processed',
      color: 'var(--accent)',
      bg: 'var(--accent-dim)',
      icon: '⬡',
      numeric: true,
    },
    {
      val: safe,
      lbl: 'Clean',
      sublbl: 'no threats found',
      color: 'var(--success)',
      bg: 'var(--success-dim)',
      icon: '✓',
      numeric: true,
    },
    {
      val: threat,
      lbl: 'Threats',
      sublbl: 'attacks detected',
      color: 'var(--danger)',
      bg: 'var(--danger-dim)',
      icon: '⚠',
      numeric: true,
    },
    {
      val: threatRateDisplay,
      lbl: 'Threat Rate',
      sublbl: total > 0
        ? `${threatRate >= 50 ? 'high' : threatRate >= 20 ? 'medium' : 'low'} risk`
        : 'awaiting data',
      color: threatRate >= 50 ? 'var(--danger)' : threatRate >= 20 ? 'var(--warn)' : 'var(--success)',
      bg:    threatRate >= 50 ? 'var(--danger-dim)' : 'var(--success-dim)',
      icon: '◈',
      numeric: false,
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
      {cards.map((c, i) => (
        <div
          key={c.lbl}
          className="panel"
          style={{
            padding: '1.35rem 1.4rem',
            display: 'flex', flexDirection: 'column', gap: '0.35rem',
            position: 'relative', overflow: 'hidden',
            transition: 'border-color 0.25s, transform 0.2s',
            animation: `fadeIn 0.4s ease ${i * 0.08}s both`,
            cursor: 'default',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--border-med)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.transform = 'none'
          }}
        >
          {/* Tinted bg fill */}
          <div style={{
            position: 'absolute', inset: 0,
            background: c.bg, borderRadius: 'inherit',
            opacity: 0.7, pointerEvents: 'none',
          }} />

          {/* Label row */}
          <div style={{
            position: 'relative', zIndex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{
              fontSize: 'var(--text-sm)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              fontFamily: 'var(--mono)',
              fontWeight: 600,
            }}>
              {c.lbl}
            </span>
            <span style={{ color: c.color, fontSize: 14, opacity: 0.7 }}>{c.icon}</span>
          </div>

          {/* Big number */}
          <div style={{
            position: 'relative', zIndex: 1,
            fontFamily: 'var(--display)',
            fontSize: '2.2rem',
            fontWeight: 800,
            lineHeight: 1,
            color: c.color,
            letterSpacing: '-0.03em',
          }}>
            {c.numeric ? <AnimatedNumber value={c.val} /> : c.val}
          </div>

          {/* Sub-label */}
          <div style={{
            position: 'relative', zIndex: 1,
              fontSize: 'var(--text-sm)',
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
            fontFamily: 'var(--mono)',
          }}>
            {c.sublbl}
          </div>

          {/* Progress bar for threat rate */}
          {c.lbl === 'Threat Rate' && total > 0 && (
            <div style={{ position: 'relative', zIndex: 1, marginTop: 4 }}>
              <div style={{ height: 3, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${threatRate}%`,
                  background: c.color,
                  borderRadius: 3,
                  transition: 'width 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  boxShadow: `0 0 8px ${c.color}80`,
                }} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}