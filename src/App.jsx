import { useCallback, useEffect, useRef, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import BootScreen from './os/BootScreen'
import Desktop from './os/Desktop'
import { appByRoute } from './data/apps'
import { profile } from './data/experience'
import { projectBySlug } from './data/projects'
import { OSProvider, useOSStore } from './store/useOSStore'

const defaultTitle = 'STATO OS — Software Engineer / AI Systems Builder'
const defaultDescription = 'STATO OS — the interactive portfolio of Avraham Stato, software engineer and AI systems builder.'
const defaultShareImage = 'https://res.cloudinary.com/dpz2lh8hu/image/upload/v1753432895/a77c4ee3-ec88-421d-ad2b-1cacfc6e612b_eowqiu.png'
const routerBase = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '/'

function setMeta(selector, attribute, value) {
  const element = document.head.querySelector(selector)
  if (element) element.setAttribute(attribute, value)
}

function syncDocumentMetadata({ title, description, url, image = defaultShareImage }) {
  document.title = title
  setMeta('meta[name="description"]', 'content', description)
  setMeta('meta[property="og:title"]', 'content', title)
  setMeta('meta[property="og:description"]', 'content', description)
  setMeta('meta[property="og:url"]', 'content', url)
  setMeta('meta[property="og:image"]', 'content', image)
  setMeta('meta[name="twitter:title"]', 'content', title)
  setMeta('meta[name="twitter:description"]', 'content', description)
  setMeta('meta[name="twitter:image"]', 'content', image)
  let canonical = document.head.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = url
}

function OSExperience() {
  const [booted, setBooted] = useState(false)
  const { slug, appSlug } = useParams()
  const { openApp, openProject } = useOSStore()
  const routedProjectRef = useRef(null)
  const finishBoot = useCallback(() => setBooted(true), [])

  useEffect(() => {
    const project = slug ? projectBySlug.get(slug) : null
    const app = appSlug ? appByRoute.get(appSlug) : null
    const title = project ? `${project.title} — STATO OS` : app ? `${app.title} — STATO OS` : defaultTitle
    const description = project?.description || app?.description || defaultDescription
    const route = project ? `/projects/${project.slug}` : app?.route || ''
    syncDocumentMetadata({
      title,
      description,
      url: `${profile.contact.portfolio}${route}`,
      image: project?.media?.thumbnail || defaultShareImage,
    })
    if (!booted) return
    if (project) openProject(project.id)
    if (app) openApp(app.id, { syncRoute: false })
    routedProjectRef.current = project?.id || null
  }, [appSlug, booted, openApp, openProject, slug])

  if (appSlug && !appByRoute.has(appSlug)) return <Navigate to="/" replace />

  return (
    <>
      <Desktop ready={booted} />
      {!booted && <BootScreen onComplete={finishBoot} />}
    </>
  )
}

function RoutedOSProvider({ children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  return <OSProvider navigate={navigate} pathname={pathname}>{children}</OSProvider>
}

function App() {
  return (
    <BrowserRouter basename={routerBase} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <RoutedOSProvider>
        <Routes>
          <Route path="/" element={<OSExperience />} />
          <Route path="/projects/:slug" element={<OSExperience />} />
          <Route path="/:appSlug" element={<OSExperience />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RoutedOSProvider>
    </BrowserRouter>
  )
}

export default App
