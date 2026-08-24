import { Cpu, FileText, Folder, GitFork, Layers3, Send, Sparkles, TerminalSquare, UserRound } from 'lucide-react'

const iconMap = {
  cpu: Cpu,
  file: FileText,
  folder: Folder,
  github: GitFork,
  layers: Layers3,
  send: Send,
  sparkles: Sparkles,
  terminal: TerminalSquare,
  user: UserRound,
}

export default function AppIcon({ app, size = 24 }) {
  const Icon = iconMap[app.icon] || Layers3
  const palette = app.palette || [app.accent, app.accent, '#ffffff']

  return (
    <span
      className={`app-icon-art app-icon-art--${app.id}`}
      style={{
        '--app-color-a': palette[0],
        '--app-color-b': palette[1],
        '--app-color-c': palette[2],
      }}
      aria-hidden="true"
    >
      <Icon size={size} strokeWidth={1.75} />
    </span>
  )
}
