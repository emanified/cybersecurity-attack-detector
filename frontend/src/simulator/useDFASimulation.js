import { useEffect, useMemo, useRef, useState } from 'react'

function buildTable(automaton) {
  const table = {}
  for (const t of automaton.transitions) {
    ;(table[t.from] ||= {})[t.symbol] = t.to
  }
  return table
}

const hasCounterEdges = (table, state) =>
  table[state] && (table[state].any !== undefined || table[state]['len>100'] !== undefined)

function nextState(table, state, char, consumed) {
  const row = table[state]
  if (!row) return undefined
  if (hasCounterEdges(table, state)) {
    if (consumed > 100 && row['len>100'] !== undefined) return row['len>100']
    if (row.any !== undefined) return row.any
    return undefined
  }
  return row[char]
}

export function computeSteps(automaton, input) {
  const table = buildTable(automaton)
  const accept = new Set(automaton.accept)
  const steps = [
    { i: -1, char: null, state: automaton.start, accepted: accept.has(automaton.start), dead: false },
  ]
  let state = automaton.start
  for (let i = 0; i < input.length; i++) {
    const next = nextState(table, state, input[i], i + 1)
    if (next === undefined) {
      steps.push({ i, char: input[i], state, accepted: false, dead: true })
      return steps
    }
    state = next
    steps.push({ i, char: input[i], state, accepted: accept.has(state), dead: false })
  }
  return steps
}

export function useDFASimulation(automaton, input) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [prevKey, setPrevKey] = useState({ automaton, input })

  const steps = useMemo(
    () => (automaton ? computeSteps(automaton, input) : []),
    [automaton, input],
  )

  // Reset when the automaton or input changes (adjust state during render — React-recommended over an effect).
  if (prevKey.automaton !== automaton || prevKey.input !== input) {
    setPrevKey({ automaton, input })
    setIndex(0)
    setPlaying(false)
  }

  const stepsRef = useRef(steps)
  useEffect(() => {
    stepsRef.current = steps
  }, [steps])

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setIndex((prev) => {
        if (prev >= stepsRef.current.length - 1) {
          setPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 600)
    return () => clearInterval(id)
  }, [playing])

  const atEnd = index >= steps.length - 1
  return {
    steps,
    index,
    current: steps[index],
    playing,
    next: () => setIndex((p) => Math.min(p + 1, steps.length - 1)),
    prev: () => setIndex((p) => Math.max(p - 1, 0)),
    reset: () => { setIndex(0); setPlaying(false) },
    togglePlay: () => setPlaying((p) => (atEnd ? false : !p)),
    atEnd,
    atStart: index === 0,
  }
}
