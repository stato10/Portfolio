import { ArrowRight, FileText, Search } from 'lucide-react'
import { profile } from '../data/experience'
import { useOSStore } from '../store/useOSStore'
import portrait from '../assets/stato-portrait.webp'
import CinematicShowcase from './CinematicShowcase'

export default function WelcomeApp() {
  const { openApp, closeWindow, openSpotlight } = useOSStore()
  const explore = (id) => { closeWindow('welcome', { syncRoute: false }); openApp(id) }
  return (
    <div className="mac-welcome">
      <aside className="mac-welcome-profile">
        <img src={portrait} alt="Avraham Stato" />
        <strong>{profile.name}</strong>
        <p>{profile.role.split(' / ')[0]}<br />{profile.role.split(' / ')[1]}</p>
        <a href={`mailto:${profile.contact.email}`}>Let’s talk <ArrowRight size={14} /></a>
      </aside>
      <section className="mac-welcome-main">
        <h1>Make yourself<br />at home.</h1>
        <p>A desktop full of things I’ve built.<br />Open a folder, explore a project, or get to know the person behind the work.</p>
        <div className="mac-welcome-actions">
          <button type="button" className="mac-primary" onClick={() => explore('projects')}>Explore projects <ArrowRight size={16} /></button>
          <button type="button" onClick={() => explore('resume')}><FileText size={16} /> My resume</button>
        </div>
        <CinematicShowcase compact />
        <button type="button" className="mac-search-hint" onClick={openSpotlight}><Search size={14} /> Find anything <kbd>Ctrl / ⌘ K</kbd></button>
      </section>
    </div>
  )
}
