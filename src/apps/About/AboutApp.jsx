import { useState } from 'react'
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  Mail,
  Orbit,
  Workflow,
} from 'lucide-react'
import portrait from '../../assets/stato-portrait.webp'
import { useOSStore } from '../../store/useOSStore'
import { experiencePath, profile, workExperience } from '../../data/experience'

const tabs = ['Overview', 'Experience', 'Practice', 'Facts']
const practiceIcons = [BriefcaseBusiness, Workflow, Code2, Orbit]

function Overview() {
  return (
    <div className="about-overview">
      <span className="app-kicker">PROFILE / 001</span>
      <h2>Engineering with<br /><em>intent.</em></h2>
      <p className="about-lead">{profile.experienceNote}</p>
      <div className="about-overview-grid">
        <article>
          <GraduationCap aria-hidden="true" />
          <span>Education</span>
          <strong>{profile.education.credential}</strong>
          <small>{profile.education.institution} · {profile.education.period}</small>
        </article>
        <article>
          <BriefcaseBusiness aria-hidden="true" />
          <span>Current role</span>
          <strong>{workExperience[0].role}</strong>
          <small>{workExperience[0].company} · {workExperience[0].period}</small>
        </article>
      </div>
    </div>
  )
}

function Experience() {
  return (
    <div className="about-section">
      <span className="app-kicker">CAREER / VERIFIED</span>
      <h2>Experience</h2>
      <div className="about-timeline">
        {workExperience.map((item, index) => (
          <article key={`${item.company}-${item.period}`}>
            <span className="about-timeline-index">0{index + 1}</span>
            <div>
              <p>{item.period}</p>
              <h3>{item.role}</h3>
              <strong>{item.company}</strong>
              <span>{item.summary}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function Practice() {
  return (
    <div className="about-section">
      <span className="app-kicker">PRACTICE / FOUR LAYERS</span>
      <h2>How I work</h2>
      <div className="about-practice-grid">
        {experiencePath.map((item, index) => {
          const Icon = practiceIcons[index]
          return (
            <article key={item.id}>
              <div><Icon aria-hidden="true" /><span>0{index + 1}</span></div>
              <h3>{item.label}</h3>
              <p>{item.summary}</p>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function Facts() {
  const facts = [
    ['Name', profile.name],
    ['Role', profile.role],
    ['Education', `${profile.education.credential}, ${profile.education.institution}`],
    ['Academic average', profile.education.academicAverage],
    ['Capstone', `${profile.education.capstone} · ${profile.education.capstoneGrade}`],
    ['Current position', `${workExperience[0].role}, ${workExperience[0].company}`],
  ]

  return (
    <div className="about-section">
      <span className="app-kicker">RECORD / CANONICAL</span>
      <h2>Profile facts</h2>
      <dl className="about-facts">
        {facts.map(([label, value]) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
    </div>
  )
}

export default function AboutApp() {
  const [activeTab, setActiveTab] = useState('Overview')
  const { openApp } = useOSStore()

  return (
    <div className="about-app">
      <aside className="about-rail">
        <div className="about-portrait">
          <img src={portrait} alt="Avraham Stato" />
          <span>{profile.name.toUpperCase()} — 2026</span>
        </div>
        <nav className="about-tabs" aria-label="About sections">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
              aria-current={activeTab === tab ? 'page' : undefined}
            >
              <span>0{index + 1}</span>{tab}
            </button>
          ))}
        </nav>
        <a className="about-email" href={`mailto:${profile.contact.email}`}>
          <Mail aria-hidden="true" />{profile.contact.email}
        </a>
      </aside>

      <main className="about-content">
        <div className="about-content-actions">
          <a href={profile.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight /></a>
          <a href={profile.contact.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight /></a>
          <a href={profile.resumeUrl} target="_blank" rel="noreferrer">CV <ArrowUpRight /></a>
        </div>

        {activeTab === 'Overview' && <Overview />}
        {activeTab === 'Experience' && <Experience />}
        {activeTab === 'Practice' && <Practice />}
        {activeTab === 'Facts' && <Facts />}

        <div className="about-actions">
          <button onClick={() => openApp('projects')}>Explore projects <ArrowUpRight size={16} /></button>
          <button onClick={() => openApp('contact')}>Start a conversation</button>
        </div>
      </main>
    </div>
  )
}
