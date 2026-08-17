import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useOSStore } from '../store/useOSStore'
import AppWindow from './AppWindow'
import TerminalApp from '../apps/Terminal/TerminalApp'
import ProjectsApp from '../apps/Projects/ProjectsApp'
import AboutApp from '../apps/About/AboutApp'
import PlaceholderApp from '../apps/PlaceholderApp'

function AppContent({ appId }) {
  if (appId === 'terminal') return <TerminalApp />
  if (appId === 'projects') return <ProjectsApp />
  if (appId === 'about') return <AboutApp />
  return <PlaceholderApp appId={appId} />
}

export default function WindowManager() {
  const { windows, setWindowBounds } = useOSStore()

  useEffect(() => {
    const keepWindowsInBounds = () => {
      windows.forEach((windowItem) => {
        if (windowItem.maximized) return
        const width = Math.min(windowItem.bounds.width, window.innerWidth - 24)
        const height = Math.min(windowItem.bounds.height, window.innerHeight - 132)
        setWindowBounds(windowItem.id, {
          width,
          height,
          x: Math.min(Math.max(12, windowItem.bounds.x), window.innerWidth - width - 12),
          y: Math.min(Math.max(44, windowItem.bounds.y), window.innerHeight - 96),
        })
      })
    }
    window.addEventListener('resize', keepWindowsInBounds)
    return () => window.removeEventListener('resize', keepWindowsInBounds)
  }, [windows, setWindowBounds])

  return (
    <div className="window-layer">
      <AnimatePresence>
        {windows.filter((windowItem) => !windowItem.minimized).map((windowItem) => (
          <AppWindow key={windowItem.id} windowItem={windowItem}>
            <AppContent appId={windowItem.appId} />
          </AppWindow>
        ))}
      </AnimatePresence>
    </div>
  )
}
