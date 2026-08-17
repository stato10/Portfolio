import { useEffect, useState } from 'react'
import { BatteryMedium, Search, Wifi } from 'lucide-react'
import { useOSStore } from '../store/useOSStore'

const formatTime = () => new Intl.DateTimeFormat('en', {
  weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
}).format(new Date())

export default function MenuBar() {
  const { windows, activeWindowId, openApp } = useOSStore()
  const [time, setTime] = useState(formatTime)

  useEffect(() => {
    const interval = window.setInterval(() => setTime(formatTime()), 30000)
    return () => window.clearInterval(interval)
  }, [])

  const activeWindow = windows.find((item) => item.id === activeWindowId)

  return (
    <header className="menu-bar">
      <div className="menu-left">
        <button className="stato-menu" onClick={() => openApp('about')} aria-label="Open About Stato">S</button>
        <strong>{activeWindow?.title || 'STATO OS'}</strong>
        <span className="menu-item">File</span>
        <span className="menu-item">View</span>
      </div>
      <div className="menu-right" aria-label="System status">
        <button onClick={() => openApp('projects')} aria-label="Search projects"><Search size={14} /></button>
        <Wifi size={15} />
        <BatteryMedium size={17} />
        <time>{time}</time>
      </div>
    </header>
  )
}
