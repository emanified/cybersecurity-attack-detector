const cell = {
  border: '1px solid var(--border)',
  padding: '6px 10px',
  fontFamily: 'var(--mono)',
  fontSize: 'var(--text-xs)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
}

export default function SubsetTable({ table, alphabet }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ ...cell, color: 'var(--accent)' }}>DFA State</th>
            <th style={{ ...cell, color: 'var(--text-muted)' }}>NFA States</th>
            {alphabet.map((sym) => (
              <th key={sym} style={{ ...cell, color: 'var(--accent)' }}>{sym}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.map((row) => (
            <tr key={row.dfa_state} style={{ background: row.is_accept ? 'var(--success-dim)' : 'transparent' }}>
              <td style={{ ...cell, color: 'var(--text)' }}>
                {row.is_start ? '→ ' : ''}{row.dfa_state}{row.is_accept ? ' ✓' : ''}
              </td>
              <td style={{ ...cell, color: 'var(--text-muted)' }}>{row.nfa_states.join(', ')}</td>
              {alphabet.map((sym) => (
                <td key={sym} style={{ ...cell, color: 'var(--text-dim)' }}>{row.moves[sym]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
