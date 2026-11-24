import { describe, it, expect } from 'vitest'
import { layeredLayout } from './layout.js'

const automaton = {
  start: 'q0',
  accept: ['q2'],
  states: ['q0', 'q1', 'q2'],
  transitions: [
    { from: 'q0', symbol: 'a', to: 'q1' },
    { from: 'q1', symbol: 'b', to: 'q2' },
    { from: 'q1', symbol: 'x', to: 'q1' },
    { from: 'q2', symbol: 'r', to: 'q0' },
  ],
}

describe('layeredLayout', () => {
  it('assigns increasing x by BFS depth', () => {
    const { nodes } = layeredLayout(automaton)
    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]))
    expect(byId.q0.x).toBeLessThan(byId.q1.x)
    expect(byId.q1.x).toBeLessThan(byId.q2.x)
  })

  it('merges parallel symbols and classifies edge kinds', () => {
    const { edges } = layeredLayout(automaton)
    const self = edges.find((e) => e.from === 'q1' && e.to === 'q1')
    const back = edges.find((e) => e.from === 'q2' && e.to === 'q0')
    expect(self.kind).toBe('self')
    expect(back.kind).toBe('back')
  })

  it('includes every state as a node', () => {
    const { nodes } = layeredLayout(automaton)
    expect(nodes.map((n) => n.id).sort()).toEqual(['q0', 'q1', 'q2'])
  })
})
