import { X } from 'lucide-react'
import { appById } from '../data/apps'
import { useOSStore } from '../store/useOSStore'
import AppIcon from './AppIcon'

export default function TaskSwitcher() {
  const { activeWindowId, closeTaskView, closeWindow, focusWindow, taskViewOpen, windows } = useOSStore()
  if (!taskViewOpen) return null

  const tasks = [...windows].sort((a, b) => b.zIndex - a.zIndex)
  const focus = (id) => { focusWindow(id); closeTaskView() }

  return (
    <div className="task-view-backdrop" role="dialog" aria-modal="true" aria-label="Open applications" onMouseDown={(event) => event.target === event.currentTarget && closeTaskView()}>
      <section className="task-view">
        <header><span>TASK VIEW</span><strong>{tasks.length} open applications</strong><button type="button" onClick={closeTaskView} aria-label="Close task view"><X /></button></header>
        <div>
          {tasks.map((task) => {
            const app = appById.get(task.appId) || { icon: 'layers', accent: task.accent }
            return (
              <article key={task.id} className={task.id === activeWindowId ? 'is-active' : ''}>
                <button type="button" className="task-view-focus" onClick={() => focus(task.id)}>
                  <span style={{ '--app-accent': app.accent }}><AppIcon app={app} /></span>
                  <strong>{task.title}</strong>
                  <small>{task.minimized ? 'Minimized' : task.id === activeWindowId ? 'Active now' : 'Running'}</small>
                </button>
                <button type="button" className="task-view-close" onClick={() => closeWindow(task.id)} aria-label={`Close ${task.title}`}><X /></button>
              </article>
            )
          })}
          {!tasks.length && <p>No open applications.</p>}
        </div>
      </section>
    </div>
  )
}
