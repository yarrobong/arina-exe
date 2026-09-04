import { useEffect, useRef, useState } from 'react'
import { assetUrl } from '../utils/assetUrl'

const slides = [
  '/media/evolution/arina-18.webp',
  '/media/urfu/year-1-01.webp',
  '/media/relationship/our-photo-01.webp',
]

export function Hero() {
  const trackRef = useRef<HTMLDivElement>(null)

  return (
    <section className="hero" id="top">
      <div ref={trackRef} className="hero__slides" aria-label="Фотографии Арины">
        {slides.map((src, index) => (
          <HeroSlide key={src} src={src} index={index} track={trackRef} />
        ))}
      </div>
      <h1>Арина</h1>
      <div className="hero__ticker"><span>MEMORY ARCHIVE ✦ 2007 → NOW ✦ Y2K BIOGRAPHY ✦ </span><span>MEMORY ARCHIVE ✦ 2007 → NOW ✦ Y2K BIOGRAPHY ✦ </span></div>
    </section>
  )
}

function HeroSlide({ src, index, track }: { src: string; index: number; track: React.RefObject<HTMLDivElement | null> }) {
  const slideRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(index === 0)
  const resolvedSrc = assetUrl(src)

  useEffect(() => {
    if (shouldLoad || !slideRef.current || !track.current) return
    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setShouldLoad(true)
      observer.disconnect()
    }, { root: track.current, rootMargin: '0px -10%', threshold: 0.05 })

    observer.observe(slideRef.current)
    return () => observer.disconnect()
  }, [shouldLoad, track])

  return (
    <div ref={slideRef} className="hero__slide" style={{ '--hero-delay': `${index * 80}ms` } as React.CSSProperties}>
      {shouldLoad && (
        <img
          src={resolvedSrc}
          alt="Арина"
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={index === 0 ? 'high' : 'low'}
          onError={(event) => { event.currentTarget.style.display = 'none' }}
        />
      )}
      <div className="hero__placeholder" aria-hidden="true" />
    </div>
  )
}
