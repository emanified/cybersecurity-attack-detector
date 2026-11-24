import { useEffect, useState } from 'react'
import { fetchDFAList, fetchDFA } from '../simulator/api.js'
import { useDFASimulation } from '../simulator/useDFASimulation.js'
import DFAPicker from '../simulator/DFAPicker.jsx'
import AutomatonGraph from '../simulator/AutomatonGraph.jsx'
import InputTape from '../simulator/InputTape.jsx'
import SimulatorControls from '../simulator/SimulatorControls.jsx'
import TransitionTable from '../simulator/TransitionTable.jsx'

// Verified canonical-accept inputs: each string drives its DFA from the start
// state straight to an accept state (strict run → ACCEPT). buffer_overflow is
// omitted because its alphabet uses meta-symbols ('any', 'len>100'), not typed chars.
const EXAMPLES = [
  { id: 'xss', label: 'XSS', input: '<script>' },
  { id: 'command_injection', label: 'Command Inj.', input: ';ls' },
  { id: 'directory_traversal', label: 'Dir. Traversal', input: '../' },
  { id: 'brute_force', label: 'Brute Force', input: 'FFFFF' },
  { id: 'phishing', label: 'Phishing', input: 'paypa1' },
  { id: 'csrf', label: 'CSRF', input: 'transfer?amount=' },
  { id: 'dns_spoofing', label: 'DNS Spoofing', input: 'a.0.0' },
  { id: 'session_hijacking', label: 'Session Hijack', input: 'session_id=' },
  { id: 'xml_injection', label: 'XML Injection', input: '<a>' },
  { id: 'sql_classic', label: 'SQLi Classic', input: "'or1=1" },
  { id: 'sql_union', label: 'SQLi UNION', input: "' union select" },
  { id: 'sql_comment', label: 'SQLi Comment', input: "'--" },
  { id: 'sql_bool', label: 'SQLi Boolean', input: "' and 1=1" },
  { id: 'sql_time', label: 'SQLi Time', input: "'; waitfor delay" },
  { id: 'sql_stacked', label: 'SQLi Stacked', input: "'; drop table" },
  { id: 'sql_tautology', label: 'SQLi Tautology', input: "'or'x'='x" },
  { id: 'sql_error', label: 'SQLi Error', input: "' and 1=conver" },
  { id: 'sql_oob', label: 'SQLi OOB', input: "'; exec xp_cmd" },
  { id: 'sql_hex', label: 'SQLi Hex', input: '0x' },
]

// Human-readable language definition per automaton: what the symbols mean (Σ)
// and which strings the DFA accepts (L).
const LANG = {
  xss: { sigma: 'characters of an HTML script tag: < > c r i p t s', lang: 'strings containing the substring <script>' },
  command_injection: { sigma: '; (command separator), space, l, s', lang: 'a shell command chained after ; e.g. ;ls' },
  directory_traversal: { sigma: '. (dot), / and \\ (slashes)', lang: 'one or more ../ or ..\\ path-escape sequences' },
  brute_force: { sigma: 'F = failed login attempt, S = successful login', lang: 'several fails followed by a success: FFFFF…S' },
  phishing: { sigma: 'letters of a lookalike domain: p a y l, digit 1', lang: 'a spoofed brand spelling, e.g. paypa1 (1 replaces l)' },
  csrf: { sigma: 'characters of transfer?amount=', lang: 'a forged money-transfer request URL' },
  buffer_overflow: { sigma: 'any = any character, len>100 = length passed 100', lang: 'any input longer than 100 characters' },
  dns_spoofing: { sigma: 'letters a–z, digits 0–9, . and - (domain + IP chars)', lang: 'a domain name mapped to a mismatched numeric IP' },
  session_hijacking: { sigma: 'characters of session_id= / session_token=', lang: 'a request carrying a session id / token parameter' },
  xml_injection: { sigma: 'letters a–z plus < and > (XML tag chars)', lang: 'an injected XML element such as <role>…</role>' },
  sql_classic: { sigma: "' (quote), space, o, r, 1, =", lang: "the classic tautology ' OR '1'='1" },
  sql_union: { sigma: "' plus letters of union select", lang: "a UNION-based injection ' UNION SELECT…" },
  sql_comment: { sigma: "' (quote) and - (dash)", lang: "a comment-out injection '--" },
  sql_bool: { sigma: "' plus a n d 1 =", lang: "a boolean-blind injection ' AND 1=1" },
  sql_time: { sigma: "' plus letters of waitfor delay", lang: "a time-based injection '; WAITFOR DELAY" },
  sql_stacked: { sigma: "' ; plus letters of drop table", lang: "a stacked query '; DROP TABLE" },
  sql_tautology: { sigma: "' plus o r x =", lang: "the tautology ' OR 'x'='x" },
  sql_error: { sigma: "' plus letters of convert", lang: "an error-based injection ' AND 1=CONVERT(int,…)" },
  sql_oob: { sigma: "' ; _ plus letters of exec xp_cmdshell", lang: "an out-of-band injection '; EXEC xp_cmdshell" },
  sql_hex: { sigma: '0 and x (hex literal prefix)', lang: 'a hex-encoded literal such as 0x61…' },
}

export default function Simulator() {
  const [list, setList] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [variant, setVariant] = useState(null)
  const [automaton, setAutomaton] = useState(null)
  const [input, setInput] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDFAList()
      .then((items) => {
        setList(items)
        if (items.length) setSelectedId(items[0].id)
      })
      .catch((e) => setError(e.message))
  }, [])

  useEffect(() => {
    if (!selectedId) return
    fetchDFA(selectedId, variant)
      .then((a) => {
        setAutomaton(a)
        setError(null)
      })
      .catch((e) => setError(e.message))
  }, [selectedId, variant])

  const sim = useDFASimulation(automaton, input)
  const cursorIndex = sim.current ? sim.current.i : -1

  const onSelect = (d) => {
    setSelectedId(d.id)
    setVariant(d.variants?.length ? d.variants[0] : null)
    const ex = EXAMPLES.find((e) => e.id === d.id)
    if (ex) setInput(ex.input)
  }

  const loadExample = (ex) => {
    setSelectedId(ex.id)
    setVariant(null)
    setInput(ex.input)
  }

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--mono)', letterSpacing: '0.04em' }}>DFA Simulator</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          Pick an automaton, type an input, and step through the run. Canonical DFA semantics (start state, consume each character, accept or reject).
        </p>
      </div>

      {error && <div style={{ color: 'var(--danger)', fontFamily: 'var(--mono)' }}>Error: {error}</div>}

      <div className="panel" style={{ padding: '1.25rem' }}>
        <DFAPicker list={list} selectedId={selectedId} onSelect={onSelect} variant={variant} onVariant={setVariant} />
      </div>

      <div className="panel" style={{ padding: '1.25rem' }}>
        <div className="section-label" style={{ marginBottom: 10 }}>
          Example Inputs <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>— click to load an automaton + a string that ACCEPTS</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              onClick={() => loadExample(ex)}
              title={ex.input}
              style={{
                padding: '6px 12px', borderRadius: 5, fontFamily: 'var(--mono)',
                fontSize: 'var(--text-xs)', cursor: 'pointer',
                border: `1px solid ${selectedId === ex.id ? 'var(--accent)' : 'var(--border)'}`,
                background: selectedId === ex.id ? 'var(--accent-dim)' : 'var(--bg3)',
                color: selectedId === ex.id ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      <div className="panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type an input string to simulate…"
          spellCheck={false}
          style={{
            background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
            color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 'var(--text-base)', padding: '0.8rem 1rem', outline: 'none',
          }}
        />
        <InputTape input={input} cursorIndex={cursorIndex} />
        <SimulatorControls sim={sim} />
      </div>

      {automaton && LANG[selectedId] && (
        <div className="panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="section-label">Language Definition</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
            <div>
              <span style={{ color: 'var(--accent)' }}>Σ (alphabet):</span>{' '}
              <span style={{ color: 'var(--text-muted)' }}>{LANG[selectedId].sigma}</span>
            </div>
            <div>
              <span style={{ color: 'var(--accent)' }}>L (accepted language):</span>{' '}
              <span style={{ color: 'var(--text-muted)' }}>{LANG[selectedId].lang}</span>
            </div>
          </div>
        </div>
      )}

      {automaton && (
        <div className="panel" style={{ padding: '1.25rem' }}>
          <AutomatonGraph automaton={automaton} currentState={sim.current?.state} />
        </div>
      )}

      {automaton && (
        <div className="panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="section-label">
            Transition Table <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>— δ: Q × Σ → Q (current state highlighted)</span>
          </div>
          <TransitionTable automaton={automaton} currentState={sim.current?.state} />
        </div>
      )}
    </div>
  )
}
