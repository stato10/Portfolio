import { ArrowUpRight, BriefcaseBusiness, GitFork, Link, Mail, Phone, Send, Sparkles, Workflow } from 'lucide-react'
import { experiencePath, profile } from '../../data/experience'
import { useOSStore } from '../../store/useOSStore'

const contactMethods = [
  { label: 'Email', value: profile.contact.email, href: `mailto:${profile.contact.email}`, icon: Mail },
  { label: 'Phone', value: profile.contact.phone, href: `tel:${profile.contact.phone.replace(/-/g, '')}`, icon: Phone },
  { label: 'LinkedIn', value: profile.contact.linkedinLabel, href: profile.contact.linkedin, icon: Link },
  { label: 'GitHub', value: profile.contact.githubLabel, href: profile.contact.github, icon: GitFork },
]

const fitAreas = [
  { icon: BriefcaseBusiness, title: experiencePath[2].label, copy: experiencePath[2].summary },
  { icon: Sparkles, title: experiencePath[3].label, copy: experiencePath[3].summary },
  { icon: Workflow, title: experiencePath[1].label, copy: experiencePath[1].summary },
]

export default function ContactApp() {
  const { openApp } = useOSStore()

  return (
    <div className="contact-app">
      <header className="contact-hero">
        <div><span>CONTACT / OPEN CHANNEL</span><h2>Build something<br /><em>useful.</em></h2><p>For software engineering, automation and applied AI opportunities.</p></div>
        <aside><i /><span><small>CURRENT STATUS</small><strong>Available for selected work</strong><p>Projects and engineering roles with a clear operational or product outcome.</p></span></aside>
      </header>

      <main className="contact-workspace">
        <section className="contact-fit">
          <header><span>BEST FIT</span><strong>Where I can contribute</strong></header>
          <div>
            {fitAreas.map(({ icon: Icon, title, copy }, index) => (
              <article key={title}><span><Icon aria-hidden="true" /></span><div><small>0{index + 1}</small><strong>{title}</strong><p>{copy}</p></div></article>
            ))}
          </div>
          <button type="button" onClick={() => openApp('projects')}>Review selected work <ArrowUpRight /></button>
        </section>

        <section className="contact-channel-panel">
          <header><span>DIRECT CHANNELS</span><strong>Start a conversation</strong></header>
          <div className="contact-methods">
            {contactMethods.map(({ label, value, href, icon: Icon }) => (
              <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>
                <Icon /><span><small>{label}</small><strong>{value}</strong></span><ArrowUpRight />
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer><i /><span>Available for selected projects and engineering roles</span><a href={`mailto:${profile.contact.email}`}>Start conversation <Send /></a></footer>
    </div>
  )
}
