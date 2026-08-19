import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { bootTiming } from '../motion/bootAnimations'
import OSBackdrop from './OSBackdrop'

const bootLines = [
  ['CORE', 'READY'],
  ['PROJECTS', 'READY'],
  ['AI ENGINE', 'READY'],
  ['INTERFACE', 'READY'],
]

export default function BootScreen({ onComplete }) {
  const rootRef = useRef(null)
  const finishedRef = useRef(false)

  useGSAP(() => {
    const root = rootRef.current
    if (!root) return
    const finish = () => {
      if (finishedRef.current) return
      finishedRef.current = true
      onComplete()
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      gsap.set(root, { autoAlpha: 1 })
      const timeout = window.setTimeout(finish, 240)
      return () => window.clearTimeout(timeout)
    }

    const safetyTimeout = window.setTimeout(finish, 2500)
    const timeline = gsap.timeline({ onComplete: finish })
    timeline
      .from('[data-boot-mark]', { opacity: 0, y: 14, duration: 0.38, ease: 'power3.out' })
      .from('[data-boot-subtitle]', { opacity: 0, duration: 0.25 }, '-=0.12')
      .from('[data-boot-line]', {
        opacity: 0,
        x: -8,
        duration: bootTiming.lineDuration,
        stagger: bootTiming.lineStagger,
        ease: 'power2.out',
      })
      .to('[data-boot-progress]', { scaleX: 1, duration: 0.54, ease: 'power2.inOut' }, '-=0.35')
      .from('[data-boot-os]', { opacity: 0, letterSpacing: '0.8em', duration: 0.38, ease: 'power2.out' })
      .to(root, { autoAlpha: 0, duration: bootTiming.exitDuration, ease: 'power3.inOut' }, `+=${bootTiming.hold}`)
    return () => {
      window.clearTimeout(safetyTimeout)
      timeline.kill()
    }
  }, { scope: rootRef, dependencies: [onComplete] })

  return (
    <div ref={rootRef} className="boot-screen" role="status" aria-live="polite">
      <OSBackdrop variant="boot" />
      <div className="boot-noise" aria-hidden="true" />
      <div className="boot-panel">
        <div className="boot-mark" data-boot-mark>STATO<span>·</span></div>
        <p className="boot-subtitle" data-boot-subtitle>System initialization</p>
        <div className="boot-readout">
          {bootLines.map(([label, state]) => (
            <div className="boot-line" data-boot-line key={label}>
              <span>{label}</span><i aria-hidden="true" /><strong>{state}</strong>
            </div>
          ))}
        </div>
        <div className="boot-progress"><span data-boot-progress /></div>
        <p className="boot-os" data-boot-os>STATO OS <small>1.0</small></p>
      </div>
    </div>
  )
}
