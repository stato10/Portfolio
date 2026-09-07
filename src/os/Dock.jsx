import { apps } from '../data/apps'
import { useOSStore } from '../store/useOSStore'
import AppIcon from './AppIcon'

const dockApps = apps.filter((app) => ['projects', 'terminal', 'ai-lab', 'systems', 'resume', 'about', 'contact', 'github'].includes(app.id))

export default function Dock() {
  const { windows, activeWindowId, focusWindow, minimizeWindow, openApp } = useOSStore()

  const activate = (app, windowItem, active) => {
    if (!windowItem) {
      openApp(app.id)
      return
    }
    if (active) {
      minimizeWindow(windowItem.id)
      return
    }
    focusWindow(windowItem.id)
  }

  return (
    <nav className="dock" aria-label="Application dock">
      {dockApps.map((app) => {
        const windowItem = windows.find((item) => item.appId === app.id)
        const active = windowItem?.id === activeWindowId && !windowItem.minimized
        return (
          <button
            type="button"
            key={app.id}
            className={`dock-item${active ? ' is-active' : ''}`}
            onClick={() => activate(app, windowItem, active)}
            aria-label={active ? `Minimize ${app.title}` : windowItem ? `Restore ${app.title}` : `Open ${app.title}`}
            title={app.title}
          >
            <span className="dock-tooltip">{app.shortLabel}</span>
            <span className="dock-icon" style={{ '--app-accent': app.accent }}><AppIcon app={app} size={25} /></span>
            {windowItem && <i className="dock-running" aria-hidden="true" />}
          </button>
        )
      })}
    </nav>
  )
}
