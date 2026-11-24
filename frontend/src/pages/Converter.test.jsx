import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

vi.mock('../nfa/api.js', () => ({
  fetchNFAList: vi.fn(() => Promise.resolve([
    { id: 'ends_01', label: 'Ends in 01', group: 'classic' },
  ])),
  fetchConversion: vi.fn(() => Promise.resolve({
    nfa: { id: 'ends_01', label: 'Ends in 01', group: 'classic', alphabet: ['0', '1'], epsilon: false, states: ['q0', 'q1', 'q2'], start: 'q0', accept: ['q2'], transitions: [{ from: 'q0', symbol: '0', to: 'q1' }] },
    dfa: { id: 'ends_01_dfa', label: 'Ends in 01 → DFA', group: 'converted', alphabet: ['0', '1'], states: ['{q0}'], start: '{q0}', accept: [], transitions: [] },
    table: [{ dfa_state: '{q0}', nfa_states: ['q0'], moves: { '0': '{q0}', '1': '{q0}' }, is_start: true, is_accept: false }],
  })),
}))

import Converter from './Converter.jsx'

describe('Converter', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the page heading without crashing', () => {
    const html = renderToStaticMarkup(<Converter />)
    expect(html).toContain('NFA')
    expect(html).toContain('DFA')
  })
})
