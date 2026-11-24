export default function InputTape({ input, cursorIndex, accent = '#00d4ff' }) {
  if (!input) {
    return <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: 'var(--text-sm)' }}>empty input</div>
  }
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {[...input].map((ch, i) => {
        const consumed = i < cursorIndex
        const active = i === cursorIndex
        return (
          <span
            key={i}
            style={{
              minWidth: 26,
              textAlign: 'center',
              padding: '6px 4px',
              borderRadius: 4,
              fontFamily: 'var(--mono)',
              fontSize: 'var(--text-sm)',
              border: `1px solid ${active ? accent : 'var(--border)'}`,
              background: active ? accent + '22' : consumed ? 'var(--bg3)' : 'var(--bg2)',
              color: active ? accent : consumed ? 'var(--text-muted)' : 'var(--text)',
            }}
          >
            {ch === ' ' ? '␣' : ch}
          </span>
        )
      })}
    </div>
  )
}
