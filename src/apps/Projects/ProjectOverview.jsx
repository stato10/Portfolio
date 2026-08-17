import { Activity, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import ProjectMedia from './ProjectMedia'

export default function ProjectOverview({ project }) {
  return (
    <div className="project-overview">
      <section className="case-hero" style={{ '--project-accent': project.accent }}>
        <div className="case-hero-copy">
          <span className="app-kicker">{project.category} / {project.year}</span>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <div className="case-status"><Activity /><span>{project.status}</span></div>
        </div>
        <ProjectMedia item={project.media.thumbnail ? { type: 'image', src: project.media.thumbnail, alt: `${project.title} product interface` } : null} title={project.title} priority className="case-hero-media" />
      </section>

      <div className="case-narrative">
        <section><span>01 / PROBLEM</span><h3>Why this system exists</h3><p>{project.problem}</p></section>
        <section><span>02 / SOLUTION</span><h3>How it approaches the work</h3><p>{project.solution}</p></section>
      </div>

      <section className="capability-panel">
        <header><span className="app-kicker">SYSTEM CAPABILITIES</span><strong>{String(project.capabilities.length).padStart(2, '0')} modules</strong></header>
        <div>{project.capabilities.map((capability) => <p key={capability}><CheckCircle2 />{capability}</p>)}</div>
      </section>

      {(project.links.github || project.links.live || project.links.demo) && (
        <section className="case-links" aria-label="Project links">
          {Object.entries(project.links).filter(([, value]) => value).map(([label, value]) => <a key={label} href={value} target="_blank" rel="noreferrer">{label}<ArrowUpRight /></a>)}
        </section>
      )}
    </div>
  )
}
