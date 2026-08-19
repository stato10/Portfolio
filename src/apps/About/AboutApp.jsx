import { ArrowUpRight, Code2, Orbit, Workflow } from 'lucide-react'
import portrait from '../../assets/stato-portrait.webp'
import { useOSStore } from '../../store/useOSStore'
import { experiencePath, profile } from '../../data/experience'

export default function AboutApp() {
  const { openApp } = useOSStore()
  return (
    <div className="about-app">
      <div className="about-portrait">
        <img src={portrait} alt="Avraham Stato" />
        <span>{profile.name.toUpperCase()} — 2026</span>
      </div>
      <div className="about-copy">
        <span className="app-kicker">PROFILE / 001</span>
        <h2>Engineering with<br /><em>intent.</em></h2>
        <p className="about-lead">{profile.experienceNote}</p>
        <div className="about-profile-meta">
          <div>
            <span>EDUCATION</span>
            <strong>{profile.education.credential}</strong>
            <small>{profile.education.institution} · Avg {profile.education.academicAverage} · Capstone {profile.education.capstoneGrade}</small>
          </div>
          <nav aria-label="Profile links">
            <a href={profile.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={profile.contact.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={profile.resumeUrl} target="_blank" rel="noreferrer">CV PDF</a>
            <a href={profile.resumeDocxUrl} download>CV DOCX</a>
          </nav>
        </div>
        <div className="about-disciplines">
          {experiencePath.slice(1).map((item, index) => {
            const Icon = [Workflow, Code2, Orbit][index]
            return <div key={item.id}><Icon /><span><b>{item.label}</b>{item.summary}</span></div>
          })}
        </div>
        <div className="about-actions">
          <button onClick={() => openApp('projects')}>Explore projects <ArrowUpRight size={16} /></button>
          <button onClick={() => openApp('contact')}>Start a conversation</button>
        </div>
      </div>
    </div>
  )
}
