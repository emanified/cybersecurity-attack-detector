import { useState, useMemo } from 'react'

const TYPE_COLORS = {
  SAFE: 'var(--success)',
  XSS: 'var(--warn)',
  SQL: 'var(--danger)',
  'COMMAND INJECTION': 'var(--danger)',
  'DIRECTORY TRAVERSAL': 'var(--purple)',
  'BRUTE FORCE': 'var(--accent)',
  PHISHING: 'var(--pink)',
  CSRF: 'var(--teal)',
  'BUFFER OVERFLOW': 'var(--danger)',
  'DNS SPOOFING': 'var(--lime)',
  'SESSION HIJACKING': 'var(--warn)',
  'XML INJECTION': 'var(--purple)',
}

function getTypeColor(t) {
  if (!t) return 'var(--text-muted)'
  for (const [k, v] of Object.entries(TYPE_COLORS)) {
    if (t.toUpperCase().includes(k)) return v
  }
  return 'var(--danger)'
}

function shortType(t) {
  if (!t) return '?'
  if (t === 'SAFE') return 'SAFE'
  const map = {
    'CROSS-SITE SCRIPTING': 'XSS',
    'COMMAND INJECTION': 'CMD-INJ',
    'DIRECTORY TRAVERSAL': 'DIR-TRAV',
    'BRUTE FORCE': 'BRUTE',
    PHISHING: 'PHISH',
    CSRF: 'CSRF',
    'BUFFER OVERFLOW': 'BUF-OVF',
    'DNS SPOOFING': 'DNS',
    'SESSION HIJACKING': 'SESS-HIJ',
    'XML INJECTION': 'XML-INJ',
  }
  for (const [k, v] of Object.entries(map)) {
    if (t.toUpperCase().includes(k)) return v
  }
  if (t.toUpperCase().includes('SQL')) return 'SQL-INJ'
  return t.slice(0, 8).toUpperCase()
}

export default function AttackHistory({ history, onReplay, onClear }) {
  const [filter, setFilter]   = useState('ALL')
  const [search, setSearch]   = useState('')
  const [expanded, setExpanded] = useState(null)

  const filterOptions = ['ALL', 'THREATS', 'SAFE']

  const filtered = useMemo(() => history.filter(e => {
    if (filter === 'THREATS' && e.attack_type === 'SAFE') return false
    if (filter === 'SAFE'    && e.attack_type !== 'SAFE') return false
    if (search && !e.input?.toLowerCase().includes(search.toLowerCase())
               && !e.attack_type?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [history, filter, search])

  const threatCount = history.filter(e => e.attack_type !== 'SAFE').length

  const exportCSV = () => {
    const headers = ['Timestamp', 'Attack Type', 'Method', 'Input']
    const rows = history.map(e => [
      e.timestamp, e.attack_type, e.method || '—',
      `"${(e.input || '').replace(/"/g, '""')}"`,
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cyberguard-scan-log-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ animation: 'pageEnter 0.45s var(--ease-out) both' }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '1.25rem', flexWrap: 'wrap', gap: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            fontSize: 'var(--text-sm)',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            fontFamily: 'var(--mono)',
            fontWeight: 500,
          }}>
            Detection Log
          </span>
          {history.length > 0 && (
            <span style={{
              background: 'var(--danger-dim)',
              border: '1px solid rgba(255,59,92,0.22)',
              borderRadius: 5,
              fontSize: 'var(--text-xs)',
              padding: '2px 8px',
              color: 'var(--danger)',
              fontFamily: 'var(--mono)',
              fontWeight: 600,
            }}>
              {threatCount} threat{threatCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {history.length > 0 && (
            <button
              onClick={exportCSV}
              style={{
                background: 'var(--bg3)', border: '1px solid var(--border)',
                borderRadius: 6, color: 'var(--accent)',
                fontSize: 'var(--text-xs)', padding: '6px 14px',
                letterSpacing: '0.08em', fontFamily: 'var(--mono)',
                transition: 'all 0.15s', textTransform: 'uppercase', fontWeight: 500,
              }}
              onMouseEnter={e => { e.target.style.borderColor = 'var(--border-bright)'; e.target.style.background = 'var(--accent-dim)' }}
              onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg3)' }}
            >
              ↓ Export CSV
            </button>
          )}
          <button
            onClick={onClear}
            style={{
              background: 'none', border: '1px solid var(--border)',
              borderRadius: 6, color: 'var(--text-muted)',
              fontSize: 'var(--text-xs)', padding: '6px 14px',
              letterSpacing: '0.08em', fontFamily: 'var(--mono)',
              transition: 'all 0.15s', textTransform: 'uppercase',
            }}
            onMouseEnter={e => { e.target.style.borderColor = 'var(--border-bright)'; e.target.style.color = 'var(--danger)' }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-muted)' }}
          >
            Clear Log
          </button>
        </div>
      </div>

      {/* ── Filters + Search ── */}
      {history.length > 0 && (
        <div style={{
          display: 'flex', gap: 8, marginBottom: '1rem',
          flexWrap: 'wrap', alignItems: 'center',
        }}>
          {filterOptions.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? 'var(--accent-dim)' : 'var(--bg3)',
                border: `1px solid ${filter === f ? 'rgba(0,212,255,0.35)' : 'var(--border)'}`,
                borderRadius: 6,
                color: filter === f ? 'var(--accent)' : 'var(--text-muted)',
                fontSize: 'var(--text-xs)',
                padding: '5px 12px',
                letterSpacing: '0.1em',
                fontFamily: 'var(--mono)',
                fontWeight: filter === f ? 600 : 400,
                transition: 'all 0.15s',
                textTransform: 'uppercase',
              }}
            >
              {f}
            </button>
          ))}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search payloads…"
            style={{
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              color: 'var(--text)',
              fontSize: 'var(--text-base)',
              padding: '5px 12px',
              outline: 'none',
              fontFamily: 'var(--mono)',
              width: 190,
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--border-bright)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <span style={{
            fontSize: 10,
            color: 'var(--text-muted)',
            fontFamily: 'var(--mono)',
            marginLeft: 2,
          }}>
            {filtered.length}/{history.length}
          </span>
        </div>
      )}

      {/* ── Table header ── */}
      {filtered.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '70px 110px 1fr 90px',
          gap: 10, padding: '6px 14px', marginBottom: 3,
        }}>
          {['Time', 'Type', 'Payload', 'Method'].map(h => (
            <span key={h} style={{
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--text-faint)',
              fontFamily: 'var(--mono)',
              fontWeight: 500,
            }}>
              {h}
            </span>
          ))}
        </div>
      )}

      {/* ── Log entries ── */}
      <div style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        minHeight: 400, maxHeight: 520,
        overflowY: 'auto',
      }}>
        {filtered.length === 0 ? (
          <div style={{
            color: 'var(--text-muted)',
            fontSize: 'var(--text-base)',
            textAlign: 'center',
            padding: '4rem 1rem',
            fontFamily: 'var(--mono)',
            letterSpacing: '0.04em',
          }}>
            {history.length === 0
              ? 'No scans yet — run detection to populate log.'
              : 'No entries match filter.'}
          </div>
        ) : filtered.map((entry, i) => {
          const short = shortType(entry.attack_type)
          const col   = getTypeColor(entry.attack_type)
          const isThreat   = entry.attack_type !== 'SAFE'
          const trunc      = entry.input?.length > 60 ? entry.input.slice(0, 58) + '…' : entry.input
          const isExpanded = expanded === i

          return (
            <div key={i}>
              <div
                onClick={() => setExpanded(isExpanded ? null : i)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '70px 110px 1fr 90px',
                  gap: 10,
                  padding: '10px 14px',
                  borderBottom: '1px solid rgba(255,255,255,0.025)',
                  animation: 'fadeIn 0.25s ease',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.12s',
                  borderLeft: isThreat ? `2px solid ${col}50` : '2px solid transparent',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Time */}
                <span style={{
                  color: 'var(--text-muted)',
                  fontSize: 'var(--text-sm)',
                  fontFamily: 'var(--mono)',
                }}>
                  {entry.timestamp}
                </span>

                {/* Type badge */}
                <span style={{
                  fontWeight: 700,
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '0.06em',
                  color: col,
                  fontFamily: 'var(--mono)',
                  background: col + '18',
                  border: `1px solid ${col}35`,
                  borderRadius: 4,
                  padding: '2px 8px',
                  display: 'inline-block',
                  whiteSpace: 'nowrap',
                }}>
                  {short}
                </span>

                {/* Payload */}
                <span style={{
                  color: 'var(--text-dim)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--mono)',
                  fontSize: 'var(--text-base)',
                }}>
                  {trunc}
                </span>

                {/* Method */}
                <span style={{
                  color: 'var(--text-muted)',
                  fontSize: 'var(--text-xs)',
                  textAlign: 'right',
                  letterSpacing: '0.04em',
                  fontFamily: 'var(--mono)',
                }}>
                  {entry.method?.split('·')[0]?.trim() || '—'}
                </span>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div style={{
                  padding: '10px 16px 12px',
                  background: 'rgba(0,212,255,0.025)',
                  borderBottom: '1px solid var(--border)',
                  fontFamily: 'var(--mono)',
                  lineHeight: 1.9,
                }}>
                  <div style={{ fontSize: 12 }}>
                    <span style={{ color: 'var(--text-dim)', marginRight: 8, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Full payload</span>
                    <span style={{ color: 'var(--accent)', wordBreak: 'break-all' }}>{entry.input}</span>
                  </div>
                  {entry.path?.length > 0 && (
                    <div style={{ fontSize: 11, marginTop: 2 }}>
                      <span style={{ color: 'var(--text-dim)', marginRight: 8, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>DFA path</span>
                      <span style={{ color: 'var(--text-muted)' }}>{entry.path.join(' → ')}</span>
                    </div>
                  )}
                  <div style={{ fontSize: 11, marginTop: 2 }}>
                    <span style={{ color: 'var(--text-dim)', marginRight: 8, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Attack type</span>
                    <span style={{ color: col, fontWeight: 600 }}>{entry.attack_type}</span>
                  </div>
                  {onReplay && (
                    <button
                      onClick={() => onReplay(entry.input)}
                      style={{
                        marginTop: 8, background: 'var(--accent-dim)',
                        border: '1px solid rgba(0,212,255,0.25)',
                        borderRadius: 5, color: 'var(--accent)',
                        fontSize: 'var(--text-xs)', padding: '4px 12px',
                        fontFamily: 'var(--mono)', letterSpacing: '0.08em',
                        textTransform: 'uppercase', cursor: 'pointer',
                      }}
                    >
                      ↺ Replay
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}