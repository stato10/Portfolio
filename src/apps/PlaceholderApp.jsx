import { ArrowUpRight, Cpu, FileText, Mail, Sparkles } from 'lucide-react'
import { experiencePath, profile } from '../data/experience'
import { skillGroups } from '../data/skills'

const content = {
  'ai-lab': {
    code: 'LAB / APPLIED INTELLIGENCE',
    title: 'AI Lab',
    summary: 'Experiments in agentic products, natural interfaces and systems that turn model capability into practical outcomes.',
    icon: Sparkles,
    items: ['Conversational systems', 'Realtime AI experiences', 'Evaluation & automation'],
  },
  systems: {
    code: 'SYS / OPERATOR VIEW',
    title: 'Systems',
    summary: 'A working set of infrastructure, platform and automation practices used to ship reliable products.',
    icon: Cpu,
    items: ['Cloud & containers', 'CI/CD pipelines', 'Observability & operations'],
  },
  resume: {
    code: 'DOC / PROFESSIONAL RECORD',
    title: 'Resume',
    summary: profile.experienceNote,
    icon: FileText,
    items: experiencePath.map((item) => item.label),
  },
  contact: {
    code: 'COMMS / DIRECT CHANNEL',
    title: 'Let’s build something useful.',
    summary: `Available for selected product engineering, AI systems and automation engagements from ${profile.location}.`,
    icon: Mail,
    items: [profile.email, 'github.com/stato10', `${profile.location} · GMT+3`],
  },
}

export default function PlaceholderApp({ appId }) {
  const item = content[appId] || content.systems
  const displayItems = appId === 'systems' ? skillGroups.find((group) => group.id === 'systems')?.skills || item.items : item.items
  const Icon = item.icon
  const isContact = appId === 'contact'

  return (
    <div className="placeholder-app">
      <div className="placeholder-orbit" aria-hidden="true"><Icon /></div>
      <span className="app-kicker">{item.code}</span>
      <h2>{item.title}</h2>
      <p>{item.summary}</p>
      <ul>{displayItems.map((value, index) => <li key={value}><span>0{index + 1}</span>{value}</li>)}</ul>
      {isContact && <a href="mailto:contact@stato.dev">Open email channel <ArrowUpRight size={16} /></a>}
      {!isContact && <span className="phase-badge">Phase 1 · Foundation</span>}
    </div>
  )
}
