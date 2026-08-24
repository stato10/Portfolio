import { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  CircleDot,
  Cpu,
  Download,
  FileCode2,
  FileText,
  Folder,
  FolderKanban,
  Grid2X2,
  Home,
  Layers3,
  List,
  Search,
  Sparkles,
} from 'lucide-react'
import { profile } from '../../data/experience'
import { projects } from '../../data/projects'
import { skillGroups } from '../../data/skills'
import { preloadProjectLaunchMedia } from '../../motion/projectLaunchMedia'
import { useOSStore } from '../../store/useOSStore'

const folderMeta = {
  projects: { label: 'Projects', icon: FolderKanban, detail: 'Case studies and product systems' },
  'ai-lab': { label: 'AI Lab', icon: Sparkles, detail: 'Applied AI and realtime experiments' },
  systems: { label: 'Systems', icon: Cpu, detail: 'Engineering tools and capabilities' },
  resume: { label: 'Resume', icon: FileText, detail: 'Professional documents' },
}

const sidebarFolders = ['projects', 'ai-lab', 'systems', 'resume']

function projectFile(project) {
  return {
    id: project.id,
    name: project.title,
    type: 'project',
    typeLabel: `${project.category} project`,
    modified: project.year,
    status: project.status,
    detail: project.description,
    project,
    thumbnail: project.media.thumbnail,
  }
}

function getRootItems(appId) {
  if (appId === 'projects') return projects.map(projectFile)
  if (appId === 'ai-lab') {
    return projects
      .filter((project) => /AI|Realtime/i.test(`${project.category} ${project.stack.join(' ')}`))
      .map(projectFile)
  }
  if (appId === 'systems') {
    return skillGroups.map((group) => ({
      id: group.id,
      name: group.label,
      type: 'folder',
      typeLabel: 'Capability folder',
      modified: '2026',
      status: `${group.skills.length} items`,
      detail: group.skills.join(' · '),
      children: group.skills.map((skill, index) => ({
        id: `${group.id}-${skill}`,
        name: `${skill}.skill`,
        type: 'skill',
        typeLabel: 'System capability',
        modified: '2026',
        status: 'Available',
        detail: `${skill} is part of the ${group.label} engineering toolkit.`,
        index,
      })),
    }))
  }
  return [
    {
      id: 'resume-pdf',
      name: 'Avraham Stato — Resume.pdf',
      type: 'pdf',
      typeLabel: 'PDF document',
      modified: '2026',
      status: '400 KB',
      detail: 'Browser-ready version of the current professional resume.',
      url: profile.resumeUrl,
    },
    {
      id: 'resume-docx',
      name: 'Avraham Stato — Resume.docx',
      type: 'document',
      typeLabel: 'Word document',
      modified: '2026',
      status: '11 KB',
      detail: 'Editable Microsoft Word version of the current professional resume.',
      url: profile.resumeDocxUrl,
      download: true,
    },
    {
      id: 'profile-summary',
      name: 'Professional Profile.txt',
      type: 'text',
      typeLabel: 'Text document',
      modified: '2026',
      status: '1 KB',
      detail: profile.experienceNote,
    },
  ]
}

function FileGlyph({ item }) {
  if (item.thumbnail) return <img src={item.thumbnail} alt="" />
  if (item.type === 'folder') return <Folder aria-hidden="true" />
  if (item.type === 'project') return <FolderKanban aria-hidden="true" />
  if (item.type === 'skill') return <FileCode2 aria-hidden="true" />
  return <FileText aria-hidden="true" />
}

export default function FileExplorerApp({ appId }) {
  const { launchProject, openApp } = useOSStore()
  const [currentFolder, setCurrentFolder] = useState(null)
  const [query, setQuery] = useState('')
  const [view, setView] = useState('grid')
  const [selectedId, setSelectedId] = useState(null)
  const meta = folderMeta[appId] || folderMeta.projects
  const RootIcon = meta.icon
  const rootItems = useMemo(() => getRootItems(appId), [appId])
  const items = currentFolder?.children || rootItems
  const visibleItems = items.filter((item) => `${item.name} ${item.typeLabel} ${item.detail}`.toLowerCase().includes(query.trim().toLowerCase()))
  const selectedItem = items.find((item) => item.id === selectedId)

  const openItem = (item) => {
    if (item.children) {
      setCurrentFolder(item)
      setSelectedId(null)
      setQuery('')
      return
    }
    if (item.project) {
      launchProject(item.project.id)
      return
    }
    if (item.url) window.open(item.url, '_blank', 'noopener,noreferrer')
  }

  const goToRoot = () => {
    setCurrentFolder(null)
    setSelectedId(null)
    setQuery('')
  }

  return (
    <div className="file-explorer" data-view={view}>
      <header className="portfolio-browser-toolbar">
        <div className="portfolio-browser-title">
          <span><RootIcon aria-hidden="true" /></span>
          <div><small>STATO / LIBRARY</small><strong>{currentFolder?.name || meta.label}</strong></div>
        </div>
        <nav className="portfolio-breadcrumb" aria-label="Current collection">
          <button type="button" onClick={goToRoot}>Portfolio</button>
          <span>/</span><strong>{meta.label}</strong>
          {currentFolder ? <><span>/</span><em>{currentFolder.name}</em></> : null}
        </nav>
        <label className="file-search">
          <Search aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${currentFolder?.name || meta.label}`} aria-label={`Search ${meta.label}`} />
        </label>
        <div className="portfolio-view-toggle" aria-label="Library view">
          <button type="button" className={view === 'grid' ? 'is-active' : ''} onClick={() => setView('grid')} aria-label="Grid view"><Grid2X2 /></button>
          <button type="button" className={view === 'list' ? 'is-active' : ''} onClick={() => setView('list')} aria-label="List view"><List /></button>
        </div>
      </header>

      <div className="file-explorer-body">
        <aside className="file-sidebar" aria-label="Explorer locations">
          <span>Workspace</span>
          <nav>
            {sidebarFolders.map((folderId) => {
              const folder = folderMeta[folderId]
              const Icon = folder.icon
              return (
                <button type="button" key={folderId} className={appId === folderId ? 'is-active' : ''} onClick={() => openApp(folderId)}>
                  <span><Icon aria-hidden="true" /></span>
                  <span><strong>{folder.label}</strong><small>{folder.detail}</small></span>
                </button>
              )
            })}
          </nav>
          <button type="button" className="file-sidebar-profile" onClick={() => openApp('about')}><Home /><span><strong>Profile home</strong><small>About Avraham Stato</small></span></button>
          <div className="portfolio-availability"><i /><span><strong>Available for selected work</strong><small>Software · AI · Automation</small></span></div>
        </aside>

        <main className="file-surface">
          <header className="portfolio-library-heading">
            <div>
              <span className="app-kicker">CURATED WORK / {String(visibleItems.length).padStart(2, '0')}</span>
              <h2>{currentFolder?.name || meta.label}</h2>
              <p>{currentFolder?.detail || meta.detail}</p>
            </div>
            <dl><div><dt>Collection</dt><dd>{meta.label}</dd></div><div><dt>Updated</dt><dd>2026</dd></div></dl>
          </header>

          <section className={`portfolio-items portfolio-items-${view}`} aria-label={`${meta.label} records`}>
            {visibleItems.map((item, index) => {
              const canOpen = Boolean(item.children || item.project || item.url)
              return (
                <article
                  key={item.id}
                  className={`portfolio-item${selectedId === item.id ? ' is-selected' : ''}`}
                  style={{ '--item-accent': item.project?.accent || 'var(--window-accent)' }}
                  onPointerEnter={() => item.project && preloadProjectLaunchMedia(item.project)}
                >
                  <button
                    type="button"
                    className="portfolio-item-select"
                    onClick={() => setSelectedId(item.id)}
                    onDoubleClick={() => openItem(item)}
                    onFocus={() => item.project && preloadProjectLaunchMedia(item.project)}
                    aria-label={`Select ${item.name}`}
                  >
                    <span className={`portfolio-item-media is-${item.type}`}>
                      <FileGlyph item={item} />
                      <span className="portfolio-item-index">{String(index + 1).padStart(2, '0')}</span>
                      {item.download ? <Download className="file-download-mark" /> : null}
                    </span>
                    <span className="portfolio-item-copy">
                      <span className="portfolio-item-meta"><small>{item.typeLabel}</small><small>{item.modified}</small></span>
                      <strong>{item.name}</strong>
                      <span className="portfolio-item-description">{item.detail}</span>
                      {item.project ? <span className="portfolio-item-stack">{item.project.stack.slice(0, 3).map((technology) => <small key={technology}>{technology}</small>)}</span> : null}
                    </span>
                  </button>
                  <footer>
                    <span><CircleDot />{item.status}</span>
                    {canOpen ? <button type="button" onClick={() => openItem(item)}>Open <ArrowUpRight /></button> : <span>Capability record</span>}
                  </footer>
                </article>
              )
            })}
            {visibleItems.length === 0 ? <div className="file-empty"><Search /><strong>No files found</strong><span>Try a different search term.</span></div> : null}
          </section>
        </main>
      </div>

      <footer className="portfolio-browser-status">
        <span><Layers3 />{visibleItems.length} records</span>
        <span>{selectedItem ? `Selected: ${selectedItem.name}` : 'Select a record or use Open to view the full case study'}</span>
      </footer>
    </div>
  )
}
