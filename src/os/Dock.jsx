import { apps } from '../data/apps'
import { useOSStore } from '../store/useOSStore'
import AppIcon from './AppIcon'

const dockApps = apps.filter((app) => ['projects', 'terminal', 'ai-lab', 'systems', 'about', 'contact', 'github'].includes(app.id))

export default function Dock() {
  const { windows, activeWindowId, openApp } = useOSStore()

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
            onClick={() => openApp(app.id)}
            aria-label={`Open ${app.title}`}
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
