import { useState } from 'react'
import { Image as ImageIcon, Play } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'

export default function ProjectMedia({ item, title, aspectRatio = '16 / 10', priority = false, className = '' }) {
  const [loaded, setLoaded] = useState(false)
  const reduceMotion = useReducedMotion()
  const mediaItem = typeof item === 'string' ? { type: 'image', src: item, alt: title } : item

  if (!mediaItem?.src) {
    return (
      <div className={`project-media-system is-placeholder ${className}`} style={{ aspectRatio }} role="img" aria-label={`${title} media placeholder`}>
        <ImageIcon aria-hidden="true" />
        <span>Media module ready</span>
      </div>
    )
  }

  if (mediaItem.type === 'video') {
    return (
      <div className={`project-media-system ${className}`} style={{ aspectRatio }}>
        <video
          src={mediaItem.src}
          poster={mediaItem.poster}
          muted
          playsInline
          controls={mediaItem.controls ?? true}
          autoPlay={Boolean(mediaItem.autoPlay && !reduceMotion)}
          loop={Boolean(mediaItem.loop && !reduceMotion)}
          preload="metadata"
          aria-label={mediaItem.alt || `${title} project video`}
          onLoadedData={() => setLoaded(true)}
        />
        {!loaded && <div className="media-loading"><Play aria-hidden="true" /><span>Loading media</span></div>}
      </div>
    )
  }

  return (
    <div className={`project-media-system ${loaded ? 'is-loaded' : 'is-loading'} ${className}`} style={{ aspectRatio }}>
      <img
        src={mediaItem.src}
        alt={mediaItem.alt || `${title} project interface`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
      {!loaded && <div className="media-loading"><span>Loading visual</span></div>}
    </div>
  )
}
