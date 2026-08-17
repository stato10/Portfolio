import { createContext, createElement, useCallback, useContext, useMemo, useReducer } from 'react'
import { appById } from '../data/apps'

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
}

function reducer(state, action) {
  switch (action.type) {
    case 'OPEN': {
      const existing = state.windows.find((windowItem) => windowItem.appId === action.app.id)
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
        id: action.app.id,
        appId: action.app.id,
        title: action.app.title,
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
    default:
      return state
  }
}

export function OSProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const openApp = useCallback((appId) => {
    const app = appById.get(appId)
    if (!app) return
    if (app.externalUrl) {
      window.open(app.externalUrl, '_blank', 'noopener,noreferrer')
      return
    }
    dispatch({ type: 'OPEN', app })
  }, [])

  const actions = useMemo(() => ({
    openApp,
    closeWindow: (id) => dispatch({ type: 'CLOSE', id }),
    focusWindow: (id) => dispatch({ type: 'FOCUS', id }),
    minimizeWindow: (id) => dispatch({ type: 'MINIMIZE', id }),
    toggleMaximize: (id) => dispatch({ type: 'TOGGLE_MAXIMIZE', id }),
    setWindowBounds: (id, bounds) => dispatch({ type: 'SET_BOUNDS', id, bounds }),
  }), [openApp])

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions])
  return createElement(OSContext.Provider, { value }, children)
}

export function useOSStore() {
  const context = useContext(OSContext)
  if (!context) throw new Error('useOSStore must be used within OSProvider')
  return context
}
