import { useEffect, useState } from 'react'
import { BatteryMedium, CircleUserRound, PanelsTopLeft, Search, SlidersHorizontal, Wifi } from 'lucide-react'
import { useOSStore } from '../store/useOSStore'

const formatTime = () => new Intl.DateTimeFormat('en', {
  weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: true,
}).format(new Date())

export default function MenuBar() {
  const { windows, activeWindowId, openApp, openSpotlight, openTaskView } = useOSStore()
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
        <span className="menu-item">Edit</span>
        <span className="menu-item">View</span>
        <span className="menu-item">Window</span>
        <span className="menu-item">Help</span>
      </div>
      <div className="menu-right" aria-label="System status">
        <button onClick={openTaskView} aria-label="Open task view"><PanelsTopLeft size={14} /></button>
        <button onClick={openSpotlight} aria-label="Open Spotlight search"><Search size={14} /></button>
        <Wifi size={15} />
        <BatteryMedium size={17} />
        <SlidersHorizontal size={15} />
        <CircleUserRound size={16} />
        <time>{time}</time>
      </div>
    </header>
  )
}
