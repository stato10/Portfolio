import { useEffect, useState } from 'react'
import { ArrowRight, ChevronLeft, X } from 'lucide-react'
import { tourSteps } from '../data/tourSteps'
import { useOSStore } from '../store/useOSStore'
import GuideCharacter from './GuideCharacter'

const storageKey = 'stato-os-tour-v2'

const readSession = () => {
  try {
    const value = window.sessionStorage.getItem(storageKey)
    if (!value) return null
    if (value === 'done') return { status: 'done', step: 0 }
    return JSON.parse(value)
  } catch {
    return null
  }
}

const writeSession = (value) => {
  try { window.sessionStorage.setItem(storageKey, value === 'done' ? value : JSON.stringify(value)) } catch { /* Session persistence is optional. */ }
}

export default function OnboardingGuide({ ready, startCollapsed = false }) {
  const [status, setStatus] = useState('hidden')
  const [step, setStep] = useState(0)
  const { launchProject, openApp } = useOSStore()

  useEffect(() => {
    if (!ready) return undefined
    const saved = readSession()
    if (saved?.status === 'done') return undefined
    if (saved) {
      setStep(Math.min(Math.max(saved.step || 0, 0), tourSteps.length - 1))
      setStatus(saved.status === 'collapsed' ? 'collapsed' : 'open')
      return undefined
    }
    const timer = window.setTimeout(() => setStatus(startCollapsed ? 'collapsed' : 'open'), 650)
    return () => window.clearTimeout(timer)
  }, [ready, startCollapsed])

  useEffect(() => {
    if (status === 'open' || status === 'collapsed') writeSession({ status, step })
  }, [status, step])

  const finish = () => {
    writeSession('done')
    setStatus('done')
  }

  const runAction = () => {
    const action = tourSteps[step].action
    if (action.type === 'project') launchProject(action.id)
    else openApp(action.id)
    setStatus('collapsed')
  }

  const next = () => {
    if (step === tourSteps.length - 1) {
      finish()
      return
    }
    setStep((current) => current + 1)
  }

  if (status === 'hidden' || status === 'done') return null
  const content = tourSteps[step]
  const collapsed = status === 'collapsed'

  return (
    <aside className={`onboarding-guide${collapsed ? ' is-collapsed' : ''}`} role="region" aria-label="STATO OS interactive guide" aria-live="polite">
      {!collapsed && (
        <section className="guide-bubble" role="dialog" aria-label={`Guide step ${step + 1} of ${tourSteps.length}`}>
          <button type="button" className="guide-collapse" onClick={() => setStatus('collapsed')} aria-label="Collapse portfolio guide"><X /></button>
          <span className="guide-step-icon" aria-hidden="true">{String(step + 1).padStart(2, '0')}</span>
          <p className="guide-eyebrow">{content.eyebrow}</p>
          <h2>{content.title}</h2>
          <p className="guide-copy">{content.copy}</p>
          <button type="button" className="guide-action" onClick={runAction}>{content.cta}<ArrowRight /></button>
          <footer className="guide-controls">
            <button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}><ChevronLeft /> Previous</button>
            <div className="guide-progress" aria-label={`Step ${step + 1} of ${tourSteps.length}`}>
              {tourSteps.map((item, index) => <button type="button" key={item.eyebrow} className={index === step ? 'is-active' : ''} onClick={() => setStep(index)} aria-label={`Go to step ${index + 1}`} />)}
            </div>
            <button type="button" onClick={next}>{step === tourSteps.length - 1 ? 'Done' : 'Next'}{step < tourSteps.length - 1 && <ArrowRight />}</button>
          </footer>
          <button type="button" className="guide-skip" onClick={finish}>Skip guide</button>
        </section>
      )}
      <GuideCharacter collapsed={collapsed} onClick={() => setStatus(collapsed ? 'open' : 'collapsed')} progress={`${step + 1}/${tourSteps.length}`} />
    </aside>
  )
}
