import { BriefcaseBusiness, Download, ExternalLink, FileText, GraduationCap, Layers3, Mail } from 'lucide-react'
import { experiencePath, profile, resumeHighlights, workExperience } from '../../data/experience'
import { projects } from '../../data/projects'

export default function ResumeApp() {
  return (
    <div className="resume-app">
      <header className="resume-toolbar">
        <div><FileText /><span><strong>Avraham-Stato-Resume</strong><small>Verified professional profile · Updated 2026</small></span></div>
        <nav aria-label="Resume actions">
          <a href={profile.resumeUrl} target="_blank" rel="noreferrer">Open PDF <ExternalLink /></a>
          <a className="is-primary" href={profile.resumeDocxUrl} download>Download <Download /></a>
        </nav>
      </header>

      <article className="resume-document">
        <header className="resume-hero">
          <span>RESUME / 2026</span>
          <h2>{profile.name}</h2>
          <p>{profile.title}</p>
          <div>
            <a href={`mailto:${profile.contact.email}`}><Mail /> {profile.contact.email}</a>
            <a href={profile.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn <ExternalLink /></a>
            <a href={profile.contact.github} target="_blank" rel="noreferrer">GitHub <ExternalLink /></a>
          </div>
        </header>

        <section className="resume-snapshot" aria-label="Resume snapshot">
          <article><BriefcaseBusiness aria-hidden="true" /><span><small>Current practice</small><strong>{workExperience[0].role}</strong><p>{workExperience[0].company} · {workExperience[0].period}</p></span></article>
          <article><GraduationCap aria-hidden="true" /><span><small>Academic record</small><strong>{profile.education.academicAverage} average</strong><p>{profile.education.credential} · Capstone {profile.education.capstoneGrade}</p></span></article>
          <article><Layers3 aria-hidden="true" /><span><small>Portfolio record</small><strong>{projects.length} selected systems</strong><p>Full-stack · Applied AI · Automation</p></span></article>
        </section>

        <section className="resume-section resume-profile">
          <p className="resume-section-label">01 / PROFILE</p>
          <div><h3>Software engineered around real operations.</h3><p>{profile.experienceNote}</p><p>{profile.statement}</p></div>
        </section>

        <section className="resume-section">
          <p className="resume-section-label">02 / EXPERIENCE</p>
          <div className="resume-timeline">
            {workExperience.map((item) => (
              <div key={`${item.company}-${item.period}`}>
                <time>{item.period}</time>
                <span><h3>{item.role}</h3><strong>{item.company}</strong><p>{item.summary}</p></span>
              </div>
            ))}
          </div>
        </section>

        <section className="resume-section">
          <p className="resume-section-label">03 / EDUCATION</p>
          <div className="resume-education">
            <span><h3>{profile.education.credential}</h3><strong>{profile.education.institution}</strong><p>{profile.education.period} · Academic average {profile.education.academicAverage} · Capstone {profile.education.capstoneGrade}</p></span>
            <b>{profile.education.grade}</b>
          </div>
        </section>

        <section className="resume-section">
          <p className="resume-section-label">04 / CAPABILITIES</p>
          <div className="resume-capabilities">
            {experiencePath.map((item) => <div key={item.id}><strong>{item.label}</strong><p>{item.summary}</p></div>)}
          </div>
        </section>

        <footer className="resume-proof">
          {resumeHighlights.map((highlight) => <span key={highlight}>{highlight}</span>)}
        </footer>
      </article>
    </div>
  )
}
