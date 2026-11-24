import { useState } from 'react'

export default function ThemeToggle({ theme, onToggle }) {
  const [spinning, setSpinning] = useState(false)
  const isDark = theme === 'dark'

  const handleClick = () => {
    setSpinning(true)
    onToggle()
    setTimeout(() => setSpinning(false), 500)
  }

  return (
    <button
      onClick={handleClick}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-med)',
        borderRadius: 'var(--r-md)',
        padding: '8px 14px',
        display: 'flex', alignItems: 'center', gap: 8,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--accent)'
        e.currentTarget.style.boxShadow = '0 0 16px var(--accent-dim)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-med)'
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
      }}
    >
      {/* Track */}
      <div style={{
        width: 36, height: 20, borderRadius: 10,
        background: isDark ? 'var(--accent-dim)' : 'rgba(255,190,0,0.15)',
        border: `1px solid ${isDark ? 'var(--accent)' : 'rgba(255,190,0,0.4)'}`,
        position: 'relative', transition: 'all 0.3s ease',
        flexShrink: 0,
      }}>
        {/* Thumb */}
        <div style={{
          position: 'absolute', top: 2,
          left: isDark ? 2 : 16,
          width: 14, height: 14, borderRadius: '50%',
          background: isDark ? 'var(--accent)' : '#fbbf24',
          boxShadow: isDark ? '0 0 8px var(--accent)' : '0 0 8px rgba(251,191,36,0.6)',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 8,
        }}>
          {isDark ? '' : ''}
        </div>
      </div>

      {/* Icon + Label */}
      <span style={{
        fontSize: 14,
        display: 'inline-block',
        transform: spinning ? 'rotate(360deg)' : 'rotate(0deg)',
        transition: spinning ? 'transform 0.4s ease' : 'none',
      }}>
        {isDark ? '☀️' : '🌙'}
      </span>

      <span style={{
        fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--text-muted)', fontFamily: 'var(--mono)',
        display: 'none',
      }}>
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  )
}
