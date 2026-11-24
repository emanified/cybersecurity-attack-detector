import { describe, it, expect } from 'vitest'
import { computeSteps } from './useDFASimulation.js'

const xss = {
  start: 'q0',
  accept: ['q8'],
  transitions: [
    { from: 'q0', symbol: '<', to: 'q1' },
    { from: 'q1', symbol: 's', to: 'q2' },
    { from: 'q2', symbol: 'c', to: 'q3' },
    { from: 'q3', symbol: 'r', to: 'q4' },
    { from: 'q4', symbol: 'i', to: 'q5' },
    { from: 'q5', symbol: 'p', to: 'q6' },
    { from: 'q6', symbol: 't', to: 'q7' },
    { from: 'q7', symbol: '>', to: 'q8' },
  ],
}

describe('computeSteps', () => {
  it('accepts <script>', () => {
    const steps = computeSteps(xss, '<script>')
    const last = steps[steps.length - 1]
    expect(last.state).toBe('q8')
    expect(last.accepted).toBe(true)
    expect(last.dead).toBe(false)
  })

  it('rejects a string with no valid transition', () => {
    const steps = computeSteps(xss, '<x')
    const last = steps[steps.length - 1]
    expect(last.dead).toBe(true)
    expect(last.accepted).toBe(false)
  })

  it('first step is the start state before consuming input', () => {
    const steps = computeSteps(xss, '<script>')
    expect(steps[0].state).toBe('q0')
    expect(steps[0].char).toBe(null)
  })

  it('empty input yields a single start step, accepted iff start is accepting', () => {
    const steps = computeSteps(xss, '')
    expect(steps).toHaveLength(1)
    expect(steps[0].accepted).toBe(false)
  })

  it('buffer-overflow counter: any char loops, len>100 accepts', () => {
    const counter = {
      start: 'q0',
      accept: ['q_accept'],
      transitions: [
        { from: 'q0', symbol: 'any', to: 'q0' },
        { from: 'q0', symbol: 'len>100', to: 'q_accept' },
      ],
    }
    const shortSteps = computeSteps(counter, 'abc')
    expect(shortSteps[shortSteps.length - 1].accepted).toBe(false)
    const longSteps = computeSteps(counter, 'A'.repeat(101))
    expect(longSteps[longSteps.length - 1].accepted).toBe(true)
  })
})
