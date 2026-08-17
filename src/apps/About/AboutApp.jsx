import { ArrowUpRight, Code2, Orbit, Workflow } from 'lucide-react'
import portrait from '../../assets/about_img.png'
import { useOSStore } from '../../store/useOSStore'

export default function AboutApp() {
  const { openApp } = useOSStore()
  return (
    <div className="about-app">
      <div className="about-portrait">
        <img src={portrait} alt="Avraham Stato" />
        <span>AVRAHAM STATO — 2026</span>
      </div>
      <div className="about-copy">
        <span className="app-kicker">PROFILE / 001</span>
        <h2>Engineering with<br /><em>intent.</em></h2>
        <p className="about-lead">I’m Avraham, a software engineer focused on full-stack products, AI systems and the details that make technology feel natural.</p>
        <div className="about-disciplines">
          <div><Code2 /><span><b>Product engineering</b>Scalable interfaces and services</span></div>
          <div><Orbit /><span><b>Applied AI</b>Useful intelligent experiences</span></div>
          <div><Workflow /><span><b>Systems thinking</b>Automation and resilient workflows</span></div>
        </div>
        <div className="about-actions">
          <button onClick={() => openApp('projects')}>Explore projects <ArrowUpRight size={16} /></button>
          <button onClick={() => openApp('contact')}>Start a conversation</button>
        </div>
      </div>
    </div>
  )
}
