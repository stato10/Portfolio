import { useEffect, useState } from 'react'
import { Monitor, PanelsTopLeft, Search } from 'lucide-react'
import { useOSStore } from '../store/useOSStore'

const formatTime = () => new Intl.DateTimeFormat('en', {
  weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: true,
}).format(new Date())

export default function MenuBar() {
  const { windows, activeWindowId, openApp, openSpotlight, openTaskView, minimizeWindow } = useOSStore()
  const [time, setTime] = useState(formatTime)

  useEffect(() => {
    const interval = window.setInterval(() => setTime(formatTime()), 30000)
    return () => window.clearInterval(interval)
  }, [])

  const activeWindow = windows.find((item) => item.id === activeWindowId)

  return (
    <header className="menu-bar">
      <div className="menu-left">
        <button className="stato-menu" onClick={() => openApp('welcome')} aria-label="Open Welcome">S</button>
        <strong>{activeWindow?.title || 'STATO OS'}</strong>
        <nav className="menu-links" aria-label="Portfolio shortcuts">
          <button type="button" onClick={() => openApp('projects')}>Work</button>
          <button type="button" onClick={() => openApp('resume')}>Resume</button>
          <button type="button" onClick={() => openApp('contact')}>Contact</button>
          <button type="button" onClick={() => openApp('welcome')}>Help</button>
        </nav>
      </div>
      <div className="menu-right" aria-label="System status">
        <button onClick={openTaskView} aria-label="Open task view"><PanelsTopLeft size={14} /></button>
        <button onClick={openSpotlight} aria-label="Open Spotlight search"><Search size={14} /></button>
        <button onClick={() => windows.filter((item) => !item.minimized).forEach((item) => minimizeWindow(item.id))} disabled={!windows.some((item) => !item.minimized)} aria-label="Show desktop" title="Show desktop — keep applications open"><Monitor size={15} /></button>
        <time>{time}</time>
      </div>
    </header>
  )
}
