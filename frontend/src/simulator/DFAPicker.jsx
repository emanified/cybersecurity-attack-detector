export default function DFAPicker({ list, selectedId, onSelect, variant, onVariant }) {
  const general = list.filter((d) => d.group === 'general')
  const sql = list.filter((d) => d.group === 'sql')
  const selected = list.find((d) => d.id === selectedId)

  const group = (title, items) => (
    <div style={{ marginBottom: 14 }}>
      <div className="section-label" style={{ marginBottom: 8 }}>{title}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {items.map((d) => {
          const active = d.id === selectedId
          return (
            <button
              key={d.id}
              onClick={() => onSelect(d)}
              style={{
                padding: '6px 12px',
                borderRadius: 5,
                fontFamily: 'var(--mono)',
                fontSize: 'var(--text-xs)',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                background: active ? 'var(--accent-dim)' : 'var(--bg3)',
                color: active ? 'var(--accent)' : 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              {d.label}
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div>
      {group('General Attacks', general)}
      {group('SQL Injection Variants', sql)}
      {selected?.variants?.length > 0 && (
        <div style={{ marginTop: 4 }}>
          <div className="section-label" style={{ marginBottom: 8 }}>Variant</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {selected.variants.map((v) => (
              <button
                key={v}
                onClick={() => onVariant(v)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 5,
                  fontFamily: 'var(--mono)',
                  fontSize: 'var(--text-xs)',
                  border: `1px solid ${variant === v ? 'var(--accent)' : 'var(--border)'}`,
                  background: variant === v ? 'var(--accent-dim)' : 'var(--bg3)',
                  color: variant === v ? 'var(--accent)' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
