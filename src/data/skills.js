export const skillGroups = [
  { id: 'languages', label: 'Languages', skills: ['JavaScript', 'TypeScript', 'Python', 'Java'] },
  { id: 'build', label: 'Frontend', skills: ['React', 'Next.js', 'HTML / CSS', 'Tailwind CSS', 'Bootstrap', 'Framer Motion', 'Radix UI'] },
  { id: 'backend', label: 'Backend & Data', skills: ['Node.js / Express', 'NestJS', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Prisma ORM', 'REST APIs', 'JWT Auth'] },
  { id: 'intelligence', label: 'AI & Realtime', skills: ['OpenAI', 'Gemini', 'LiveKit', 'Cursor', 'Claude Code'] },
  { id: 'systems', label: 'Cloud & DevOps', skills: ['GCP', 'AWS', 'Docker', 'Docker Compose', 'GitHub Actions', 'npm Workspaces', 'Linux'] },
  { id: 'automation', label: 'Automation', skills: ['Python', 'PowerShell', 'Bash', 'Make', 'n8n'] },
]

export const skills = skillGroups.flatMap((group) => group.skills.map((name) => ({ name, group: group.label })))
