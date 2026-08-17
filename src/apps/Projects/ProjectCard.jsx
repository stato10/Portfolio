import { ArrowUpRight } from 'lucide-react'
import ProjectMedia from './ProjectMedia'

export default function ProjectCard({ project, index, view, onOpen }) {
  return (
    <button
      type="button"
      className={`explorer-project-card view-${view}`}
      onClick={() => onOpen(project.id)}
      style={{ '--project-accent': project.accent }}
      aria-label={`Open ${project.title} case study`}
      data-project-card
    >
      <ProjectMedia item={project.media.thumbnail ? { type: 'image', src: project.media.thumbnail, alt: `${project.title} interface preview` } : null} title={project.title} aspectRatio={view === 'list' ? '1 / 1' : '16 / 10'} />
      <span className="project-card-index">{String(index + 1).padStart(2, '0')}</span>
      <span className="project-card-body">
        <span className="project-card-meta">{project.category} <i /> {project.year}</span>
        <strong>{project.title}</strong>
        <small>{project.description}</small>
        <span className="project-card-stack">{project.stack.slice(0, 3).map((technology) => <i key={technology}>{technology}</i>)}</span>
      </span>
      <ArrowUpRight className="project-card-arrow" aria-hidden="true" />
    </button>
  )
}
