import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import BootScreen from './os/BootScreen'
import Desktop from './os/Desktop'
import { projectBySlug } from './data/projects'
import { OSProvider, useOSStore } from './store/useOSStore'

function OSExperience() {
  const [booted, setBooted] = useState(false)
  const { slug } = useParams()
  const { openProject } = useOSStore()
  const finishBoot = useCallback(() => setBooted(true), [])

  useEffect(() => {
    const project = slug ? projectBySlug.get(slug) : null
    document.title = project ? `${project.title} — STATO OS` : 'STATO OS — Software Engineer / AI Systems Builder'
    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute('content', project?.description || 'STATO OS — the interactive portfolio of Avraham Stato, software engineer and AI systems builder.')
    if (booted && project) openProject(project.id)
  }, [booted, openProject, slug])

  return (
    <>
      <Desktop ready={booted} />
      {!booted && <BootScreen onComplete={finishBoot} />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter basename="/portfolio" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <OSProvider>
        <Routes>
          <Route path="/" element={<OSExperience />} />
          <Route path="/projects/:slug" element={<OSExperience />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </OSProvider>
    </BrowserRouter>
  )
}

export default App
