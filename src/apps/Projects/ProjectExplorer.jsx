import { useDeferredValue, useMemo, useState } from 'react'
import { Grid2X2, List, Search, SlidersHorizontal } from 'lucide-react'
import { projectCategories, projects } from '../../data/projects'
import { useOSStore } from '../../store/useOSStore'
import ProjectCard from './ProjectCard'

export default function ProjectExplorer() {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [view, setView] = useState('grid')
  const deferredQuery = useDeferredValue(query.trim().toLowerCase())
  const { launchProject } = useOSStore()

  const filteredProjects = useMemo(() => projects.filter((project) => {
    const categoryMatch = category === 'All' || project.category === category
    const searchMatch = !deferredQuery || [project.title, project.shortTitle, project.category, project.description, ...project.stack, ...project.capabilities]
      .some((value) => value.toLowerCase().includes(deferredQuery))
    return categoryMatch && searchMatch
  }), [category, deferredQuery])

  const handleGridKeyDown = (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(event.key)) return
    const cards = [...event.currentTarget.querySelectorAll('[data-project-card]')]
    const index = cards.indexOf(document.activeElement)
    if (index < 0) return
    event.preventDefault()
    const columns = view === 'list' || window.innerWidth < 760 ? 1 : 2
    const offset = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowDown' ? columns : -columns
    cards[Math.min(Math.max(index + offset, 0), cards.length - 1)]?.focus()
  }

  return (
    <div className="project-explorer">
      <aside className="project-sidebar">
        <div className="explorer-brand"><span>PROJECTS</span><small>Workspace / 06</small></div>
        <nav aria-label="Project categories">
          {projectCategories.map((item) => (
            <button key={item} type="button" className={category === item ? 'is-selected' : ''} onClick={() => setCategory(item)}>
              <span>{item}</span><small>{item === 'All' ? projects.length : projects.filter((project) => project.category === item).length}</small>
            </button>
          ))}
        </nav>
        <div className="explorer-storage"><span><i /></span><small>Portfolio index<br />6 systems online</small></div>
      </aside>

      <section className="project-workspace">
        <header className="explorer-toolbar">
          <div><span className="app-kicker">PROJECT EXPLORER</span><h2>{category === 'All' ? 'Selected systems' : category}</h2></div>
          <div className="explorer-actions">
            <label className="explorer-search"><Search aria-hidden="true" /><span className="sr-only">Search projects</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search systems…" /></label>
            <div className="view-toggle" aria-label="Project view">
              <button type="button" className={view === 'grid' ? 'is-selected' : ''} onClick={() => setView('grid')} aria-label="Grid view"><Grid2X2 /></button>
              <button type="button" className={view === 'list' ? 'is-selected' : ''} onClick={() => setView('list')} aria-label="List view"><List /></button>
            </div>
          </div>
        </header>

        <div className="explorer-context"><span><SlidersHorizontal /> {filteredProjects.length} project{filteredProjects.length === 1 ? '' : 's'}</span><small>Press arrows to navigate · Enter to open</small></div>
        {filteredProjects.length ? (
          <div className={`explorer-projects view-${view}`} onKeyDown={handleGridKeyDown}>
            {filteredProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} view={view} onOpen={launchProject} />)}
          </div>
        ) : (
          <div className="explorer-empty"><Search /><strong>No systems found</strong><span>Try a project, technology or capability.</span><button onClick={() => { setQuery(''); setCategory('All') }}>Reset filters</button></div>
        )}
      </section>
    </div>
  )
}
