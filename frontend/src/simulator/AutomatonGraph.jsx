import { layeredLayout } from './layout.js'

const R = 26

function edgePath(e) {
  const a = e.fromPos
  const b = e.toPos
  if (e.kind === 'self') {
    return `M ${a.x - 10} ${a.y - R} C ${a.x - 40} ${a.y - R - 60}, ${a.x + 40} ${a.y - R - 60}, ${a.x + 10} ${a.y - R}`
  }
  if (e.kind === 'back') {
    const midX = (a.x + b.x) / 2
    const midY = Math.max(a.y, b.y) + 70
    return `M ${a.x} ${a.y + R} Q ${midX} ${midY}, ${b.x} ${b.y + R}`
  }
  return `M ${a.x + R} ${a.y} L ${b.x - R} ${b.y}`
}

function labelPos(e) {
  const a = e.fromPos
  const b = e.toPos
  if (e.kind === 'self') return { x: a.x, y: a.y - R - 62 }
  if (e.kind === 'back') return { x: (a.x + b.x) / 2, y: Math.max(a.y, b.y) + 64 }
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - 8 }
}

export default function AutomatonGraph({ automaton, currentState, accent = '#00d4ff' }) {
  const { nodes, edges, width, height } = layeredLayout(automaton)

  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', background: 'var(--bg2)' }}>
      <svg width={width} height={height} style={{ display: 'block', minWidth: '100%', fontFamily: 'var(--mono, monospace)' }}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(140,190,230,0.7)" />
          </marker>
        </defs>

        {edges.map((e, i) => {
          const lp = labelPos(e)
          return (
            <g key={i}>
              <path d={edgePath(e)} fill="none" stroke="rgba(140,190,230,0.45)" strokeWidth="1.6" markerEnd="url(#arrow)" />
              <text x={lp.x} y={lp.y} textAnchor="middle" fontSize="12" fill="rgba(180,210,230,0.85)">{e.label}</text>
            </g>
          )
        })}

        {nodes.map((n) => {
          const active = n.id === currentState
          const stroke = active ? accent : n.isStart ? '#00d4ff' : 'rgba(140,190,230,0.5)'
          return (
            <g key={n.id}>
              {n.isStart && (
                <line x1={n.x - R - 26} y1={n.y} x2={n.x - R} y2={n.y} stroke="#00d4ff" strokeWidth="1.6" markerEnd="url(#arrow)" />
              )}
              {n.isAccept && <circle cx={n.x} cy={n.y} r={R + 5} fill="none" stroke={stroke} strokeWidth="1.4" />}
              <circle cx={n.x} cy={n.y} r={R} fill={active ? accent + '22' : 'rgba(100,180,255,0.06)'} stroke={stroke} strokeWidth={active ? 3 : 1.6} />
              <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="13" fontWeight={active ? 700 : 500} fill={active ? accent : 'var(--text)'}>{n.id}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
