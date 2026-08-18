export const skillGroups = [
  { id: 'languages', label: 'Languages', skills: ['JavaScript', 'TypeScript', 'Python', 'Java'] },
  { id: 'build', label: 'Frontend', skills: ['React', 'Next.js', 'HTML / CSS', 'Tailwind CSS'] },
  { id: 'backend', label: 'Backend & Data', skills: ['Node.js', 'NestJS', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Prisma ORM', 'REST APIs'] },
  { id: 'intelligence', label: 'AI & Realtime', skills: ['OpenAI API', 'Gemini API', 'LiveKit', 'Cursor', 'Claude Code'] },
  { id: 'systems', label: 'Cloud & DevOps', skills: ['AWS', 'GCP', 'Docker', 'GitHub Actions', 'Linux'] },
  { id: 'automation', label: 'Automation', skills: ['Python', 'PowerShell', 'Bash', 'Make.com', 'n8n', 'Zapier'] },
]

export const skills = skillGroups.flatMap((group) => group.skills.map((name) => ({ name, group: group.label })))
