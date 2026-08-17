import { createContext, createElement, useCallback, useContext, useMemo, useReducer, useRef } from 'react'
import { appById } from '../data/apps'
import { projectById } from '../data/projects'
import { resolveProjectLaunchMedia } from '../motion/projectLaunchMedia'

const OSContext = createContext(null)

const viewportBounds = () => ({
  width: typeof window === 'undefined' ? 1280 : window.innerWidth,
  height: typeof window === 'undefined' ? 800 : window.innerHeight,
})

function getInitialBounds(app, offset = 0) {
  const viewport = viewportBounds()
  const width = Math.min(app.defaultSize?.width || 680, viewport.width - 24)
  const height = Math.min(app.defaultSize?.height || 480, viewport.height - 132)
  const centeredX = Math.round((viewport.width - width) / 2 + offset)
  const centeredY = Math.round((viewport.height - height) / 2 - 18 + offset)

  return {
    x: Math.min(Math.max(12, centeredX), viewport.width - width - 12),
    y: Math.min(Math.max(52, centeredY), viewport.height - 96),
    width,
    height,
  }
}

const initialApp = appById.get('about')
const initialState = {
  windows: [{
    id: 'about',
    appId: 'about',
    title: initialApp.title,
    bounds: getInitialBounds(initialApp),
    restoreBounds: null,
    minimized: false,
    maximized: false,
    zIndex: 10,
  }],
  activeWindowId: 'about',
  nextZ: 11,
  launch: null,
  spotlightOpen: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'OPEN': {
      const windowId = action.windowId || action.app.id
      const existing = state.windows.find((windowItem) => windowItem.id === windowId)
      if (existing) {
        return {
          ...state,
          windows: state.windows.map((windowItem) => windowItem.id === existing.id
            ? { ...windowItem, minimized: false, zIndex: state.nextZ }
            : windowItem),
          activeWindowId: existing.id,
          nextZ: state.nextZ + 1,
        }
      }
      const windowItem = {
        id: windowId,
        appId: action.app.id,
        title: action.app.title,
        projectId: action.projectId || null,
        bounds: getInitialBounds(action.app, (state.windows.length % 4) * 18),
        restoreBounds: null,
        minimized: false,
        maximized: false,
        zIndex: state.nextZ,
      }
      return {
        ...state,
        windows: [...state.windows, windowItem],
        activeWindowId: windowItem.id,
        nextZ: state.nextZ + 1,
      }
    }
    case 'CLOSE': {
      const windows = state.windows.filter((windowItem) => windowItem.id !== action.id)
      const topWindow = windows.filter((item) => !item.minimized).sort((a, b) => b.zIndex - a.zIndex)[0]
      return { ...state, windows, activeWindowId: topWindow?.id || null }
    }
    case 'FOCUS':
      if (state.activeWindowId === action.id && !state.windows.find((item) => item.id === action.id)?.minimized) return state
      return {
        ...state,
        windows: state.windows.map((windowItem) => windowItem.id === action.id
          ? { ...windowItem, minimized: false, zIndex: state.nextZ }
          : windowItem),
        activeWindowId: action.id,
        nextZ: state.nextZ + 1,
      }
    case 'MINIMIZE': {
      const remaining = state.windows
        .filter((windowItem) => windowItem.id !== action.id && !windowItem.minimized)
        .sort((a, b) => b.zIndex - a.zIndex)[0]
      return {
        ...state,
        windows: state.windows.map((windowItem) => windowItem.id === action.id
          ? { ...windowItem, minimized: true }
          : windowItem),
        activeWindowId: state.activeWindowId === action.id ? remaining?.id || null : state.activeWindowId,
      }
    }
    case 'TOGGLE_MAXIMIZE':
      return {
        ...state,
        windows: state.windows.map((windowItem) => {
          if (windowItem.id !== action.id) return windowItem
          if (windowItem.maximized) {
            return { ...windowItem, maximized: false, bounds: windowItem.restoreBounds || windowItem.bounds, restoreBounds: null }
          }
          return { ...windowItem, maximized: true, restoreBounds: windowItem.bounds }
        }),
      }
    case 'SET_BOUNDS':
      return {
        ...state,
        windows: state.windows.map((windowItem) => windowItem.id === action.id
          ? { ...windowItem, bounds: { ...windowItem.bounds, ...action.bounds } }
          : windowItem),
      }
    case 'START_PROJECT_LAUNCH':
      return { ...state, launch: action.launch }
    case 'CLEAR_PROJECT_LAUNCH':
      return { ...state, launch: null }
    case 'SET_SPOTLIGHT':
      return { ...state, spotlightOpen: action.open }
    default:
      return state
  }
}

export function OSProvider({ children, navigate, pathname }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const launchSequence = useRef(0)
  const openApp = useCallback((appId) => {
    const app = appById.get(appId)
    if (!app) return
    if (app.externalUrl) {
      window.open(app.externalUrl, '_blank', 'noopener,noreferrer')
      return
    }
    dispatch({ type: 'OPEN', app })
  }, [])

  const openProject = useCallback((projectId) => {
    const project = projectById.get(projectId)
    if (!project) return false
    dispatch({
      type: 'OPEN',
      app: {
        id: 'project',
        title: project.title,
        defaultSize: { width: 980, height: 680 },
      },
      windowId: `project:${project.id}`,
      projectId: project.id,
    })
    return true
  }, [])

  const launchProject = useCallback((projectId, options = {}) => {
    const project = projectById.get(projectId)
    if (!project) return false
    const configuredLaunch = project.media.launch || {}
    const resolvedLaunch = resolveProjectLaunchMedia(configuredLaunch, {
      ...options,
      poster: options.poster ?? configuredLaunch.poster ?? project.media.poster ?? project.media.thumbnail,
      fallbackPoster: options.fallbackPoster ?? configuredLaunch.fallbackPoster ?? project.media.thumbnail,
    })
    dispatch({
      type: 'START_PROJECT_LAUNCH',
      launch: {
        requestId: ++launchSequence.current,
        projectId: project.id,
        accent: options.accent ?? project.accent,
        standardDuration: options.standardDuration ?? options.duration ?? 650,
        media: resolvedLaunch,
      },
    })
    return true
  }, [])

  const clearProjectLaunch = useCallback(() => dispatch({ type: 'CLEAR_PROJECT_LAUNCH' }), [])

  const routeForProject = useCallback((project) => `/projects/${project.slug}`, [])

  const completeProjectLaunch = useCallback((projectId, options = {}) => {
    const project = projectById.get(projectId)
    if (!project) return false
    openProject(project.id)
    const target = routeForProject(project)
    if (pathname !== target) navigate(target)
    if (!options.preserveLaunch) clearProjectLaunch()
    return true
  }, [clearProjectLaunch, navigate, openProject, pathname, routeForProject])

  const closeWindow = useCallback((id, options = {}) => {
    dispatch({ type: 'CLOSE', id })
    if (options.syncRoute === false || !id.startsWith('project:')) return
    const project = projectById.get(id.slice('project:'.length))
    if (project && pathname === routeForProject(project)) navigate('/')
  }, [navigate, pathname, routeForProject])

  const focusWindow = useCallback((id) => {
    dispatch({ type: 'FOCUS', id })
    if (!id.startsWith('project:')) return
    const project = projectById.get(id.slice('project:'.length))
    if (!project) return
    const target = routeForProject(project)
    if (pathname !== target) navigate(target)
  }, [navigate, pathname, routeForProject])

  const actions = useMemo(() => ({
    openApp,
    openProject,
    launchProject,
    completeProjectLaunch,
    clearProjectLaunch,
    openSpotlight: () => dispatch({ type: 'SET_SPOTLIGHT', open: true }),
    closeSpotlight: () => dispatch({ type: 'SET_SPOTLIGHT', open: false }),
    closeWindow,
    focusWindow,
    minimizeWindow: (id) => dispatch({ type: 'MINIMIZE', id }),
    toggleMaximize: (id) => dispatch({ type: 'TOGGLE_MAXIMIZE', id }),
    setWindowBounds: (id, bounds) => dispatch({ type: 'SET_BOUNDS', id, bounds }),
  }), [clearProjectLaunch, closeWindow, completeProjectLaunch, focusWindow, launchProject, openApp, openProject])

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions])
  return createElement(OSContext.Provider, { value }, children)
}

export function useOSStore() {
  const context = useContext(OSContext)
  if (!context) throw new Error('useOSStore must be used within OSProvider')
  return context
}
