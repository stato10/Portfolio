import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { projectById } from '../../data/projects'
import { useOSStore } from '../../store/useOSStore'

export default function ProjectLaunchTransition() {
  const reduceMotion = useReducedMotion()
  const videoRef = useRef(null)
  const completedRef = useRef(false)
  const activeRequestRef = useRef(null)
  const [failedRequestId, setFailedRequestId] = useState(null)
  const [status, setStatus] = useState('Preparing project workspace')
  const { launch, completeProjectLaunch } = useOSStore()
  const project = launch ? projectById.get(launch.projectId) : null
  const launchMedia = launch?.media
  const cinematic = launchMedia?.mode === 'cinematic'
    && Boolean(launchMedia.video)
    && failedRequestId !== launch?.requestId
    && !reduceMotion

  useEffect(() => {
    if (!launch || !project) return undefined
    if (activeRequestRef.current !== launch.requestId) {
      activeRequestRef.current = launch.requestId
      completedRef.current = false
    }

    const finish = () => {
      if (completedRef.current) return
      completedRef.current = true
      completeProjectLaunch(project.id)
    }

    if (reduceMotion) {
      setStatus('Opening project')
      const reducedMotionTimer = window.setTimeout(finish, 80)
      return () => window.clearTimeout(reducedMotionTimer)
    }

    if (!cinematic) {
      setStatus(failedRequestId === launch.requestId ? 'Video unavailable. Using standard launch.' : 'Preparing project workspace')
      const standardTimer = window.setTimeout(finish, launch.standardDuration)
      return () => window.clearTimeout(standardTimer)
    }

    const video = videoRef.current
    if (!video) {
      setFailedRequestId(launch.requestId)
      return undefined
    }

    const openAt = Number.isFinite(launchMedia.openAt) ? Math.max(0, launchMedia.openAt) : null
    const maxDuration = Number.isFinite(launchMedia.maxDuration) ? Math.max(250, launchMedia.maxDuration) : 4500
    const handleLoadedMetadata = () => setStatus('Cinematic launch ready')
    const handleTimeUpdate = () => {
      if (openAt !== null && video.currentTime >= openAt) finish()
    }
    const handleEnded = () => finish()
    const handleError = () => {
      if (!completedRef.current) setFailedRequestId(launch.requestId)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)
    if (video.error) {
      handleError()
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
        video.removeEventListener('timeupdate', handleTimeUpdate)
        video.removeEventListener('ended', handleEnded)
        video.removeEventListener('error', handleError)
      }
    }
    if (video.readyState >= 1) handleLoadedMetadata()
    const playPromise = video.play()
    playPromise?.catch(handleError)
    const safetyTimer = window.setTimeout(finish, maxDuration)

    return () => {
      window.clearTimeout(safetyTimer)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
    }
  }, [cinematic, completeProjectLaunch, failedRequestId, launch, launchMedia, project, reduceMotion])

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
          aria-atomic="true"
          data-handoff-target={launchMedia.handoff?.target || undefined}
          data-handoff-focal-point={launchMedia.handoff?.focalPoint || undefined}
        >
          <motion.div className="launch-visual" style={{ background: launchMedia.handoff?.background }} initial={{ scale: 1.05, clipPath: 'inset(48% 0 48%)' }} animate={{ scale: 1, clipPath: 'inset(0% 0 0%)' }} transition={{ duration: reduceMotion ? 0.01 : 0.55, ease: [0.16, 1, 0.3, 1] }}>
            {cinematic ? (
              <video ref={videoRef} src={launchMedia.video} poster={launchMedia.poster || undefined} muted playsInline preload="metadata" aria-hidden="true" tabIndex={-1} style={{ objectPosition: launchMedia.handoff?.focalPoint }} />
            ) : launchMedia.poster ? <img src={launchMedia.poster} alt="" style={{ objectPosition: launchMedia.handoff?.focalPoint }} /> : <span className="launch-placeholder" />}
            <div className="launch-scrim" />
          </motion.div>
          <div className="launch-copy"><span>{status}</span><strong>{project.title}</strong><i><b /></i></div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
