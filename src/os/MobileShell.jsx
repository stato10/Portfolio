import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, BatteryMedium, Grid2X2, Home, Search, Wifi, X } from 'lucide-react'
import { apps, appById } from '../data/apps'
import { useOSStore } from '../store/useOSStore'
import AppIcon from './AppIcon'
import WindowManager from './WindowManager'

const formatTime = () => new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date())
const launcherApps = apps.filter((app) => app.id !== 'github')

export default function MobileShell() {
  const [time, setTime] = useState(formatTime)
  const [drawerQuery, setDrawerQuery] = useState('')
  const {
    activeWindowId,
    closeWindow,
    focusWindow,
    mobileView,
    openApp,
    openSpotlight,
    showMobileApp,
    showMobileDrawer,
    showMobileHome,
    showMobileRecents,
    windows,
  } = useOSStore()

  useEffect(() => {
    const timer = window.setInterval(() => setTime(formatTime()), 30000)
    return () => window.clearInterval(timer)
  }, [])

  const recentWindows = useMemo(() => [...windows].sort((a, b) => b.zIndex - a.zIndex), [windows])
  const activeWindow = windows.find((item) => item.id === activeWindowId)
  const drawerApps = useMemo(() => {
    const term = drawerQuery.trim().toLowerCase()
    if (!term) return launcherApps
    return launcherApps.filter((app) => [app.title, app.shortLabel, ...(app.keywords || [])].some((value) => value.toLowerCase().includes(term)))
  }, [drawerQuery])

  useEffect(() => {
    if (mobileView !== 'drawer') setDrawerQuery('')
  }, [mobileView])

  const openRecent = (id) => {
    focusWindow(id)
    showMobileApp()
  }

  return (
    <div className="mobile-shell">
      <header className="mobile-statusbar"><time>{time}</time><strong>{activeWindow && mobileView === 'app' ? activeWindow.title : mobileView === 'drawer' ? 'All apps' : mobileView === 'recents' ? 'Recents' : 'STATO OS'}</strong><span><Wifi /><BatteryMedium /></span></header>

      <main className={`mobile-stage is-${mobileView}`}>
        {mobileView === 'home' && (
          <section className="mobile-launcher" aria-label="STATO OS home">
            <button className="mobile-search" type="button" onClick={openSpotlight}><Search /> Search apps, projects, skills…</button>
            <div className="mobile-identity"><h1>Avraham’s<br /><em>desktop.</em></h1>
              <div className="desktop-entry-actions"><button type="button" onClick={() => openApp('projects')}>Explore my work</button><button type="button" onClick={() => openApp('resume')}>View resume</button></div>
            </div>
            <div className="mobile-app-grid">
              {launcherApps.map((app) => (
                <button type="button" key={app.id} onClick={() => openApp(app.id)}>
                  <span style={{ '--app-accent': app.accent }}><AppIcon app={app} size={25} /></span><small>{app.shortLabel}</small>
                </button>
              ))}
            </div>
            <div className="mobile-direct-actions"><a href="mailto:statto3@gmail.com">Email</a><a href="tel:0548872039">Call</a></div>
          </section>
        )}

        {mobileView === 'app' && <WindowManager activeOnly />}

        {mobileView === 'drawer' && (
          <section className="mobile-drawer" aria-label="All applications">
            <header><div><span>APP DRAWER</span><strong>All applications</strong></div><button type="button" onClick={showMobileHome} aria-label="Close app drawer"><X /></button></header>
            <label className="mobile-drawer-search"><Search aria-hidden="true" /><span className="sr-only">Search applications</span><input value={drawerQuery} onChange={(event) => setDrawerQuery(event.target.value)} placeholder="Search apps…" /></label>
            <div className="mobile-drawer-grid">
              {drawerApps.map((app) => (
                <button type="button" key={app.id} onClick={() => openApp(app.id)}>
                  <span style={{ '--app-accent': app.accent }}><AppIcon app={app} size={24} /></span><small>{app.shortLabel}</small>
                </button>
              ))}
              {!drawerApps.length && <p>No applications match “{drawerQuery}”.</p>}
            </div>
          </section>
        )}

        {mobileView === 'recents' && (
          <section className="mobile-recents" aria-label="Recent applications">
            <header><span>RECENTS</span><strong>{recentWindows.length} running</strong></header>
            <div>
              {recentWindows.map((windowItem) => {
                const app = appById.get(windowItem.appId) || { title: windowItem.title, icon: 'layers', accent: windowItem.accent }
                return (
                  <article key={windowItem.id}>
                    <button type="button" onClick={() => openRecent(windowItem.id)}><span style={{ '--app-accent': app.accent }}><AppIcon app={app} /></span><strong>{windowItem.title}</strong><small>{windowItem.minimized ? 'Suspended' : windowItem.id === activeWindowId ? 'Active' : 'Running'}</small></button>
                    <button type="button" onClick={() => closeWindow(windowItem.id)} aria-label={`Close ${windowItem.title}`}><X /></button>
                  </article>
                )
              })}
              {!recentWindows.length && <p>No recent applications.</p>}
            </div>
          </section>
        )}
      </main>

      <nav className="mobile-navigation" aria-label="System navigation">
        <button type="button" onClick={mobileView === 'home' ? () => window.history.back() : showMobileHome} aria-label="Back"><ArrowLeft /></button>
        <button type="button" className={mobileView === 'home' ? 'is-active' : ''} onClick={showMobileHome} aria-label="Home"><Home /></button>
        <button type="button" className={mobileView === 'drawer' ? 'is-active' : ''} onClick={showMobileDrawer} aria-label="App drawer"><Grid2X2 /></button>
        <button type="button" className={mobileView === 'recents' ? 'is-active' : ''} onClick={showMobileRecents} aria-label="Recents"><span className="mobile-recents-icon" /></button>
      </nav>
    </div>
  )
}
