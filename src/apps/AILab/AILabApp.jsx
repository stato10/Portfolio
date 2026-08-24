import { Activity, ArrowUpRight, Braces, Cpu, GitBranch, Layers3, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { projects, projectById } from '../../data/projects'
import { preloadProjectLaunchMedia } from '../../motion/projectLaunchMedia'
import { useOSStore } from '../../store/useOSStore'

const aiProjects = projects.filter((project) => /AI|Realtime|Decision/i.test(`${project.category} ${project.stack.join(' ')}`))

export default function AILabApp() {
  const [selectedId, setSelectedId] = useState(aiProjects[0]?.id)
  const { launchProject } = useOSStore()
  const project = projectById.get(selectedId) || aiProjects[0]

  if (!project) return <div className="lab-empty">No AI experiments are available.</div>

  return (
    <div className="ai-lab-app">
      <aside className="lab-library">
        <header><span><Sparkles /></span><div><strong>AI Lab</strong><small>Applied intelligence</small></div></header>
        <p>PROJECT LIBRARY</p>
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
              <small>{item.category} · {item.status}</small>
            </button>
          ))}
        </nav>
        <footer><i /> Models are used inside product workflows</footer>
      </aside>

      <main className="lab-workspace">
        <section className="lab-hero">
          <img src={project.media.thumbnail} alt={`${project.title} interface`} />
          <div className="lab-hero-shade" />
          <div className="lab-hero-copy">
            <span>{project.category} / {project.year}</span>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <div>
              <button type="button" onClick={() => launchProject(project.id)}>Open case study <ArrowUpRight /></button>
              {project.links.github && <a href={project.links.github} target="_blank" rel="noreferrer">Source record</a>}
            </div>
          </div>
          <strong className="lab-status"><i />{project.status}</strong>
        </section>

        <section className="lab-metrics" aria-label="Project metrics">
          <div><span><Layers3 /></span><strong>{project.stack.length}</strong><small>Technologies</small></div>
          <div><span><Activity /></span><strong>{project.capabilities.length}</strong><small>Capabilities</small></div>
          <div><span><Cpu /></span><strong>{project.architecture.flow.length}</strong><small>System nodes</small></div>
          <div><span><GitBranch /></span><strong>{project.role.length}</strong><small>Engineering roles</small></div>
        </section>

        <div className="lab-detail-grid">
          <section className="lab-panel lab-capabilities">
            <header><span>01</span><div><strong>Product capabilities</strong><small>What the system can do</small></div></header>
            <div>{project.capabilities.map((item) => <span key={item}>{item}</span>)}</div>
          </section>

          <section className="lab-panel lab-pipeline">
            <header><span>02</span><div><strong>Intelligence pipeline</strong><small>How context moves through the product</small></div></header>
            <ol>{project.architecture.flow.map((node, index) => <li key={node.id}><i>{index + 1}</i><span><strong>{node.label}</strong><small>{node.detail}</small></span></li>)}</ol>
          </section>

          <section className="lab-panel lab-stack">
            <header><span>03</span><div><strong>Implementation stack</strong><small>Verified project technologies</small></div></header>
            <div>{project.stack.map((item) => <span key={item}><Braces />{item}</span>)}</div>
          </section>
        </div>
      </main>
    </div>
  )
}
