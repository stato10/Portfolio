export const skillGroups = [
  { id: 'build', label: 'Build', skills: ['React', 'Next.js', 'TypeScript', 'Vite', 'Tailwind CSS'] },
  { id: 'backend', label: 'Backend', skills: ['Node.js', 'Express', 'Python', 'Java', 'Spring Boot'] },
  { id: 'data', label: 'Data', skills: ['PostgreSQL', 'MongoDB', 'SQL', 'Structured JSON'] },
  { id: 'intelligence', label: 'Intelligence', skills: ['OpenAI', 'Realtime AI', 'LLM integrations', 'LiveKit Agents'] },
  { id: 'systems', label: 'Systems', skills: ['Linux', 'Windows Server', 'Networking', 'Docker', 'CI/CD'] },
  { id: 'automation', label: 'Automation', skills: ['Python', 'PowerShell', 'Bash', 'Make.com', 'n8n'] },
]

export const skills = skillGroups.flatMap((group) => group.skills.map((name) => ({ name, group: group.label })))
