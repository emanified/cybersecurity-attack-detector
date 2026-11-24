const COL = 150
const ROW = 110
const MARGIN = 70

function computeDepths(automaton) {
  const adj = {}
  for (const t of automaton.transitions) (adj[t.from] ||= []).push(t.to)

  const depth = { [automaton.start]: 0 }
  const queue = [automaton.start]
  while (queue.length) {
    const s = queue.shift()
    for (const next of adj[s] || []) {
      if (depth[next] === undefined) {
        depth[next] = depth[s] + 1
        queue.push(next)
      }
    }
  }
  let max = 0
  for (const d of Object.values(depth)) max = Math.max(max, d)
  for (const s of automaton.states) if (depth[s] === undefined) depth[s] = max + 1
  return depth
}

export function layeredLayout(automaton) {
  const depth = computeDepths(automaton)

  const byDepth = {}
  for (const s of automaton.states) (byDepth[depth[s]] ||= []).push(s)
  for (const d of Object.keys(byDepth)) byDepth[d].sort()

  const pos = {}
  const nodes = []
  for (const d of Object.keys(byDepth)) {
    const col = byDepth[d]
    col.forEach((id, row) => {
      const x = MARGIN + Number(d) * COL
      const y = MARGIN + row * ROW
      pos[id] = { x, y }
      nodes.push({
        id,
        x,
        y,
        isStart: id === automaton.start,
        isAccept: automaton.accept.includes(id),
      })
    })
  }

  const merged = {}
  for (const t of automaton.transitions) {
    const key = `${t.from}->${t.to}`
    ;(merged[key] ||= { from: t.from, to: t.to, symbols: [] }).symbols.push(t.symbol)
  }

  const edges = Object.values(merged).map((e) => {
    let kind = 'forward'
    if (e.from === e.to) kind = 'self'
    else if (depth[e.to] <= depth[e.from]) kind = 'back'
    return {
      ...e,
      label: e.symbols.map((s) => (s === ' ' ? '␣' : s)).join(', '),
      kind,
      fromPos: pos[e.from],
      toPos: pos[e.to],
    }
  })

  const width = MARGIN * 2 + (Math.max(0, ...Object.values(depth))) * COL + COL
  const maxRows = Math.max(1, ...Object.values(byDepth).map((c) => c.length))
  const height = MARGIN * 2 + maxRows * ROW

  return { nodes, edges, width, height }
}
