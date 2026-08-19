import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import MenuBar from './MenuBar'
import Dock from './Dock'
import DesktopIcons from './DesktopIcons'
import WindowManager from './WindowManager'
import Spotlight from './Spotlight'
import ProjectLaunchTransition from './transitions/ProjectLaunchTransition'
import OSBackdrop from './OSBackdrop'
import { profile } from '../data/experience'

export default function Desktop({ ready }) {
  const desktopRef = useRef(null)
  const pointerFrameRef = useRef(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => () => window.cancelAnimationFrame(pointerFrameRef.current), [])

  const updateLightfield = (event) => {
    if (reduceMotion || !desktopRef.current) return
    const x = event.clientX / window.innerWidth
    const y = event.clientY / window.innerHeight
    window.cancelAnimationFrame(pointerFrameRef.current)
    pointerFrameRef.current = window.requestAnimationFrame(() => {
      const desktop = desktopRef.current
      if (!desktop) return
      desktop.style.setProperty('--pointer-x', `${x * 100}%`)
      desktop.style.setProperty('--pointer-y', `${y * 100}%`)
      desktop.style.setProperty('--pointer-shift-x', `${(x - 0.5) * 18}px`)
      desktop.style.setProperty('--pointer-shift-y', `${(y - 0.5) * 12}px`)
      desktop.style.setProperty('--pointer-counter-x', `${(0.5 - x) * 12}px`)
      desktop.style.setProperty('--pointer-counter-y', `${(0.5 - y) * 8}px`)
    })
  }

  const resetLightfield = () => {
    const desktop = desktopRef.current
    if (!desktop) return
    desktop.style.setProperty('--pointer-x', '72%')
    desktop.style.setProperty('--pointer-y', '18%')
    desktop.style.setProperty('--pointer-shift-x', '0px')
    desktop.style.setProperty('--pointer-shift-y', '0px')
    desktop.style.setProperty('--pointer-counter-x', '0px')
    desktop.style.setProperty('--pointer-counter-y', '0px')
  }

  return (
    <motion.main
      ref={desktopRef}
      className="os-desktop"
      initial={false}
      animate={{ opacity: ready ? 1 : 0.65, scale: ready ? 1 : 1.012 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden={!ready}
      onPointerMove={updateLightfield}
      onPointerLeave={resetLightfield}
    >
      <OSBackdrop />
      <div className="desktop-atmosphere" aria-hidden="true"><i /><i /><i /></div>
      <MenuBar />
      <section className="desktop-identity" aria-label="STATO OS introduction">
        <p>STATO OS <span>/ 01</span></p>
        <h1>{profile.role.split(' / ')[0]}<br /><em>{profile.role.split(' / ')[1]}</em></h1>
        <div className="identity-status"><i /> Available for selected projects {profile.location && <span>{profile.location}</span>}</div>
      </section>
      <DesktopIcons />
      <WindowManager />
      <Spotlight />
      <ProjectLaunchTransition />
      <Dock />
      <p className="desktop-coordinate">STATO OS&nbsp;&nbsp; SESSION ACTIVE</p>
    </motion.main>
  )
}
