import { useEffect, useState } from 'react'
import { fetchNFAList, fetchConversion } from '../nfa/api.js'
import AutomatonGraph from '../simulator/AutomatonGraph.jsx'
import SubsetTable from '../nfa/SubsetTable.jsx'

function Picker({ list, selectedId, onSelect }) {
  const group = (title, items) => (
    <div style={{ marginBottom: 14 }}>
      <div className="section-label" style={{ marginBottom: 8 }}>{title}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {items.map((d) => {
          const active = d.id === selectedId
          return (
            <button
              key={d.id}
              onClick={() => onSelect(d.id)}
              style={{
                padding: '6px 12px', borderRadius: 5, fontFamily: 'var(--mono)',
                fontSize: 'var(--text-xs)',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                background: active ? 'var(--accent-dim)' : 'var(--bg3)',
                color: active ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer',
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
      {group('General Attack NFAs', list.filter((d) => d.group === 'attack'))}
      {group('SQL Injection NFAs', list.filter((d) => d.group === 'sql'))}
      {group('Classic NFAs', list.filter((d) => d.group === 'classic'))}
    </div>
  )
}

export default function Converter() {
  const [list, setList] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchNFAList()
      .then((items) => {
        setList(items)
        if (items.length) setSelectedId(items[0].id)
      })
      .catch((e) => setError(e.message))
  }, [])

  useEffect(() => {
    if (!selectedId) return
    fetchConversion(selectedId)
      .then((d) => {
        setData(d)
        setError(null)
      })
      .catch((e) => setError(e.message))
  }, [selectedId])

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--mono)', letterSpacing: '0.04em' }}>NFA → DFA Converter</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          Pick an NFA. The subset construction (ε-closure + move) produces an equivalent DFA. Each DFA state is a set of NFA states.
        </p>
      </div>

      {error && <div style={{ color: 'var(--danger)', fontFamily: 'var(--mono)' }}>Error: {error}</div>}

      <div className="panel" style={{ padding: '1.25rem' }}>
        <Picker list={list} selectedId={selectedId} onSelect={setSelectedId} />
      </div>

      {data && (
        <>
          <div className="panel" style={{ padding: '1.25rem' }}>
            <div className="section-label" style={{ marginBottom: 10 }}>NFA{data.nfa.epsilon ? ' (has ε)' : ''}</div>
            <AutomatonGraph automaton={data.nfa} />
          </div>
          <div className="panel" style={{ padding: '1.25rem' }}>
            <div className="section-label" style={{ marginBottom: 10 }}>DFA (subset construction)</div>
            <AutomatonGraph automaton={data.dfa} />
          </div>

          <div className="panel" style={{ padding: '1.25rem' }}>
            <div className="section-label" style={{ marginBottom: 10 }}>Subset Construction Table</div>
            <SubsetTable table={data.table} alphabet={data.dfa.alphabet} />
          </div>
        </>
      )}
    </div>
  )
}
