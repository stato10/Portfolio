import { Cpu, FileText, GitFork, Layers3, Send, Sparkles, TerminalSquare, UserRound } from 'lucide-react'

const iconMap = {
  cpu: Cpu,
  file: FileText,
  github: GitFork,
  layers: Layers3,
  send: Send,
  sparkles: Sparkles,
  terminal: TerminalSquare,
  user: UserRound,
}

export default function AppIcon({ app, size = 24 }) {
  const Icon = iconMap[app.icon] || Layers3
  return <Icon size={size} strokeWidth={1.65} aria-hidden="true" />
}
