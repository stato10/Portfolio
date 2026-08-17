import { lazy } from 'react'

const TerminalApp = lazy(() => import('../apps/Terminal/TerminalApp'))
const ProjectsApp = lazy(() => import('../apps/Projects/ProjectsApp'))
const ProjectWindow = lazy(() => import('../apps/Projects/ProjectWindow'))
const AboutApp = lazy(() => import('../apps/About/AboutApp'))
const PlaceholderApp = lazy(() => import('../apps/PlaceholderApp'))

export const appComponents = new Map([
  ['terminal', TerminalApp],
  ['projects', ProjectsApp],
  ['project', ProjectWindow],
  ['about', AboutApp],
])

export function resolveAppComponent(appId) {
  return appComponents.get(appId) || PlaceholderApp
}
