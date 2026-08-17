import { useCallback, useEffect, useRef, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import BootScreen from './os/BootScreen'
import Desktop from './os/Desktop'
import { projectBySlug } from './data/projects'
import { OSProvider, useOSStore } from './store/useOSStore'

function OSExperience() {
  const [booted, setBooted] = useState(false)
  const { slug } = useParams()
  const { closeWindow, openProject } = useOSStore()
  const routedProjectRef = useRef(null)
  const finishBoot = useCallback(() => setBooted(true), [])

  useEffect(() => {
    const project = slug ? projectBySlug.get(slug) : null
    document.title = project ? `${project.title} — STATO OS` : 'STATO OS — Software Engineer / AI Systems Builder'
    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute('content', project?.description || 'STATO OS — the interactive portfolio of Avraham Stato, software engineer and AI systems builder.')
    if (!booted) return
    if (project) openProject(project.id)
    if (!project && routedProjectRef.current) closeWindow(`project:${routedProjectRef.current}`, { syncRoute: false })
    routedProjectRef.current = project?.id || null
  }, [booted, closeWindow, openProject, slug])

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
    <BrowserRouter basename="/portfolio" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <RoutedOSProvider>
        <Routes>
          <Route path="/" element={<OSExperience />} />
          <Route path="/projects/:slug" element={<OSExperience />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RoutedOSProvider>
    </BrowserRouter>
  )
}

export default App
