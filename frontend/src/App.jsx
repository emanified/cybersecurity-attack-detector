import { useState, useEffect } from 'react'
import Header from './components/Header'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Simulator from './pages/Simulator'
import Converter from './pages/Converter'
import About from './components/About'

export default function App() {
  const [page, setPage] = useState('landing')
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  if (page === 'landing') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
        <Landing onStart={() => setPage('home')} onHowItWorks={() => setPage('about')} theme={theme} onToggleTheme={toggleTheme} />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <Header currentPage={page} onNavigate={setPage} theme={theme} onToggleTheme={toggleTheme} />
      <main
        key={page}
        className="page-enter"
        style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem' }}
      >
        {page === 'home' ? <Home /> : page === 'simulator' ? <Simulator /> : page === 'converter' ? <Converter /> : <About />}
      </main>
    </div>
  )
}
