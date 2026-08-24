import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Pause, Play, RotateCcw, Volume2, VolumeX, X } from 'lucide-react'

const cinematicVideo = `${import.meta.env.BASE_URL}videos/stato-cinematic.mp4`
const cinematicPoster = `${import.meta.env.BASE_URL}images/os/stato-cinematic-poster.webp`

const formatTime = (value = 0) => {
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0
  const minutes = Math.floor(safeValue / 60)
  const seconds = Math.floor(safeValue % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}

export default function CinematicShowcase({ compact = false }) {
  const videoRef = useRef(null)
  const closeButtonRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [ended, setEnded] = useState(false)

  useEffect(() => {
    if (!open) return undefined
    const activeVideo = videoRef.current

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    const frame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
      activeVideo?.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    })

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('keydown', handleKeyDown)
      activeVideo?.pause()
    }
  }, [open])

  const openPlayer = () => {
    setMuted(true)
    setCurrentTime(0)
    setEnded(false)
    setOpen(true)
  }

  const closePlayer = () => {
    videoRef.current?.pause()
    setPlaying(false)
    setOpen(false)
  }

  const togglePlayback = async () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused || video.ended) {
      if (video.ended) video.currentTime = 0
      setEnded(false)
      try {
        await video.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  const toggleSound = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }

  const seek = (event) => {
    const video = videoRef.current
    if (!video) return
    const nextTime = Number(event.target.value)
    video.currentTime = nextTime
    setCurrentTime(nextTime)
    setEnded(false)
  }

  const player = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cinematic-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="STATO cinematic motion study"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.28 }}
          onMouseDown={(event) => event.target === event.currentTarget && closePlayer()}
        >
          <motion.section
            className="cinematic-player"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 24, scale: reduceMotion ? 1 : 0.975 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 14, scale: reduceMotion ? 1 : 0.985 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <header>
              <div><span>STATO MOTION / 01</span><strong>Identity-led cinematic study</strong></div>
              <button ref={closeButtonRef} type="button" onClick={closePlayer} aria-label="Close cinematic player"><X /></button>
            </header>

            <div className="cinematic-stage">
              <video
                ref={videoRef}
                src={cinematicVideo}
                poster={cinematicPoster}
                muted={muted}
                playsInline
                preload="auto"
                disablePictureInPicture
                onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
                onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
                onPlay={() => { setPlaying(true); setEnded(false) }}
                onPause={() => setPlaying(false)}
                onEnded={() => { setPlaying(false); setEnded(true) }}
              />
              <div className="cinematic-vignette" aria-hidden="true" />
              {ended && (
                <button className="cinematic-replay" type="button" onClick={togglePlayback}><RotateCcw /> Replay film</button>
              )}
            </div>

            <footer>
              <button type="button" onClick={togglePlayback} aria-label={playing ? 'Pause film' : 'Play film'}>{playing ? <Pause /> : <Play />}</button>
              <label className="cinematic-timeline">
                <span className="sr-only">Film progress</span>
                <input type="range" min="0" max={duration || 0} step="0.01" value={Math.min(currentTime, duration || 0)} onChange={seek} aria-label="Seek film" />
              </label>
              <time>{formatTime(currentTime)} / {formatTime(duration)}</time>
              <button type="button" onClick={toggleSound} aria-label={muted ? 'Turn film sound on' : 'Mute film sound'} aria-pressed={!muted}>{muted ? <VolumeX /> : <Volume2 />}</button>
            </footer>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <button className={`cinematic-card${compact ? ' is-compact' : ''}`} type="button" onClick={openPlayer} aria-haspopup="dialog">
        <span className="cinematic-card-media"><img src={cinematicPoster} alt="Cinematic AI motion study preview" /><i><Play /></i></span>
        <span className="cinematic-card-copy"><small>FEATURED MOTION STUDY</small><strong>Watch the cinematic reel</strong><em>00:05 · sound optional</em></span>
        <span className="cinematic-card-action"><Play /></span>
      </button>
      {typeof document !== 'undefined' && createPortal(player, document.body)}
    </>
  )
}
