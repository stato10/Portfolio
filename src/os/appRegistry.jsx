import { lazy } from 'react'

const TerminalApp = lazy(() => import('../apps/Terminal/TerminalApp'))
const FileExplorerApp = lazy(() => import('../apps/Explorer/FileExplorerApp'))
const ProjectWindow = lazy(() => import('../apps/Projects/ProjectWindow'))
const AboutApp = lazy(() => import('../apps/About/AboutApp'))
const ResumeApp = lazy(() => import('../apps/Resume/ResumeApp'))
const ContactApp = lazy(() => import('../apps/Contact/ContactApp'))
const AILabApp = lazy(() => import('../apps/AILab/AILabApp'))
const SystemsApp = lazy(() => import('../apps/Systems/SystemsApp'))
const PlaceholderApp = lazy(() => import('../apps/PlaceholderApp'))

export const appComponents = new Map([
  ['terminal', TerminalApp],
  ['projects', FileExplorerApp],
  ['ai-lab', AILabApp],
  ['systems', SystemsApp],
  ['resume', ResumeApp],
  ['project', ProjectWindow],
  ['about', AboutApp],
  ['contact', ContactApp],
])

export function resolveAppComponent(appId) {
  return appComponents.get(appId) || PlaceholderApp
}
