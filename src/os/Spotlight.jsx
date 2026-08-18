import { useEffect, useMemo, useRef, useState } from 'react'
import { AppWindow, Command, Search, Sparkles } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { apps } from '../data/apps'
import { projects } from '../data/projects'
import { skills } from '../data/skills'
import { useOSStore } from '../store/useOSStore'
import { preloadProjectLaunchMedia } from '../motion/projectLaunchMedia'

export default function Spotlight() {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const { spotlightOpen, openSpotlight, closeSpotlight, openApp, launchProject } = useOSStore()

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    const appResults = apps
      .filter((app) => !app.externalUrl && (!term || [app.title, ...(app.keywords || [])].some((value) => value.toLowerCase().includes(term))))
      .map((app) => ({ id: `app:${app.id}`, type: 'App', title: app.title, subtitle: app.keywords?.slice(0, 2).join(' · '), action: () => openApp(app.id) }))
    const projectResults = projects
      .filter((project) => !term || [project.title, project.shortTitle, project.category, ...project.stack].some((value) => value.toLowerCase().includes(term)))
      .map((project) => ({ id: `project:${project.id}`, type: 'Project', title: project.title, subtitle: project.category, project, action: () => launchProject(project.id) }))
    const skillResults = skills
      .filter((skill) => term && skill.name.toLowerCase().includes(term))
      .slice(0, 4)
      .map((skill) => ({ id: `skill:${skill.group}:${skill.name}`, type: 'Skill', title: skill.name, subtitle: `${skill.group} capability · View related work`, action: () => openApp('projects') }))
    return [...projectResults, ...appResults, ...skillResults].slice(0, 9)
  }, [launchProject, openApp, query])

  useEffect(() => {
    const shortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        spotlightOpen ? closeSpotlight() : openSpotlight()
      }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [closeSpotlight, openSpotlight, spotlightOpen])

  useEffect(() => {
    if (spotlightOpen) {
      setQuery('')
      setActiveIndex(0)
      window.requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [spotlightOpen])

  useEffect(() => {
    if (spotlightOpen) preloadProjectLaunchMedia(results[activeIndex]?.project)
  }, [activeIndex, results, spotlightOpen])

  const chooseResult = (result) => {
    result.action()
    closeSpotlight()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') closeSpotlight()
    if (event.key === 'ArrowDown') { event.preventDefault(); setActiveIndex((index) => Math.min(index + 1, results.length - 1)) }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActiveIndex((index) => Math.max(index - 1, 0)) }
    if (event.key === 'Enter' && results[activeIndex]) { event.preventDefault(); chooseResult(results[activeIndex]) }
  }

  return (
    <AnimatePresence>
      {spotlightOpen && (
        <motion.div className="spotlight-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0.01 : 0.16 }} onMouseDown={(event) => event.target === event.currentTarget && closeSpotlight()}>
          <motion.section className="spotlight" initial={{ opacity: 0, scale: 0.96, y: -14 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -8 }} transition={{ duration: reduceMotion ? 0.01 : 0.24, ease: [0.16, 1, 0.3, 1] }} role="dialog" aria-modal="true" aria-label="Spotlight search">
            <label><Search aria-hidden="true" /><span className="sr-only">Search apps, projects and skills</span><input ref={inputRef} value={query} onChange={(event) => { setQuery(event.target.value); setActiveIndex(0) }} onKeyDown={handleKeyDown} placeholder="Search apps, projects, skills…" /></label>
            <div className="spotlight-results" role="listbox" aria-label="Search results">
              {results.map((result, index) => (
                <button type="button" key={result.id} className={activeIndex === index ? 'is-active' : ''} onMouseEnter={() => setActiveIndex(index)} onClick={() => chooseResult(result)} role="option" aria-selected={activeIndex === index}>
                  <span>{result.type === 'Project' ? <Sparkles /> : result.type === 'App' ? <AppWindow /> : <Command />}</span><span><strong>{result.title}</strong><small>{result.subtitle}</small></span><i>{result.type}</i>
                </button>
              ))}
              {!results.length && <p>No matching systems found.</p>}
            </div>
            <footer><span>↑↓ Navigate</span><span>↵ Open</span><span>esc Close</span><kbd>⌘ K</kbd></footer>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
