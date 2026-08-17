import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { projectById } from '../../data/projects'
import { useOSStore } from '../../store/useOSStore'

export default function ProjectLaunchTransition() {
  const reduceMotion = useReducedMotion()
  const navigate = useNavigate()
  const { launch, clearProjectLaunch } = useOSStore()
  const project = launch ? projectById.get(launch.projectId) : null

  useEffect(() => {
    if (!launch || !project) return undefined
    const duration = reduceMotion ? 80 : launch.cinematic && launch.launchVideo ? Math.max(launch.duration, 2000) : launch.duration
    const timeout = window.setTimeout(() => {
      navigate(`/projects/${project.slug}`)
      clearProjectLaunch()
    }, duration)
    return () => window.clearTimeout(timeout)
  }, [clearProjectLaunch, launch, navigate, project, reduceMotion])

  return (
    <AnimatePresence>
      {launch && project && (
        <motion.div
          className="project-launch"
          style={{ '--project-accent': launch.accent }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.18 }}
          role="status"
          aria-live="polite"
        >
          <motion.div className="launch-visual" initial={{ scale: 1.05, clipPath: 'inset(48% 0 48%)' }} animate={{ scale: 1, clipPath: 'inset(0% 0 0%)' }} transition={{ duration: reduceMotion ? 0.01 : 0.55, ease: [0.16, 1, 0.3, 1] }}>
            {launch.cinematic && launch.launchVideo ? <video src={launch.launchVideo} poster={launch.poster} autoPlay muted playsInline preload="metadata" /> : launch.poster ? <img src={launch.poster} alt="" /> : <span className="launch-placeholder" />}
            <div className="launch-scrim" />
          </motion.div>
          <div className="launch-copy"><span>INITIALIZING PROJECT</span><strong>{project.title}</strong><i><b /></i></div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
