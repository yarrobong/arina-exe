import { useCallback, useEffect, useRef, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'
import type { Photo } from '../content/types'
import { useNearViewport } from '../hooks/useNearViewport'
import { LazyImage } from './LazyImage'
import { LazyVideo } from './LazyVideo'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function ScrollaroidPhoto({
  photo,
  index,
  setCardRef,
}: {
  photo: Photo
  index: number
  setCardRef: (index: number, node: HTMLElement | null) => void
}) {
  const [broken, setBroken] = useState(false)
  const isVideo = photo.src.toLowerCase().endsWith('.webm')

  return (
    <figure
      ref={(node) => setCardRef(index, node)}
      className="scrollaroid-card"
      style={{ zIndex: index + 1 }}
      aria-label={photo.alt}
    >
      <div className="scrollaroid-card__image">
        {!broken ? (
          isVideo ? (
            <LazyVideo src={photo.src} ariaLabel={photo.alt} onError={() => setBroken(true)} />
          ) : (
            <LazyImage
              src={photo.src}
              alt={photo.alt}
              onError={() => setBroken(true)}
            />
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
    </figure>
  )
}

export function ScrollaroidGallery({ photos, label }: { photos: Photo[]; label: string }) {
  const { ref: galleryRef, isNear } = useNearViewport<HTMLElement>({ rootMargin: '900px 0px', once: false })
  const cardsRef = useRef<Array<HTMLElement | null>>([])
  const counterRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const frameRef = useRef<number | null>(null)
  const { scrollYProgress } = useScroll({ target: galleryRef, offset: ['start start', 'end end'] })
  const count = photos.length

  const renderProgress = useCallback((value: number) => {
    cardsRef.current.forEach((card, index) => {
      if (!card) return
      const distance = value * Math.max(count - 1, 1) - index
      const absoluteDistance = Math.abs(distance)
      const tilt = index % 2 === 0 ? -2.2 : 1.7
      const x = clamp(-distance * 112, -125, 125)
      const y = clamp(distance * 9, -14, 14)
      const scale = 1 - Math.min(absoluteDistance, 1.2) * 0.2
      const rotate = tilt + clamp(distance * 8, -8, 8)
      const opacity = absoluteDistance > 1.15 ? 0 : 1 - Math.min(absoluteDistance, 1) * 0.6

      card.style.transform = `translate3d(${x}%, ${y}%, 0) scale(${scale}) rotate(${rotate}deg)`
      card.style.opacity = String(opacity)
    })

    if (counterRef.current) {
      counterRef.current.textContent = String(Math.round(value * Math.max(count - 1, 1)) + 1).padStart(2, '0')
    }
    if (progressRef.current) progressRef.current.style.width = `${Math.round(value * 100)}%`
  }, [count])

  const scheduleProgress = useCallback((value: number) => {
    if (!isNear || frameRef.current !== null) return
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null
      renderProgress(value)
    })
  }, [isNear, renderProgress])

  useMotionValueEvent(scrollYProgress, 'change', scheduleProgress)

  useEffect(() => {
    renderProgress(scrollYProgress.get())
    return () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
    }
  }, [renderProgress, scrollYProgress, isNear])

  const setCardRef = useCallback((index: number, node: HTMLElement | null) => {
    cardsRef.current[index] = node
  }, [])

  return (
    <section
      ref={galleryRef}
      className={`scrollaroid-gallery${isNear ? ' is-motion-active' : ''}`}
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
          <span ref={counterRef}>01</span>
          <small>/ {String(count).padStart(2, '0')}</small>
        </div>
        <div className="scrollaroid-gallery__stage">
          {photos.map((photo, index) => (
            <ScrollaroidPhoto key={photo.src} photo={photo} index={index} setCardRef={setCardRef} />
          ))}
        </div>
        <div className="scrollaroid-gallery__progress" aria-hidden="true">
          <span ref={progressRef} />
        </div>
        <span className="scrollaroid-gallery__cue" aria-hidden="true">листай архив <i>↓</i></span>
      </div>
      <div className="scrollaroid-gallery__steps" aria-hidden="true">
        {photos.map((photo) => <div className="scrollaroid-gallery__step" key={photo.src} />)}
      </div>
    </section>
  )
}
