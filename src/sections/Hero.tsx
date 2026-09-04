import { useEffect, useRef, useState } from 'react'
import { assetUrl } from '../utils/assetUrl'
import '../styles/hero-polish.css'

const slides = [
  '/media/evolution/arina-18.webp',
  '/media/urfu/year-1-01.webp',
  '/media/relationship/our-photo-01.webp',
]

export function Hero() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [firstSlideLoaded, setFirstSlideLoaded] = useState(false)
  const [preloadSecondSlide, setPreloadSecondSlide] = useState(false)

  useEffect(() => {
    if (!firstSlideLoaded) return

    const idleWindow = window as typeof window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
      cancelIdleCallback?: (handle: number) => void
    }
    const startPreload = () => setPreloadSecondSlide(true)

    if (idleWindow.requestIdleCallback) {
      const idleHandle = idleWindow.requestIdleCallback(startPreload, { timeout: 1200 })
      return () => idleWindow.cancelIdleCallback?.(idleHandle)
    }

    const timeout = window.setTimeout(startPreload, 250)
    return () => window.clearTimeout(timeout)
  }, [firstSlideLoaded])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let frame = 0
    const updateActiveSlide = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const children = Array.from(track.children) as HTMLElement[]
        if (children.length === 0) return

        const trackCenter = track.scrollLeft + track.clientWidth / 2
        let nearestIndex = 0
        let nearestDistance = Number.POSITIVE_INFINITY

        children.forEach((slide, index) => {
          const slideCenter = slide.offsetLeft + slide.offsetWidth / 2
          const distance = Math.abs(slideCenter - trackCenter)
          if (distance < nearestDistance) {
            nearestDistance = distance
            nearestIndex = index
          }
        })

        setActiveIndex(nearestIndex)
        if (track.scrollLeft > 6) setHasInteracted(true)
      })
    }

    updateActiveSlide()
    track.addEventListener('scroll', updateActiveSlide, { passive: true })
    window.addEventListener('resize', updateActiveSlide)

    return () => {
      cancelAnimationFrame(frame)
      track.removeEventListener('scroll', updateActiveSlide)
      window.removeEventListener('resize', updateActiveSlide)
    }
  }, [])

  return (
    <section className="hero" id="top">
      <div className="hero__media">
        <div
          ref={trackRef}
          className="hero__slides"
          aria-label="Фотографии Арины"
          onPointerDown={() => setHasInteracted(true)}
        >
          {slides.map((src, index) => (
            <HeroSlide
              key={src}
              src={src}
              index={index}
              track={trackRef}
              forceLoad={index === 1 && preloadSecondSlide}
              onLoad={index === 0 ? () => setFirstSlideLoaded(true) : undefined}
            />
          ))}
        </div>

        <div className="hero__counter" aria-live="polite" aria-label={`Фото ${activeIndex + 1} из ${slides.length}`}>
          <span>{String(activeIndex + 1).padStart(2, '0')}</span>
          <small>/ {String(slides.length).padStart(2, '0')}</small>
        </div>

        {!hasInteracted && activeIndex === 0 && (
          <div className="hero__swipe-hint" aria-hidden="true">
            <span>свайп</span>
            <i>→</i>
          </div>
        )}
      </div>

      <h1>Арина</h1>
      <div className="hero__ticker"><span>MEMORY ARCHIVE ✦ 2007 → NOW ✦ Y2K BIOGRAPHY ✦ </span><span>MEMORY ARCHIVE ✦ 2007 → NOW ✦ Y2K BIOGRAPHY ✦ </span></div>
    </section>
  )
}

function HeroSlide({
  src,
  index,
  track,
  forceLoad,
  onLoad,
}: {
  src: string
  index: number
  track: React.RefObject<HTMLDivElement | null>
  forceLoad: boolean
  onLoad?: () => void
}) {
  const slideRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(index === 0)
  const resolvedSrc = assetUrl(src)
  const isLoaded = shouldLoad || forceLoad

  useEffect(() => {
    if (isLoaded || !slideRef.current || !track.current) return
    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setShouldLoad(true)
      observer.disconnect()
    }, { root: track.current, rootMargin: '0px -40%', threshold: 0.02 })

    observer.observe(slideRef.current)
    return () => observer.disconnect()
  }, [isLoaded, track])

  return (
    <div ref={slideRef} className="hero__slide" style={{ '--hero-delay': `${index * 80}ms` } as React.CSSProperties}>
      {isLoaded && (
        <img
          src={resolvedSrc}
          alt="Арина"
          loading={index < 2 ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={index === 0 ? 'high' : 'low'}
          onLoad={onLoad}
          onError={(event) => { event.currentTarget.style.display = 'none' }}
        />
      )}
      <div className="hero__placeholder" aria-hidden="true" />
    </div>
  )
}
