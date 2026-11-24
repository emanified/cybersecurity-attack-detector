const cell = {
  border: '1px solid var(--border)',
  padding: '6px 10px',
  fontFamily: 'var(--mono)',
  fontSize: 'var(--text-xs)',
  textAlign: 'center',
  whiteSpace: 'nowrap',
}

export default function TransitionTable({ automaton, currentState }) {
  const symbols = [...automaton.alphabet]
  const accept = new Set(automaton.accept)

  // δ lookup: table[state][symbol] = next state
  const delta = {}
  for (const t of automaton.transitions) {
    ;(delta[t.from] ||= {})[t.symbol] = t.to
  }

  // states in a stable order: start first, then the rest as listed
  const states = [automaton.start, ...automaton.states.filter((s) => s !== automaton.start)]

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ ...cell, color: 'var(--accent)' }}>State</th>
            {symbols.map((sym) => (
              <th key={sym} style={{ ...cell, color: 'var(--accent)' }}>{sym}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {states.map((st) => {
            const isCurrent = st === currentState
            return (
              <tr key={st} style={{ background: isCurrent ? 'var(--accent-dim)' : 'transparent' }}>
                <td style={{ ...cell, color: isCurrent ? 'var(--accent)' : 'var(--text)', fontWeight: isCurrent ? 700 : 500 }}>
                  {st === automaton.start ? '→ ' : ''}{st}{accept.has(st) ? ' ✓' : ''}
                </td>
                {symbols.map((sym) => (
                  <td key={sym} style={{ ...cell, color: 'var(--text-dim)' }}>
                    {delta[st]?.[sym] ?? '—'}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
