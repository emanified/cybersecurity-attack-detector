const ATTACKS = [
  { name: 'XSS', full: 'Cross-Site Scripting', color: '#ffa520', method: 'DFA', desc: 'Detects <script> tag patterns and script injection attempts using state transitions.' },
  { name: 'SQL Injection', full: '10 Variants', color: '#ff3b5c', method: 'DFA', desc: 'Classic, UNION, Boolean Blind, Time-Based, Error-Based, Stacked, Tautology, OOB, Hex Encoding, Comment-based.' },
  { name: 'Command Injection', full: 'OS Command Injection', color: '#ff3b5c', method: 'DFA', desc: 'Detects semicolon-based command chaining and shell injection sequences.' },
  { name: 'Directory Traversal', full: 'Path Traversal', color: '#c47bff', method: 'DFA', desc: 'Identifies ../ and ..\\ sequences used to escape intended directories.' },
  { name: 'Brute Force', full: 'Login Enumeration', color: '#00d4ff', method: 'DFA', desc: 'Detects sequences of 5+ consecutive F (fail) characters followed by S (success).' },
  { name: 'Phishing', full: 'Lookalike URLs', color: '#ff6eb4', method: 'DFA', desc: 'Identifies homoglyph substitution in domain names (e.g. paypa1.com).' },
  { name: 'CSRF', full: 'Cross-Site Request Forgery', color: '#00ffcc', method: 'DFA', desc: 'Detects transfer?amount= patterns indicative of forged financial requests.' },
  { name: 'Buffer Overflow', full: 'Memory Overflow', color: '#ff3b5c', method: 'DFA', desc: 'Flags inputs exceeding 100 characters — potential stack smashing attempts.' },
  { name: 'DNS Spoofing', full: 'Cache Poisoning', color: '#aaff44', method: 'DFA', desc: 'Detects domain → IP patterns that indicate DNS mapping manipulation.' },
  { name: 'Session Hijacking', full: 'Token Theft', color: '#ffa520', method: 'DFA', desc: 'Identifies duplicate session_token parameters indicating replay attacks.' },
  { name: 'XML Injection', full: 'Data Injection', color: '#c47bff', method: 'DFA', desc: 'Detects role-escalation XML tags injected into user input fields.' },
]

const DFA_STEPS = [
  { q: 'q₀', label: 'Start State', desc: 'Initial state. DFA begins here for every input string.' },
  { q: 'qₙ', label: 'Transition States', desc: 'Intermediate states reached on valid character-by-character transitions.' },
  { q: 'qₐ', label: 'Accept State', desc: 'Final accepting state. Reaching here means an attack pattern was fully matched.' },
  { q: 'qᵣ', label: 'Reject / Dead State', desc: 'Non-accepting state. Input did not match any known attack pattern → SAFE.' },
]

export default function AboutPage() {
  return (
    <div style={{ padding: '2rem 0', animation: 'pageEnter 0.45s var(--ease-out) both' }}>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontSize: 'var(--text-sm)', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'var(--mono)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
          <span style={{ width: 20, height: 1, background: 'var(--accent)' }} />
          Architecture Overview
        </div>
        <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.75rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 12 }}>
          How CyberGuard Works
        </h2>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-dim)', lineHeight: 1.85, maxWidth: 720, fontFamily: 'var(--sans)' }}>
          CyberGuard uses <strong style={{ color: 'var(--accent)' }}>Deterministic Finite Automata (DFAs)</strong> to classify network payloads in real time. Each attack type is modeled as a separate DFA with states, transitions, and accepting states — mapping directly to the formal definition δ: Q × Σ → Q.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

        <div className="panel" style={{ padding: '1.75rem' }}>
          <div style={{ fontSize: 'var(--text-sm)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 14, fontFamily: 'var(--mono)', fontWeight: 600 }}>
            DFA Formal Definition
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 'var(--text-base)', color: 'var(--text-dim)', lineHeight: 2, marginBottom: 16 }}>
            <div>A DFA is a 5-tuple <span style={{ color: 'var(--accent)' }}>M = (Q, Σ, δ, q₀, F)</span> where:</div>
            <div style={{ paddingLeft: 16, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                ['Q', 'Finite set of states'],
                ['Σ', 'Input alphabet (characters/tokens)'],
                ['δ', 'Transition function: Q × Σ → Q'],
                ['q₀', 'Start state (q₀ ∈ Q)'],
                ['F', 'Set of accept states (F ⊆ Q)'],
              ].map(([sym, desc]) => (
                <div key={sym}>
                  <span style={{ color: 'var(--accent)', minWidth: 28, display: 'inline-block' }}>{sym}</span>
                  <span style={{ color: 'var(--text-muted)' }}> — {desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontFamily: 'var(--sans)', borderTop: '1px solid var(--border)', paddingTop: 14, lineHeight: 1.7 }}>
            Each incoming character drives a state transition. If the final state is in F (accepting set), the payload is classified as an attack.
          </div>
        </div>

        <div className="panel" style={{ padding: '1.75rem' }}>
          <div style={{ fontSize: 'var(--text-sm)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 14, fontFamily: 'var(--mono)', fontWeight: 600 }}>
            State Types
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {DFA_STEPS.map((s, i) => (
              <div key={s.q} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', animation: `fadeIn 0.4s ease ${i * 0.06}s both` }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--border-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--mono)', fontSize: 'var(--text-sm)', color: 'var(--accent)', fontWeight: 600 }}>
                  {s.q}
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-base)', color: 'var(--text)', fontFamily: 'var(--sans)', fontWeight: 600 }}>{s.label}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontFamily: 'var(--sans)', lineHeight: 1.65, marginTop: 2 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div className="section-label" style={{ marginBottom: 14 }}>
          Attack Detection Catalog
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-faint)' }}>{ATTACKS.length} modules</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.875rem' }}>
          {ATTACKS.map((a, i) => (
            <div
              key={a.name}
              className="panel"
              style={{
                padding: '1.15rem 1.25rem',
                animation: `fadeIn 0.4s ease ${i * 0.04}s both`,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = a.color + '50'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: a.color, boxShadow: `0 0 8px ${a.color}60`, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--sans)' }}>{a.name}</span>
                </div>
                <span style={{ fontSize: 'var(--text-xs)', color: a.color, border: `1px solid ${a.color}40`, borderRadius: 4, padding: '3px 8px', fontFamily: 'var(--mono)', letterSpacing: '0.06em', fontWeight: 600 }}>{a.method}</span>
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontFamily: 'var(--sans)', lineHeight: 1.7 }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel" style={{ padding: '1.75rem' }}>
        <div style={{ fontSize: 'var(--text-sm)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16, fontFamily: 'var(--mono)', fontWeight: 600 }}>
          Project Team
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          {['Eman', 'Hamna', 'Mahnoor', 'Tooba'].map(name => (
            <div key={name} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '1rem 1.15rem', transition: 'border-color 0.2s' }}>
              <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--display)' }}>{name}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontFamily: 'var(--sans)', lineHeight: 1.8, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
          <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Stack:</span> Python · Flask · DFA Automata · React · Vite · Canvas API
        </div>
      </div>
    </div>
  )
}
