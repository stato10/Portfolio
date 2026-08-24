import { useState } from 'react'
import { ArrowLeft, ArrowRight, Boxes, Images, Layers3, UserRound } from 'lucide-react'
import { projectById, projects } from '../../data/projects'
import { useOSStore } from '../../store/useOSStore'
import ProjectArchitecture from './ProjectArchitecture'
import ProjectMedia from './ProjectMedia'
import ProjectOverview from './ProjectOverview'

const tabs = [
  { id: 'overview', label: 'Overview', icon: Layers3 },
  { id: 'architecture', label: 'Architecture', icon: Boxes },
  { id: 'media', label: 'Media', icon: Images },
  { id: 'stack', label: 'Stack & Role', icon: UserRound },
]

export default function ProjectWindow({ windowItem }) {
  const [tab, setTab] = useState('overview')
  const { closeWindow, launchProject } = useOSStore()
  const project = projectById.get(windowItem.projectId)
  if (!project) return <div className="project-not-found">Project data unavailable.</div>
  const projectIndex = projects.findIndex((item) => item.id === project.id)
  const previousProject = projects[(projectIndex - 1 + projects.length) % projects.length]
  const nextProject = projects[(projectIndex + 1) % projects.length]

  const openAdjacentProject = (projectId) => {
    closeWindow(windowItem.id, { syncRoute: false })
    launchProject(projectId, { standardDuration: 420 })
  }

  return (
    <div className="project-case-app">
      <aside className="case-navigation">
        <div className="case-monogram" style={{ '--project-accent': project.accent }}>{project.shortTitle.slice(0, 2).toUpperCase()}</div>
        <div><strong>{project.shortTitle}</strong><small>{project.category}</small></div>
        <nav aria-label={`${project.title} sections`}>
          {tabs.map((item) => {
            const Icon = item.icon
            return <button key={item.id} type="button" className={tab === item.id ? 'is-selected' : ''} aria-current={tab === item.id ? 'page' : undefined} onClick={() => setTab(item.id)}><Icon /><span>{item.label}</span></button>
          })}
        </nav>
        <footer><span>{project.status}</span><small>{project.year}</small></footer>
      </aside>

      <main className="case-content" tabIndex="-1">
        {tab === 'overview' && <ProjectOverview project={project} />}
        {tab === 'architecture' && <ProjectArchitecture project={project} />}
        {tab === 'media' && (
          <div className="project-media-tab"><header><span className="app-kicker">MEDIA SYSTEM</span><h2>Project views</h2><p>Media loads on demand. Future launch and hero video slots are already part of the project schema.</p></header><div>{project.media.screenshots.length ? project.media.screenshots.map((item) => <ProjectMedia key={item.src} item={item} title={project.title} />) : <ProjectMedia item={null} title={project.title} />}</div></div>
        )}
        {tab === 'stack' && (
          <div className="project-stack-tab"><header><span className="app-kicker">ENGINEERING RECORD</span><h2>Stack & role</h2></header><section><div><span>Technology</span>{project.stack.map((item) => <p key={item}>{item}</p>)}</div><div><span>My role</span>{project.role.map((item) => <p key={item}>{item}</p>)}</div></section></div>
        )}
        <nav className="case-project-switcher" aria-label="Browse case studies">
          <button type="button" onClick={() => openAdjacentProject(previousProject.id)}><ArrowLeft /><span><small>Previous case</small><strong>{previousProject.shortTitle}</strong></span></button>
          <p>{String(projectIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</p>
          <button type="button" onClick={() => openAdjacentProject(nextProject.id)}><span><small>Next case</small><strong>{nextProject.shortTitle}</strong></span><ArrowRight /></button>
        </nav>
      </main>
    </div>
  )
}
