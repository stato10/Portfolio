import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Maximize2, Minus, X } from 'lucide-react'
import { reducedWindowMotion, windowMotion } from '../motion/windowAnimations'
import { useOSStore } from '../store/useOSStore'

const clamp = (value, min, max) => Math.min(Math.max(value, min), Math.max(min, max))

export default function AppWindow({ windowItem, children }) {
  const dragRef = useRef(null)
  const windowRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const { closeWindow, focusWindow, minimizeWindow, toggleMaximize, setWindowBounds, activeWindowId } = useOSStore()
  const active = activeWindowId === windowItem.id
  const maximizedBounds = { x: 8, y: 40, width: window.innerWidth - 16, height: window.innerHeight - 112 }
  const bounds = windowItem.maximized ? maximizedBounds : windowItem.bounds

  const startDrag = (event) => {
    if (windowItem.maximized || event.button !== 0 || event.target.closest('button')) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, originX: bounds.x, originY: bounds.y }
  }

  const drag = (event) => {
    const start = dragRef.current
    if (!start || start.pointerId !== event.pointerId) return
    const x = clamp(start.originX + event.clientX - start.startX, 8, window.innerWidth - bounds.width - 8)
    const y = clamp(start.originY + event.clientY - start.startY, 40, window.innerHeight - 96)
    dragRef.current.latestX = x
    dragRef.current.latestY = y
    if (windowRef.current) {
      windowRef.current.style.left = `${x}px`
      windowRef.current.style.top = `${y}px`
    }
  }

  const stopDrag = (event) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      setWindowBounds(windowItem.id, {
        x: dragRef.current.latestX ?? bounds.x,
        y: dragRef.current.latestY ?? bounds.y,
      })
      dragRef.current = null
    }
  }

  return (
    <motion.section
      ref={windowRef}
      {...(reduceMotion ? reducedWindowMotion : windowMotion)}
      className={`app-window${active ? ' is-active' : ''}${windowItem.maximized ? ' is-maximized' : ''}`}
      data-app={windowItem.appId}
      style={{ left: bounds.x, top: bounds.y, width: bounds.width, height: bounds.height, zIndex: windowItem.zIndex, '--window-accent': windowItem.accent || '#65dcff' }}
      onPointerDown={() => focusWindow(windowItem.id)}
      aria-label={`${windowItem.title} window`}
    >
      <header
        className="window-titlebar"
        onDoubleClick={() => toggleMaximize(windowItem.id)}
        onPointerDown={startDrag}
        onPointerMove={drag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
      >
        <div className="window-controls">
          <button className="window-close" onClick={() => closeWindow(windowItem.id)} aria-label={`Close ${windowItem.title}`}><X size={9} /></button>
          <button className="window-minimize" onClick={() => minimizeWindow(windowItem.id)} aria-label={`Minimize ${windowItem.title}`}><Minus size={9} /></button>
          <button className="window-maximize" onClick={() => toggleMaximize(windowItem.id)} aria-label={`${windowItem.maximized ? 'Restore' : 'Maximize'} ${windowItem.title}`}><Maximize2 size={8} /></button>
        </div>
        <span>{windowItem.title}</span>
        <span className="window-mode" aria-hidden="true" />
      </header>
      <div className="window-content">{children}</div>
    </motion.section>
  )
}
