import { ArrowUpRight, Cpu, FileText, Mail, Sparkles } from 'lucide-react'

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
    summary: 'Software engineer with 3+ years of experience and 20+ shipped projects across full-stack development, AI and automation.',
    icon: FileText,
    items: ['React · Node.js · Java', 'OpenAI · Python · Cloud', 'Tel Aviv, Israel'],
  },
  contact: {
    code: 'COMMS / DIRECT CHANNEL',
    title: 'Let’s build something useful.',
    summary: 'Available for selected product engineering, AI systems and creative technology engagements.',
    icon: Mail,
    items: ['contact@stato.dev', 'github.com/stato10', 'Tel Aviv · GMT+3'],
  },
}

export default function PlaceholderApp({ appId }) {
  const item = content[appId] || content.systems
  const Icon = item.icon
  const isContact = appId === 'contact'

  return (
    <div className="placeholder-app">
      <div className="placeholder-orbit" aria-hidden="true"><Icon /></div>
      <span className="app-kicker">{item.code}</span>
      <h2>{item.title}</h2>
      <p>{item.summary}</p>
      <ul>{item.items.map((value, index) => <li key={value}><span>0{index + 1}</span>{value}</li>)}</ul>
      {isContact && <a href="mailto:contact@stato.dev">Open email channel <ArrowUpRight size={16} /></a>}
      {!isContact && <span className="phase-badge">Phase 1 · Foundation</span>}
    </div>
  )
}
