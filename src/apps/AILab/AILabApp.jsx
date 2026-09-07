import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { projects, projectById } from '../../data/projects'
import { preloadProjectLaunchMedia } from '../../motion/projectLaunchMedia'
import { useOSStore } from '../../store/useOSStore'
import ProjectMedia from '../Projects/ProjectMedia'

const aiProjects = projects.filter((project) => /AI|Realtime|Decision/i.test(`${project.category} ${project.stack.join(' ')}`))

export default function AILabApp() {
  const [selectedId, setSelectedId] = useState(aiProjects[0]?.id)
  const { launchProject } = useOSStore()
  const project = projectById.get(selectedId) || aiProjects[0]
  const selectedIndex = Math.max(0, aiProjects.findIndex((item) => item.id === project?.id))

  if (!project) return <div className="lab-empty">No AI experiments are available.</div>

  return (
    <div className="ai-lab-app">
      <aside className="lab-library">
        <header>
          <div><strong>AI Lab</strong><small>Applied systems, documented</small></div>
          <span>{String(aiProjects.length).padStart(2, '0')} records</span>
        </header>
        <p>CASE FILES</p>
        <nav aria-label="AI projects">
          {aiProjects.map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={item.id === project.id ? 'is-active' : ''}
              onClick={() => setSelectedId(item.id)}
              onPointerEnter={() => preloadProjectLaunchMedia(item)}
              onFocus={() => preloadProjectLaunchMedia(item)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{item.shortTitle}</strong>
              <small>{item.category}</small>
            </button>
          ))}
        </nav>
        <footer><i /> AI appears here as product infrastructure—not decoration.</footer>
      </aside>

      <main className="lab-workspace">
        <section className="lab-hero">
          <div className="lab-hero-copy">
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <div className="lab-hero-actions">
              <button type="button" onClick={() => launchProject(project.id)}>Open case study <ArrowUpRight /></button>
              {project.links.github && <a href={project.links.github} target="_blank" rel="noreferrer">Source record</a>}
            </div>
            <dl className="lab-case-meta">
              <div><dt>Discipline</dt><dd>{project.category}</dd></div>
              <div><dt>Period</dt><dd>{project.year}</dd></div>
              <div><dt>Record</dt><dd>{String(selectedIndex + 1).padStart(2, '0')} / {String(aiProjects.length).padStart(2, '0')}</dd></div>
            </dl>
          </div>
          <figure className="lab-hero-evidence">
            <ProjectMedia key={project.id} item={project.media.thumbnail} title={project.title} priority className="lab-preview" />
            <strong className="lab-status"><i />{project.status}</strong>
            <figcaption><span>{project.shortTitle}</span><span>Captured product interface</span></figcaption>
          </figure>
        </section>

        <section className="lab-evidence-strip" aria-label="Project evidence summary">
          <p>Evidence index</p>
          <dl>
            <div><dt>Technologies</dt><dd>{String(project.stack.length).padStart(2, '0')}</dd></div>
            <div><dt>Capabilities</dt><dd>{String(project.capabilities.length).padStart(2, '0')}</dd></div>
            <div><dt>System nodes</dt><dd>{String(project.architecture.flow.length).padStart(2, '0')}</dd></div>
            <div><dt>Engineering roles</dt><dd>{String(project.role.length).padStart(2, '0')}</dd></div>
          </dl>
        </section>

        <div className="lab-detail-grid">
          <section className="lab-panel lab-capabilities">
            <header><strong>Product capabilities</strong><small>What the system can do</small></header>
            <ul>{project.capabilities.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>

          <section className="lab-panel lab-pipeline">
            <header><strong>Intelligence pipeline</strong><small>How context moves through the product</small></header>
            <ol>{project.architecture.flow.map((node, index) => <li key={node.id}><i>{index + 1}</i><span><strong>{node.label}</strong><small>{node.detail}</small></span></li>)}</ol>
          </section>

          <section className="lab-panel lab-stack">
            <header><strong>Implementation stack</strong><small>Verified project technologies</small></header>
            <ul>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        </div>
      </main>
    </div>
  )
}
