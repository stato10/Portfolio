import { ArrowUpRight, Boxes, CircleCheck, Cpu, Database, Server, ShieldCheck, Workflow } from 'lucide-react'
import { useState } from 'react'
import { profile, workExperience } from '../../data/experience'
import { projectById } from '../../data/projects'
import { skillGroups } from '../../data/skills'
import { useOSStore } from '../../store/useOSStore'

const tabs = ['Overview', 'Capabilities', 'Production']
const systemsGroups = skillGroups.filter((group) => ['backend', 'systems', 'automation'].includes(group.id))
const productionProject = projectById.get('attendance-system')

const architecture = [
  { label: 'Interfaces', detail: 'React · Next.js', icon: Boxes },
  { label: 'Services', detail: 'Node · NestJS · FastAPI', icon: Server },
  { label: 'Automation', detail: 'Python · PowerShell · n8n', icon: Workflow },
  { label: 'Data', detail: 'PostgreSQL · MongoDB · Prisma', icon: Database },
  { label: 'Delivery', detail: 'Docker · GitHub Actions · Linux', icon: ShieldCheck },
]

export default function SystemsApp() {
  const [tab, setTab] = useState('Overview')
  const { launchProject } = useOSStore()

  return (
    <div className="systems-app">
      <header className="systems-header">
        <div><span><Cpu /></span><div><small>STATO OS / OPERATOR VIEW</small><h2>Systems Console</h2></div></div>
        <strong><i /> Operational</strong>
      </header>

      <nav className="systems-tabs" aria-label="Systems sections">
        {tabs.map((item) => <button type="button" key={item} className={tab === item ? 'is-active' : ''} onClick={() => setTab(item)}>{item}</button>)}
      </nav>

      <main className="systems-content">
        {tab === 'Overview' && (
          <>
            <section className="systems-intro">
              <div><span>SYSTEMS PRACTICE</span><h3>Software connected to real operations.</h3><p>{profile.experienceNote}</p></div>
              <dl><div><dt>Current role</dt><dd>{workExperience[0].role}</dd></div><div><dt>Environment</dt><dd>Production automation and nationwide exam operations</dd></div><div><dt>Period</dt><dd>{workExperience[0].period}</dd></div></dl>
            </section>

            <section className="systems-map" aria-label="Engineering system map">
              <header><span>CONNECTED LAYERS</span><strong>Product-to-production architecture</strong></header>
              <div>{architecture.map((node, index) => { const Icon = node.icon; return <article key={node.label}><b>{String(index + 1).padStart(2, '0')}</b><span><Icon /><strong>{node.label}</strong><small>{node.detail}</small></span>{index < architecture.length - 1 && <i />}</article> })}</div>
            </section>

            <section className="systems-proof">
              <div><span>PRODUCTION PROOF</span><h3>{productionProject.title}</h3><p>{productionProject.description}</p><button type="button" onClick={() => launchProject(productionProject.id)}>Open production case <ArrowUpRight /></button></div>
              <aside>{productionProject.capabilities.slice(0, 4).map((item) => <span key={item}><CircleCheck />{item}</span>)}</aside>
            </section>
          </>
        )}

        {tab === 'Capabilities' && (
          <section className="systems-capability-view">
            <header><span>ENGINEERING TOOLKIT</span><h3>Capabilities organized by operating layer.</h3><p>Each item below is sourced from the portfolio’s verified skills registry.</p></header>
            <div>{systemsGroups.map((group, index) => <article key={group.id}><span>{String(index + 1).padStart(2, '0')}</span><h4>{group.label}</h4><div>{group.skills.map((skill) => <small key={skill}>{skill}</small>)}</div></article>)}</div>
          </section>
        )}

        {tab === 'Production' && (
          <section className="systems-production-view">
            <div><span>DELIVERED SYSTEM</span><h3>{productionProject.title}</h3><p>{productionProject.problem}</p><p>{productionProject.solution}</p><button type="button" onClick={() => launchProject(productionProject.id)}>Inspect architecture <ArrowUpRight /></button></div>
            <aside><strong>Verified stack</strong>{productionProject.stack.map((item) => <span key={item}>{item}</span>)}<strong>My role</strong>{productionProject.role.map((item) => <span key={item}>{item}</span>)}</aside>
          </section>
        )}
      </main>
    </div>
  )
}
