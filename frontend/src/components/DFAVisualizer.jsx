import { useEffect, useRef, useState } from 'react'

const COLOR_MAP = {
  XSS: '#ffa520',
  SQL: '#ff3b5c',
  'COMMAND INJECTION': '#ff3b5c',
  'DIRECTORY TRAVERSAL': '#c47bff',
  'BRUTE FORCE': '#00d4ff',
  PHISHING: '#ff6eb4',
  CSRF: '#00ffcc',
  'BUFFER OVERFLOW': '#ff3b5c',
  'DNS SPOOFING': '#aaff44',
  'SESSION HIJACKING': '#ffa520',
  'XML INJECTION': '#c47bff',
  SAFE: '#00e599',
}

function getColor(attackType) {
  if (!attackType) return '#00e599'
  for (const [k, v] of Object.entries(COLOR_MAP)) {
    if (attackType.toUpperCase().includes(k)) return v
  }
  return '#ff3b5c'
}

function drawArrow(ctx, x1, y1, x2, y2, color) {
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const ar = 10
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - ar * Math.cos(angle - Math.PI / 6), y2 - ar * Math.sin(angle - Math.PI / 6))
  ctx.lineTo(x2 - ar * Math.cos(angle + Math.PI / 6), y2 - ar * Math.sin(angle + Math.PI / 6))
  ctx.closePath()
  ctx.fill()
}

export default function DFAVisualizer({ result }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const [canvasSize, setCanvasSize] = useState({ width: 900, height: 220 })

  const attackType = result?.attack_type

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateSize = () => {
      const pathLen = result?.path?.length || 0
      const containerWidth = container.clientWidth - 48
      const neededWidth = pathLen > 0 ? Math.max(containerWidth, pathLen * 130 + 160) : Math.max(containerWidth, 640)
      setCanvasSize({ width: neededWidth, height: pathLen > 6 ? 240 : 220 })
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(container)
    return () => observer.disconnect()
  }, [result?.path?.length])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const W = canvasSize.width
    const H = canvasSize.height

    canvas.width = W * dpr
    canvas.height = H * dpr
    canvas.style.width = W + 'px'
    canvas.style.height = H + 'px'

    const ctx = canvas.getContext('2d')
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, W, H)

    const path = result?.path || []
    if (!path.length) {
      ctx.fillStyle = 'rgba(120,160,200,0.55)'
      ctx.font = '500 15px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(result ? 'No DFA path — detected via regex classifier' : 'Submit a payload to visualize DFA traversal', W / 2, H / 2)
      return
    }

    const col = getColor(attackType)
    const r = 36
    const n = path.length
    const spacing = Math.max(130, (W - 160) / Math.max(n - 1, 1))
    const totalWidth = (n - 1) * spacing
    const sx = Math.max(80, (W - totalWidth) / 2)
    const cy = H / 2

    for (let i = 0; i < n - 1; i++) {
      const x1 = sx + i * spacing
      const x2 = sx + (i + 1) * spacing
      const isLast = i === n - 2
      drawArrow(ctx, x1 + r, cy, x2 - r, cy, isLast ? col + 'cc' : 'rgba(100,180,255,0.22)')
      ctx.fillStyle = 'rgba(100,180,255,0.45)'
      ctx.font = '500 12px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('t' + i, (x1 + x2) / 2, cy - 28)
    }

    path.forEach((state, i) => {
      const x = sx + i * spacing
      const isFirst = i === 0
      const isLast = i === n - 1
      const nodeColor = isLast ? col : isFirst ? 'rgba(0,212,255,0.65)' : 'rgba(100,180,255,0.32)'
      const textColor = isLast ? col : isFirst ? '#00d4ff' : 'rgba(140,190,230,0.85)'

      if (isLast) {
        for (let ring = 3; ring >= 1; ring--) {
          ctx.beginPath()
          ctx.arc(x, cy, r + ring * 7, 0, Math.PI * 2)
          ctx.strokeStyle = col + Math.round(18 / ring).toString(16).padStart(2, '0')
          ctx.lineWidth = 5 - ring
          ctx.stroke()
        }
      }

      if (isFirst) {
        ctx.beginPath()
        ctx.arc(x, cy, r + 8, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(0,212,255,0.22)'
        ctx.lineWidth = 1.5
        ctx.stroke()
        ctx.strokeStyle = 'rgba(0,212,255,0.4)'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(x - r - 28, cy)
        ctx.lineTo(x - r, cy)
        ctx.stroke()
        ctx.fillStyle = 'rgba(0,212,255,0.4)'
        ctx.beginPath()
        ctx.moveTo(x - r, cy)
        ctx.lineTo(x - r - 9, cy - 5)
        ctx.lineTo(x - r - 9, cy + 5)
        ctx.closePath()
        ctx.fill()
      }

      ctx.beginPath()
      ctx.arc(x, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = isLast ? col + '1a' : isFirst ? 'rgba(0,212,255,0.1)' : 'rgba(100,180,255,0.07)'
      ctx.fill()
      ctx.strokeStyle = nodeColor
      ctx.lineWidth = isLast ? 3 : 1.5
      ctx.stroke()

      ctx.fillStyle = textColor
      ctx.font = `${isLast || isFirst ? '700' : '600'} 15px "JetBrains Mono", monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(state, x, cy)

      ctx.fillStyle = 'rgba(100,180,255,0.4)'
      ctx.font = '500 12px "JetBrains Mono", monospace'
      ctx.fillText('q' + i, x, cy + r + 20)

      if (isFirst) {
        ctx.fillStyle = 'rgba(0,212,255,0.5)'
        ctx.font = '600 12px "JetBrains Mono", monospace'
        ctx.fillText('start', x, cy - r - 20)
      }

      if (isLast && attackType !== 'SAFE') {
        ctx.fillStyle = col + 'cc'
        ctx.font = '700 12px "JetBrains Mono", monospace'
        ctx.fillText('accept', x, cy - r - 20)
        ctx.beginPath()
        ctx.arc(x, cy, r - 7, 0, Math.PI * 2)
        ctx.strokeStyle = col + '55'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
    })
  }, [result?.path, result?.attack_type, canvasSize])

  return (
    <div className="page-enter" style={{ animationDelay: '0.08s' }}>
      <div
        className="section-label"
        style={{ marginBottom: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          DFA State Transition Path
          {result?.path?.length > 0 && (
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-faint)', letterSpacing: '0.06em' }}>{result.path.length} states</span>
          )}
        </span>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-faint)', letterSpacing: '0.04em', fontFamily: 'var(--mono)' }}>
          Full automaton → Simulator tab
        </span>
      </div>

      <div
        ref={containerRef}
        className="panel"
        style={{
          padding: '1.75rem 1.5rem',
          overflowX: 'auto',
          animation: result?.path?.length ? 'scaleIn 0.4s var(--ease-out) both' : undefined,
        }}
      >
        <canvas ref={canvasRef} style={{ display: 'block', minWidth: '100%' }} />
      </div>

      {result?.path?.length > 0 && (
        <div
          style={{
            marginTop: 12,
            fontSize: 'var(--text-sm)',
            color: 'var(--text-muted)',
            fontFamily: 'var(--mono)',
            letterSpacing: '0.04em',
            display: 'flex',
            gap: 24,
            animation: 'fadeIn 0.35s ease both',
          }}
        >
          <span>◯ state</span>
          <span>→ transition</span>
          <span style={{ color: result?.attack_type !== 'SAFE' ? 'var(--danger)' : 'var(--success)' }}>⊙ accept state</span>
        </div>
      )}
    </div>
  )
}
