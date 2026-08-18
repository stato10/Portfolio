import { experiencePath, profile, resumeHighlights } from '../../data/experience'
import { findProject, projects } from '../../data/projects'
import { skillGroups } from '../../data/skills'

const navigationTargets = new Map([
  ['projects', 'projects'],
  ['resume', 'resume'],
  ['about', 'about'],
  ['profile', 'about'],
  ['contact', 'contact'],
  ['terminal', 'terminal'],
  ['systems', 'systems'],
  ['ai-lab', 'ai-lab'],
])

export const commandNames = ['help', 'whoami', 'ls', 'projects', 'open', 'skills', 'experience', 'contact', 'clear']

export const commands = {
  help: () => ({ lines: [
    'Available commands',
    '  help               show this command index',
    '  whoami             identify the current operator',
    '  ls [projects]      list portfolio resources',
    '  projects           open Projects.app',
    '  open <target>      open an app or project',
    '  skills             inspect capability areas',
    '  experience         view the professional path',
    '  contact            print contact channels',
    '  clear              clear the terminal',
  ] }),
  whoami: () => ({ lines: [profile.name, profile.role, profile.statement] }),
  ls: ({ args }) => {
    if (!args.length) return { lines: ['projects/   profile.txt   skills.txt   experience.txt   contact.txt'] }
    if (args[0] === 'projects') return { lines: projects.map((project) => `${project.slug}/`) }
    return { lines: [`ls: ${args.join(' ')}: no such portfolio resource`], tone: 'error' }
  },
  projects: ({ openApp }) => {
    openApp('projects')
    return { lines: ['Opening Projects.app…'], tone: 'success' }
  },
  open: ({ args, openApp, launchProject }) => {
    if (!args.length) return { lines: ['Usage: open <project|app>', 'Example: open solar'], tone: 'error' }
    const target = args.join(' ').toLowerCase()
    const project = findProject(target)
    if (project) {
      launchProject(project.id)
      return { lines: [`Opening ${project.title}…`], tone: 'success' }
    }
    const appId = navigationTargets.get(target)
    if (appId) {
      openApp(appId)
      return { lines: [`Opening ${appId === 'about' ? 'About Stato' : appId}…`], tone: 'success' }
    }
    return { lines: [`open: ${target}: project or app not found`, 'Try “ls projects” to inspect available systems.'], tone: 'error' }
  },
  skills: () => ({ lines: skillGroups.flatMap((group) => [`${group.label.toUpperCase()}`, `  ${group.skills.join(' · ')}`]) }),
  experience: () => ({ lines: [profile.experienceNote, '', ...resumeHighlights, '', ...experiencePath.map((item, index) => `${String(index + 1).padStart(2, '0')}  ${item.label} — ${item.summary}`)] }),
  contact: ({ openApp }) => {
    openApp('contact')
    return {
      lines: [
        profile.contact.email ? `Email     ${profile.contact.email}` : 'Email     Available on request',
        `Phone     ${profile.contact.phone}`,
        `LinkedIn  ${profile.contact.linkedinLabel}`,
        `GitHub    ${profile.contact.githubLabel}`,
        ...(profile.location ? [`Location  ${profile.location}`] : []),
      ],
      tone: 'success',
    }
  },
  clear: () => ({ clear: true, lines: [] }),
}
