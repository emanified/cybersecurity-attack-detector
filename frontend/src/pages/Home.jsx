import { useState, useCallback } from 'react'
import Scanner from '../components/Scanner'
import ResultCard from '../components/ResultCard'
import DFAVisualizer from '../components/DFAVisualizer'
import AttackHistory from '../components/AttackHistory'
import StatsPanel from '../components/StatsPanel'

const API_URL = 'http://localhost:5001'

export default function Home() {
  const [result, setResult] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [history, setHistory] = useState([])

  const handleScan = useCallback(async (input) => {
    if (!input.trim()) return
    setScanning(true)

    try {
      const res = await fetch(`${API_URL}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      const entry = {
        ...data,
        input,
        timestamp: new Date().toLocaleTimeString(),
        id: Date.now(),
      }
      setResult(entry)
      setHistory(prev => [entry, ...prev].slice(0, 50))
    } catch {
      const errEntry = {
        attack_type: 'ERROR',
        method: '—',
        details: 'Could not reach backend',
        pattern: '—',
        path: [],
        input,
        timestamp: new Date().toLocaleTimeString(),
        id: Date.now(),
      }
      setResult(errEntry)
    } finally {
      setScanning(false)
    }
  }, [])

  const handleClearHistory = useCallback(() => {
    setHistory([])
    setResult(null)
  }, [])

  return (
    <div className="home-grid">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        <Scanner onScan={handleScan} scanning={scanning} />
        <DFAVisualizer result={result} scanning={scanning} />
        <AttackHistory history={history} onReplay={handleScan} onClear={handleClearHistory} />
      </div>

      <div className="sticky-col" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
        position: 'sticky',
        top: '1.5rem',
      }}>
        <ResultCard result={result} scanning={scanning} />
        <StatsPanel history={history} />
      </div>
    </div>
  )
}
