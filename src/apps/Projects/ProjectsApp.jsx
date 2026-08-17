import { ArrowUpRight } from 'lucide-react'
import { projects } from '../../data/projects'

export default function ProjectsApp() {
  return (
    <div className="projects-app">
      <header className="app-intro">
        <div><span>INDEX / SELECTED WORK</span><h2>Systems made<br />to be <em>used.</em></h2></div>
        <p>Selected products across applied AI, machine learning and considered web experiences.</p>
      </header>
      <div className="project-grid-os">
        {projects.map((project, index) => (
          <a className="project-card-os" href={project.url} target="_blank" rel="noreferrer" key={project.id}>
            <div className="project-media">
              <img src={project.image} alt="" loading="lazy" />
              <span>0{index + 1}</span>
            </div>
            <div className="project-copy">
              <div><small>{project.category} · {project.year}</small><h3>{project.title}</h3></div>
              <ArrowUpRight size={19} />
              <p>{project.description}</p>
              <ul>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
