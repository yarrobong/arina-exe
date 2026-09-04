import { useEffect, useRef, useState } from 'react'
import { useNearViewport } from '../hooks/useNearViewport'

type LazyVideoProps = {
  src: string
  ariaLabel: string
  autoPlay?: boolean
  controls?: boolean
  loop?: boolean
  className?: string
  onError?: () => void
  preloadWhenNear?: 'none' | 'metadata' | 'auto'
}

export function LazyVideo({
  src,
  ariaLabel,
  autoPlay = true,
  controls = false,
  loop = true,
  className,
  onError,
  preloadWhenNear = 'metadata',
}: LazyVideoProps) {
  const { ref: shellRef, isNear } = useNearViewport<HTMLDivElement>({ rootMargin: '600px 0px' })
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const node = shellRef.current
    if (!node) return
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting && entry.intersectionRatio >= 0.12)
    }, { threshold: [0, 0.12, 0.5] })

    observer.observe(node)
    return () => observer.disconnect()
  }, [shellRef])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !autoPlay || !isNear) return

    if (isVisible) {
      void video.play().catch(() => undefined)
    } else {
      video.pause()
    }
  }, [autoPlay, isNear, isVisible])

  return (
    <div ref={shellRef} className={`lazy-video${className ? ` ${className}` : ''}`}>
      {!isReady && <div className="lazy-video__placeholder" aria-hidden="true"><span>MEDIA</span></div>}
      <video
        ref={videoRef}
        src={isNear ? src : undefined}
        autoPlay={autoPlay && isVisible}
        controls={controls}
        loop={loop}
        muted={autoPlay}
        playsInline
        preload={isNear ? preloadWhenNear : 'none'}
        aria-label={ariaLabel}
        onLoadedData={() => setIsReady(true)}
        onError={onError}
      >
        Ваш браузер не поддерживает воспроизведение видео.
      </video>
    </div>
  )
}
