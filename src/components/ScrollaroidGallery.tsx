import { useEffect, useRef, useState } from 'react'
import type { Photo } from '../content/types'
import { LazyImage } from './LazyImage'
import { LazyVideo } from './LazyVideo'

function ScrollaroidPhoto({
  photo,
}: {
  photo: Photo
}) {
  const [broken, setBroken] = useState(false)
  const isVideo = photo.src.toLowerCase().endsWith('.webm')

  return (
    <figure
      className="scrollaroid-card"
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
  const trackRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const count = photos.length

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const updateActivePhoto = () => {
      const cards = Array.from(track.children) as HTMLElement[]
      const trackCenter = track.scrollLeft + track.clientWidth / 2
      let nearestIndex = 0
      let nearestDistance = Number.POSITIVE_INFINITY

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2
        const distance = Math.abs(cardCenter - trackCenter)
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = index
        }
      })

      setActiveIndex(nearestIndex)
    }

    updateActivePhoto()
    track.addEventListener('scroll', updateActivePhoto, { passive: true })
    window.addEventListener('resize', updateActivePhoto)

    return () => {
      track.removeEventListener('scroll', updateActivePhoto)
      window.removeEventListener('resize', updateActivePhoto)
    }
  }, [count])

  useEffect(() => {
    if (counterRef.current) {
      counterRef.current.textContent = String(activeIndex + 1).padStart(2, '0')
    }
    if (progressRef.current) {
      progressRef.current.style.width = `${count > 1 ? (activeIndex / (count - 1)) * 100 : 100}%`
    }
  }, [activeIndex, count])

  return (
    <section
      className="scrollaroid-gallery"
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
        <div ref={trackRef} className="scrollaroid-gallery__stage" aria-label="Горизонтальная галерея фотографий">
          {photos.map((photo) => (
            <ScrollaroidPhoto key={photo.src} photo={photo} />
          ))}
        </div>
        <div className="scrollaroid-gallery__progress" aria-hidden="true">
          <span ref={progressRef} />
        </div>
        <span className="scrollaroid-gallery__cue" aria-hidden="true">свайп влево / вправо <i>↔</i></span>
      </div>
    </section>
  )
}
