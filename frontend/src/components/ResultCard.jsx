const ATTACK_INFO = {
  'XSS': {
    full: 'Cross-Site Scripting',
    severity: 'HIGH',
    desc: 'Malicious scripts injected into trusted web pages to execute in victims\' browsers.',
    mitigation: 'Sanitize output, use Content Security Policy, encode user data',
    color: '#ffa520',
  },
  'SQL': {
    full: 'SQL Injection',
    severity: 'CRITICAL',
    desc: 'Malicious SQL code inserted into a query to manipulate the database.',
    mitigation: 'Use parameterized queries, prepared statements, input validation',
    color: '#ff3b5c',
  },
  'COMMAND INJECTION': {
    full: 'OS Command Injection',
    severity: 'CRITICAL',
    desc: 'Attacker executes arbitrary OS commands on the host server.',
    mitigation: 'Avoid shell calls, sanitize inputs, use allowlists',
    color: '#ff3b5c',
  },
  'DIRECTORY TRAVERSAL': {
    full: 'Path Traversal',
    severity: 'HIGH',
    desc: 'Accessing files/directories outside the intended root directory.',
    mitigation: 'Validate and sanitize file paths, use chroot environments',
    color: '#c47bff',
  },
  'BRUTE FORCE': {
    full: 'Brute Force Attack',
    severity: 'MEDIUM',
    desc: 'Repeated login attempts to guess credentials by exhaustive search.',
    mitigation: 'Rate limiting, account lockout, multi-factor authentication',
    color: '#00d4ff',
  },
  'PHISHING': {
    full: 'Phishing / Lookalike URL',
    severity: 'HIGH',
    desc: 'Deceptive URLs mimicking legitimate sites using character substitution.',
    mitigation: 'URL validation, domain allowlisting, user education',
    color: '#ff6eb4',
  },
  'CSRF': {
    full: 'Cross-Site Request Forgery',
    severity: 'HIGH',
    desc: 'Tricks authenticated users into performing unintended actions.',
    mitigation: 'CSRF tokens, SameSite cookies, referer validation',
    color: '#00ffcc',
  },
  'BUFFER OVERFLOW': {
    full: 'Buffer Overflow',
    severity: 'CRITICAL',
    desc: 'Input exceeds buffer capacity, potentially corrupting memory.',
    mitigation: 'Input length validation, bounds checking, memory-safe languages',
    color: '#ff3b5c',
  },
  'DNS SPOOFING': {
    full: 'DNS Cache Poisoning',
    severity: 'HIGH',
    desc: 'Corrupting DNS cache to redirect traffic to malicious servers.',
    mitigation: 'DNSSEC, encrypted DNS (DoH/DoT), DNS monitoring',
    color: '#aaff44',
  },
  'SESSION HIJACKING': {
    full: 'Session Hijacking',
    severity: 'HIGH',
    desc: 'Stealing session tokens to impersonate authenticated users.',
    mitigation: 'HTTPS only, secure/httpOnly cookies, session regeneration',
    color: '#ffa520',
  },
  'XML INJECTION': {
    full: 'XML Injection',
    severity: 'MEDIUM',
    desc: 'Injecting malicious XML content to alter document structure.',
    mitigation: 'Input validation, XML schema validation, disable external entities',
    color: '#c47bff',
  },
}

function getAttackInfo(type) {
  if (!type || type === 'SAFE' || type === 'ERROR') return null
  for (const [k, v] of Object.entries(ATTACK_INFO)) {
    if (type.toUpperCase().includes(k)) return { ...v, key: k }
  }
  return { full: type, severity: 'UNKNOWN', color: '#ff3b5c' }
}

function SeverityBadge({ severity }) {
  const colors = {
    CRITICAL: { bg: 'rgba(255,59,92,0.15)', border: 'rgba(255,59,92,0.4)', text: '#ff3b5c' },
    HIGH:     { bg: 'rgba(255,170,32,0.12)', border: 'rgba(255,170,32,0.35)', text: '#ffaa20' },
    MEDIUM:   { bg: 'rgba(0,212,255,0.1)',   border: 'rgba(0,212,255,0.3)',   text: '#00d4ff' },
    LOW:      { bg: 'rgba(0,229,153,0.1)',   border: 'rgba(0,229,153,0.3)',   text: '#00e599' },
    UNKNOWN:  { bg: 'rgba(100,100,100,0.1)', border: 'rgba(100,100,100,0.3)', text: '#888' },
  }
  const c = colors[severity] || colors.UNKNOWN
  return (
    <span style={{
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: 5,
      color: c.text,
      fontSize: 'var(--text-sm)',
      padding: '4px 12px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      fontFamily: 'var(--mono)',
      fontWeight: 700,
    }}>
      {severity}
    </span>
  )
}

export default function ResultCard({ result, scanning }) {
  if (!result && !scanning) {
    return (
      <div className="panel page-enter" style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '2.5rem 2rem',
          textAlign: 'center',
          minHeight: 200,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '0.9rem',
        }}>
          <div style={{ fontSize: '2.8rem', opacity: 0.25 }}>🛡</div>
          <div style={{
            fontFamily: 'var(--display)',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            letterSpacing: '-0.01em',
          }}>
            Awaiting Input
          </div>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-faint)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: 'var(--mono)',
          }}>
            Submit a payload to analyze
          </div>
        </div>
      </div>
    )
  }

  const isThreat = result && result.attack_type !== 'SAFE' && result.attack_type !== 'ERROR'
  const isError  = result?.attack_type === 'ERROR'
  const isSafe   = result?.attack_type === 'SAFE'

  const statusColor = isError ? 'var(--warn)' : isThreat ? 'var(--danger)' : 'var(--success)'
  const borderColor = isError ? 'rgba(255,170,32,0.3)' : isThreat ? 'rgba(255,59,92,0.35)' : 'rgba(0,229,153,0.28)'
  const heroBg      = isError ? 'rgba(255,170,32,0.05)' : isThreat ? 'rgba(255,59,92,0.06)' : 'rgba(0,229,153,0.05)'

  const attackInfo = result ? getAttackInfo(result.attack_type) : null

  const rows = result ? [
    { k: 'Detection',  v: result.attack_type,                       cls: isThreat ? statusColor : 'var(--success)', bold: true },
    { k: 'Method',     v: result.method || '—',                     mono: true },
    { k: 'Pattern',    v: result.pattern || '—',                    mono: true },
    { k: 'DFA States', v: result.path?.length > 0 ? result.path.join(' → ') : '—', mono: true, small: true },
    { k: 'Input Chars',v: result.input?.length + ' chars' },
    { k: 'Timestamp',  v: result.timestamp },
  ] : []

  return (
    <div className="panel page-enter" style={{
      border: `1px solid ${borderColor}`,
      overflow: 'hidden',
      transition: 'border-color 0.4s var(--ease-out), box-shadow 0.4s var(--ease-out)',
      animation: isThreat ? 'threatPulse 2s ease-in-out infinite' : 'scaleIn 0.4s var(--ease-out) both',
    }}>

      {/* ── Hero ── */}
      <div style={{
        padding: '2rem 1.75rem',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '0.7rem',
        background: heroBg, transition: 'background 0.4s',
        minHeight: 180,
      }}>
        {scanning ? (
          <>
            <div style={{ fontSize: '2.4rem', animation: 'spin 1s linear infinite', color: 'var(--accent)' }}>◌</div>
            <div style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.01em' }}>
              Analyzing…
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--mono)', fontWeight: 600 }}>
              DFA engine processing
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '2.6rem', lineHeight: 1, color: statusColor, textShadow: `0 0 30px ${statusColor}70` }}>
              {isError ? '⚠' : isThreat ? '⚠' : '✓'}
            </div>
            <div style={{
              fontFamily: 'var(--display)',
              fontSize: '1.35rem',
              fontWeight: 800,
              color: statusColor,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}>
              {isSafe ? 'Input Clean' : isError ? 'Error' : result.attack_type}
            </div>
            {attackInfo && <SeverityBadge severity={attackInfo.severity} />}
            {isSafe && (
              <span style={{
                fontSize: 'var(--text-sm)', color: 'var(--success)',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                fontFamily: 'var(--mono)', opacity: 0.85, fontWeight: 600,
              }}>
                No threats detected
              </span>
            )}
          </>
        )}
      </div>

      {/* ── Attack description ── */}
      {attackInfo?.desc && !scanning && (
        <div style={{
          padding: '1.1rem 1.6rem',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(255,59,92,0.025)',
        }}>
          <div style={{
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: 8,
            fontFamily: 'var(--mono)',
          }}>
            About this attack
          </div>
          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--text-dim)',
            lineHeight: 1.75,
            fontFamily: 'var(--sans)',
            fontWeight: 400,
          }}>
            {attackInfo.desc}
          </p>
          {attackInfo.mitigation && (
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)',
              marginTop: 8,
              fontFamily: 'var(--sans)',
              lineHeight: 1.6,
            }}>
              <span style={{ color: 'var(--success)', marginRight: 6, fontWeight: 600 }}>✓ Fix:</span>
              {attackInfo.mitigation}
            </p>
          )}
        </div>
      )}

      {/* ── Data rows ── */}
      {result && !scanning && (
        <div style={{ padding: '1.25rem 1.6rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {rows.map(r => (
            <div key={r.k} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '1rem',
            }}>
              <span style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                fontFamily: 'var(--mono)',
                textTransform: 'uppercase',
                paddingTop: 2,
                minWidth: 80,
              }}>
                {r.k}
              </span>
              <span style={{
                fontSize: r.small ? 'var(--text-sm)' : 'var(--text-base)',
                color: r.cls || (r.mono ? 'var(--accent)' : 'var(--text-dim)'),
                fontWeight: r.bold ? 700 : 400,
                textAlign: 'right',
                wordBreak: 'break-all',
                lineHeight: 1.55,
                fontFamily: r.mono ? 'var(--mono)' : 'var(--sans)',
              }}>
                {r.v || '—'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}