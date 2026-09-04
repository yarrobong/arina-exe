import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import type { Photo } from '../content/types'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function ScrollaroidPhoto({ photo, index, count, progress }: { photo: Photo; index: number; count: number; progress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const [broken, setBroken] = useState(false)
  const isVideo = photo.src.toLowerCase().endsWith('.webm')
  const tilt = index % 2 === 0 ? -2.2 : 1.7

  const x = useTransform(progress, (value) => {
    const distance = value * Math.max(count - 1, 1) - index
    return `${clamp(-distance * 112, -125, 125)}%`
  })
  const y = useTransform(progress, (value) => {
    const distance = value * Math.max(count - 1, 1) - index
    return `${clamp(distance * 9, -14, 14)}%`
  })
  const scale = useTransform(progress, (value) => {
    const distance = Math.abs(value * Math.max(count - 1, 1) - index)
    return 1 - Math.min(distance, 1.2) * 0.2
  })
  const rotate = useTransform(progress, (value) => {
    const distance = value * Math.max(count - 1, 1) - index
    return tilt + clamp(distance * 8, -8, 8)
  })
  const opacity = useTransform(progress, (value) => {
    const distance = Math.abs(value * Math.max(count - 1, 1) - index)
    return distance > 1.15 ? 0 : 1 - Math.min(distance, 1) * 0.6
  })

  return (
    <motion.figure
      className="scrollaroid-card"
      style={{ x, y, scale, rotate, opacity, zIndex: index + 1 }}
      aria-label={photo.alt}
    >
      <div className="scrollaroid-card__image">
        {!broken ? (
          isVideo ? (
            <video autoPlay loop muted playsInline preload="metadata" aria-label={photo.alt} onError={() => setBroken(true)}>
              <source src={photo.src} type="video/webm" />
            </video>
          ) : (
            <img src={photo.src} alt={photo.alt} loading={index === 0 ? 'eager' : 'lazy'} onError={() => setBroken(true)} />
          )
        ) : (
          <div className="media-placeholder" aria-label={photo.alt}>
            <small>{photo.src.split('/').at(-1)}</small>
          </div>
        )}
      </div>
      {(photo.caption || photo.date) && (
        <figcaption>
          <span>{photo.caption}</span>
          {photo.date && <time>{photo.date}</time>}
        </figcaption>
      )}
    </motion.figure>
  )
}

export function ScrollaroidGallery({ photos, label }: { photos: Photo[]; label: string }) {
  const galleryRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: galleryRef, offset: ['start start', 'end end'] })
  const count = photos.length
  const activeLabel = useTransform(scrollYProgress, (value) => String(Math.round(value * Math.max(count - 1, 1)) + 1).padStart(2, '0'))
  const progressWidth = useTransform(scrollYProgress, (value) => `${Math.round(value * 100)}%`)

  return (
    <section
      ref={galleryRef}
      className="scrollaroid-gallery"
      style={{ '--scrollaroid-count': count } as React.CSSProperties}
      aria-label={`Фотографии: ${label}`}
    >
      <div className="scrollaroid-gallery__sticky">
        <div className="scrollaroid-gallery__chrome" aria-hidden="true">
          <span>SCROLLAROIDS</span>
          <i />
          <span>{label}</span>
        </div>
        <div className="scrollaroid-gallery__counter" aria-hidden="true">
          <motion.span>{activeLabel}</motion.span>
          <small>/ {String(count).padStart(2, '0')}</small>
        </div>
        <div className="scrollaroid-gallery__stage">
          {photos.map((photo, index) => (
            <ScrollaroidPhoto key={photo.src} photo={photo} index={index} count={count} progress={scrollYProgress} />
          ))}
        </div>
        <div className="scrollaroid-gallery__progress" aria-hidden="true">
          <motion.span style={{ width: progressWidth }} />
        </div>
        <span className="scrollaroid-gallery__cue" aria-hidden="true">листай архив <i>↓</i></span>
      </div>
      <div className="scrollaroid-gallery__steps" aria-hidden="true">
        {photos.map((photo) => <div className="scrollaroid-gallery__step" key={photo.src} />)}
      </div>
    </section>
  )
}
