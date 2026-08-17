const preloadCache = new Map()

const mediaPreference = (query) => typeof window !== 'undefined'
  && typeof window.matchMedia === 'function'
  && window.matchMedia(query).matches

export function resolveProjectLaunchMedia(config = {}, options = {}) {
  const mobile = mediaPreference(config.mobileQuery || '(max-width: 760px)')
  const reducedMotion = mediaPreference('(prefers-reduced-motion: reduce)')
  const desktopVideo = options.video ?? options.launchVideo ?? config.video ?? null
  const mobileVideo = options.mobileVideo ?? config.mobileVideo ?? null
  const video = mobile ? mobileVideo : desktopVideo
  const requestedMode = options.mode ?? (options.cinematic ? 'cinematic' : config.mode)
  const fallbackMode = mobile ? config.mobileMode : reducedMotion ? config.reducedMotionMode : null
  const failed = video ? preloadCache.get(video)?.status === 'failed' : false

  return {
    mode: fallbackMode || (requestedMode === 'cinematic' && video && !failed ? 'cinematic' : 'standard'),
    video,
    poster: options.poster ?? config.poster ?? null,
    fallbackPoster: options.fallbackPoster ?? config.fallbackPoster ?? null,
    openAt: options.openAt ?? config.openAt ?? null,
    maxDuration: options.maxDuration ?? config.maxDuration ?? 4500,
    handoff: options.handoff ?? config.handoff ?? null,
  }
}

export function preloadProjectLaunchMedia(project) {
  if (typeof document === 'undefined') return false
  const launch = resolveProjectLaunchMedia(project?.media?.launch)
  if (launch.mode !== 'cinematic' || !launch.video || preloadCache.has(launch.video)) return false

  const video = document.createElement('video')
  const record = { status: 'loading', video }
  preloadCache.set(launch.video, record)
  const markReady = () => { record.status = 'ready' }
  const markFailed = () => { record.status = 'failed' }

  video.preload = 'metadata'
  video.muted = true
  video.playsInline = true
  video.addEventListener('loadedmetadata', markReady, { once: true })
  video.addEventListener('error', markFailed, { once: true })
  video.src = launch.video
  video.load()
  return true
}
