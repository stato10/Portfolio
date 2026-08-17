const skills = [
  'Frontend     React · TypeScript · Next.js · Tailwind CSS',
  'Backend      Node.js · Java · Spring Boot · PostgreSQL',
  'AI / Cloud   OpenAI · Python · GCP · AWS · Docker',
  'Automation   PowerShell · Bash · Make.com · n8n',
]

export const commandNames = ['help', 'whoami', 'projects', 'skills', 'experience', 'contact', 'clear']

export const commands = {
  help: () => [
    'Available commands:',
    '  help        show this command index',
    '  whoami      identify the current operator',
    '  projects    open selected work',
    '  skills      inspect the technical stack',
    '  experience  view professional snapshot',
    '  contact     print contact channels',
    '  clear       clear the terminal',
  ],
  whoami: () => [
    'Avraham Stato',
    'Software Engineer / AI Systems Builder',
    'Building useful systems where product craft meets applied intelligence.',
  ],
  projects: ({ openApp }) => {
    openApp('projects')
    return ['Opening Projects…']
  },
  skills: () => skills,
  experience: () => [
    '03+ years building full-stack products and automation systems.',
    '20+ projects shipped across AI, commerce, media and internal tools.',
    'Current focus: agentic interfaces, resilient systems and thoughtful UX.',
  ],
  contact: () => [
    'Email     contact@stato.dev',
    'GitHub    github.com/stato10',
    'Location  Tel Aviv, Israel',
  ],
}
