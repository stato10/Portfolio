import { apps } from '../data/apps'
import { useOSStore } from '../store/useOSStore'
import AppIcon from './AppIcon'

export default function DesktopIcons() {
  const { openApp, windows, activeWindowId } = useOSStore()
  return (
    <div className="desktop-icons" aria-label="Desktop applications">
      {apps.map((app) => {
        const windowItem = windows.find((item) => item.appId === app.id)
        const active = windowItem?.id === activeWindowId && !windowItem.minimized
        return (
          <button key={app.id} type="button" className={`desktop-icon${app.kind === 'folder' ? ' is-folder' : ''}${windowItem ? ' is-open' : ''}${active ? ' is-active' : ''}`} onDoubleClick={() => openApp(app.id)} onClick={() => openApp(app.id)}>
            <span style={{ '--app-accent': app.accent }}><AppIcon app={app} size={27} /></span>
            <small>{app.shortLabel}</small>
          </button>
        )
      })}
    </div>
  )
}
