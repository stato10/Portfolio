import { apps } from '../data/apps'
import { useOSStore } from '../store/useOSStore'
import AppIcon from './AppIcon'

export default function DesktopIcons() {
  const { openApp } = useOSStore()
  return (
    <div className="desktop-icons" aria-label="Desktop applications">
      {apps.map((app) => (
        <button key={app.id} type="button" className="desktop-icon" onDoubleClick={() => openApp(app.id)} onClick={() => openApp(app.id)}>
          <span style={{ '--app-accent': app.accent }}><AppIcon app={app} size={27} /></span>
          <small>{app.shortLabel}</small>
        </button>
      ))}
    </div>
  )
}
