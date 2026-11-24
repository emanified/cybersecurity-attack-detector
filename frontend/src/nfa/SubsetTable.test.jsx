import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import SubsetTable from './SubsetTable.jsx'

const table = [
  { dfa_state: '{q0}', nfa_states: ['q0'], moves: { '0': '{q0,q1}', '1': '{q0}' }, is_start: true, is_accept: false },
  { dfa_state: '{q0,q1}', nfa_states: ['q0', 'q1'], moves: { '0': '{q0,q1}', '1': '{q0,q2}' }, is_start: false, is_accept: false },
  { dfa_state: '{q0,q2}', nfa_states: ['q0', 'q2'], moves: { '0': '{q0,q1}', '1': '{q0}' }, is_start: false, is_accept: true },
]

describe('SubsetTable', () => {
  it('renders one row per table entry', () => {
    const html = renderToStaticMarkup(<SubsetTable table={table} alphabet={['0', '1']} />)
    const rowCount = (html.match(/<tr/g) || []).length
    expect(rowCount).toBe(4)
  })

  it('renders a column header per alphabet symbol', () => {
    const html = renderToStaticMarkup(<SubsetTable table={table} alphabet={['0', '1']} />)
    expect(html).toContain('>0<')
    expect(html).toContain('>1<')
  })

  it('shows the accept marker for accept rows', () => {
    const html = renderToStaticMarkup(<SubsetTable table={table} alphabet={['0', '1']} />)
    expect(html).toContain('{q0,q2}')
    expect(html).toContain('✓')
  })
})
