import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { projectById } from '../../data/projects'
import { useOSStore } from '../../store/useOSStore'

export default function ProjectLaunchTransition() {
  const reduceMotion = useReducedMotion()
  const videoRef = useRef(null)
  const visualRef = useRef(null)
  const completedRef = useRef(false)
  const activeRequestRef = useRef(null)
  const [failedRequestId, setFailedRequestId] = useState(null)
  const [failedPosterRequestId, setFailedPosterRequestId] = useState(null)
  const [status, setStatus] = useState('Preparing project workspace')
  const [handoffPending, setHandoffPending] = useState(null)
  const [handoffFrame, setHandoffFrame] = useState(null)
  const { launch, completeProjectLaunch, clearProjectLaunch } = useOSStore()
  const project = launch ? projectById.get(launch.projectId) : null
  const launchMedia = launch?.media
  const cinematic = launchMedia?.mode === 'cinematic'
    && Boolean(launchMedia.video)
    && failedRequestId !== launch?.requestId
    && !reduceMotion
  const pendingForLaunch = handoffPending?.requestId === launch?.requestId
  const handoffForLaunch = handoffFrame?.requestId === launch?.requestId ? handoffFrame : null

  useEffect(() => {
    if (!launch || !project) return undefined
    if (activeRequestRef.current !== launch.requestId) {
      activeRequestRef.current = launch.requestId
      completedRef.current = false
    }
    if (pendingForLaunch) return undefined

    const finish = () => {
      if (completedRef.current) return
      completedRef.current = true
      const handoff = launchMedia.handoff
      if (cinematic && handoff?.target && visualRef.current) {
        videoRef.current?.pause()
        const from = visualRef.current.getBoundingClientRect()
        setHandoffPending({
          requestId: launch.requestId,
          projectId: project.id,
          target: handoff.target,
          duration: handoff.duration ?? 520,
          from: { top: from.top, left: from.left, width: from.width, height: from.height },
        })
        completeProjectLaunch(project.id, { preserveLaunch: true })
        return
      }
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
  }, [cinematic, completeProjectLaunch, failedRequestId, launch, launchMedia, pendingForLaunch, project, reduceMotion])

  useEffect(() => {
    if (!handoffPending) return undefined
    let searchFrame
    let clearTimer
    const searchStartedAt = window.performance.now()
    const resolveTarget = () => {
      const target = document.querySelector(`[data-handoff-target="${handoffPending.target}"][data-project-id="${handoffPending.projectId}"]`)
      if (!target) {
        if (window.performance.now() - searchStartedAt < 320) {
          searchFrame = window.requestAnimationFrame(resolveTarget)
        } else {
          clearProjectLaunch()
        }
        return
      }
      const to = target.getBoundingClientRect()
      setHandoffFrame({
        ...handoffPending,
        to: { top: to.top, left: to.left, width: to.width, height: to.height },
      })
      clearTimer = window.setTimeout(clearProjectLaunch, handoffPending.duration + 40)
    }
    searchFrame = window.requestAnimationFrame(resolveTarget)
    return () => {
      window.cancelAnimationFrame(searchFrame)
      window.clearTimeout(clearTimer)
    }
  }, [clearProjectLaunch, handoffPending])

  const handoffMotion = handoffForLaunch ? {
    top: handoffForLaunch.to.top,
    left: handoffForLaunch.to.left,
    width: handoffForLaunch.to.width,
    height: handoffForLaunch.to.height,
    borderRadius: 0,
    opacity: [1, 1, 0],
    scale: 1,
    clipPath: 'inset(0% 0 0%)',
  } : { scale: 1, clipPath: 'inset(0% 0 0%)', opacity: 1 }
  const poster = failedPosterRequestId === launch?.requestId ? launchMedia?.fallbackPoster : launchMedia?.poster

  return (
    <AnimatePresence>
      {launch && project && (
        <motion.div
          className={`project-launch${pendingForLaunch ? ' is-handoff' : ''}`}
          style={{ '--project-accent': launch.accent }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.18 }}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          data-launch-handoff-target={launchMedia.handoff?.target || undefined}
          data-launch-handoff-focal-point={launchMedia.handoff?.focalPoint || undefined}
        >
          <motion.div
            ref={visualRef}
            className={`launch-visual${handoffForLaunch ? ' is-handoff' : ''}`}
            style={handoffForLaunch ? {
              background: launchMedia.handoff?.background,
              top: handoffForLaunch.from.top,
              left: handoffForLaunch.from.left,
              width: handoffForLaunch.from.width,
              height: handoffForLaunch.from.height,
            } : { background: launchMedia.handoff?.background }}
            initial={{ scale: 1.05, clipPath: 'inset(48% 0 48%)' }}
            animate={handoffMotion}
            transition={{ duration: handoffForLaunch ? handoffForLaunch.duration / 1000 : reduceMotion ? 0.01 : 0.55, ease: [0.16, 1, 0.3, 1], times: handoffForLaunch ? [0, 0.82, 1] : undefined }}
          >
            {cinematic ? (
              <video ref={videoRef} src={launchMedia.video} poster={poster || undefined} muted playsInline preload="metadata" aria-hidden="true" tabIndex={-1} style={{ objectPosition: launchMedia.handoff?.focalPoint }} />
            ) : poster ? <img src={poster} alt="" onError={() => setFailedPosterRequestId(launch.requestId)} style={{ objectPosition: launchMedia.handoff?.focalPoint }} /> : <span className="launch-placeholder" />}
            <div className="launch-scrim" />
          </motion.div>
          <motion.div className="launch-copy" animate={{ opacity: pendingForLaunch ? 0 : 1 }} transition={{ duration: reduceMotion ? 0.01 : 0.16 }}><span>{status}</span><strong>{project.title}</strong><i><b /></i></motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
