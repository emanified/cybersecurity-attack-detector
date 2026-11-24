const btn = (enabled) => ({
  padding: '8px 14px',
  borderRadius: 6,
  border: '1px solid var(--border)',
  background: 'var(--bg3)',
  color: enabled ? 'var(--text)' : 'var(--text-faint)',
  fontFamily: 'var(--mono)',
  fontSize: 'var(--text-sm)',
  cursor: enabled ? 'pointer' : 'not-allowed',
  opacity: enabled ? 1 : 0.5,
})

export default function SimulatorControls({ sim, accent = '#00d4ff' }) {
  const { prev, next, togglePlay, reset, playing, atStart, atEnd, current } = sim

  let verdict = null
  if (current && atEnd) {
    if (current.dead || !current.accepted) verdict = { text: 'REJECT', color: 'var(--danger)' }
    else verdict = { text: 'ACCEPT', color: 'var(--success)' }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <button style={btn(!atStart)} disabled={atStart} onClick={prev}>◀ Prev</button>
      <button style={{ ...btn(!atEnd), borderColor: accent, color: accent }} disabled={atEnd} onClick={togglePlay}>
        {playing ? '❚❚ Pause' : '▶ Play'}
      </button>
      <button style={btn(!atEnd)} disabled={atEnd} onClick={next}>Next ▶</button>
      <button style={btn(true)} onClick={reset}>⟲ Reset</button>
      {verdict && (
        <span style={{ marginLeft: 8, fontFamily: 'var(--mono)', fontWeight: 700, letterSpacing: '0.08em', color: verdict.color }}>
          {verdict.text}
        </span>
      )}
    </div>
  )
}
