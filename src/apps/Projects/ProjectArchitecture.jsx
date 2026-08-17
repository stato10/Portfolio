import { ArrowDown, Braces, Database, Server, Workflow } from 'lucide-react'

const nodeIcons = [Workflow, Braces, Server, Workflow, Database]

export default function ProjectArchitecture({ project }) {
  return (
    <div className="project-architecture" style={{ '--project-accent': project.accent }}>
      <header><span className="app-kicker">SYSTEM MAP / RESPONSIVE</span><h2>Architecture</h2><p>{project.architecture.backend}. {project.architecture.data}.</p></header>
      <div className="architecture-flow" aria-label={`${project.title} system architecture`}>
        {project.architecture.flow.map((node, index) => {
          const Icon = nodeIcons[index % nodeIcons.length]
          return (
            <div className="architecture-stage" key={node.id}>
              <article><span><Icon aria-hidden="true" /></span><div><small>{String(index + 1).padStart(2, '0')}</small><strong>{node.label}</strong><p>{node.detail}</p></div></article>
              {index < project.architecture.flow.length - 1 && <div className="architecture-connector" aria-hidden="true"><i /><ArrowDown /></div>}
            </div>
          )
        })}
      </div>
      <section className="architecture-services"><span>External services</span><div>{project.architecture.externalServices.map((service) => <i key={service}>{service}</i>)}</div></section>
    </div>
  )
}
