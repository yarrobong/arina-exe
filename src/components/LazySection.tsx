import type { CSSProperties, ReactNode } from 'react'
import { Suspense, useEffect, useState } from 'react'
import { useNearViewport } from '../hooks/useNearViewport'

type LazySectionProps = {
  children: ReactNode
  id?: string
  className?: string
  minHeight: string
  musicChapter?: string
  rootMargin?: string
}

export function LazySection({
  children,
  id,
  className,
  minHeight,
  musicChapter,
  rootMargin = '1100px 0px',
}: LazySectionProps) {
  const { ref, isNear } = useNearViewport<HTMLDivElement>({ rootMargin })
  const [wasTargeted, setWasTargeted] = useState(false)
  const shouldMount = isNear || wasTargeted
  const style = { '--lazy-section-min-height': minHeight } as CSSProperties

  useEffect(() => {
    if (!id) return
    const checkHash = () => {
      if (decodeURIComponent(window.location.hash.slice(1)) === id) setWasTargeted(true)
    }
    checkHash()
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [id])

  useEffect(() => {
    if (!id || !wasTargeted || decodeURIComponent(window.location.hash.slice(1)) !== id) return

    let cancelled = false
    let resizeObserver: ResizeObserver | null = null
    const timers: number[] = []

    const settle = () => {
      if (!cancelled) ref.current?.scrollIntoView({ block: 'start', behavior: 'auto' })
    }

    const stopSettling = () => {
      if (cancelled) return
      cancelled = true
      timers.forEach((timer) => window.clearTimeout(timer))
      resizeObserver?.disconnect()
    }

    timers.push(...[80, 320, 800].map((delay) => window.setTimeout(settle, delay)))
    resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(settle) : null
    if (ref.current) resizeObserver?.observe(ref.current)
    timers.push(window.setTimeout(stopSettling, 1600))

    window.addEventListener('touchstart', stopSettling, { passive: true, once: true })
    window.addEventListener('wheel', stopSettling, { passive: true, once: true })
    window.addEventListener('pointerdown', stopSettling, { passive: true, once: true })
    window.addEventListener('keydown', stopSettling, { once: true })

    return () => {
      stopSettling()
      window.removeEventListener('touchstart', stopSettling)
      window.removeEventListener('wheel', stopSettling)
      window.removeEventListener('pointerdown', stopSettling)
      window.removeEventListener('keydown', stopSettling)
    }
  }, [id, ref, wasTargeted])

  return (
    <div
      ref={ref}
      id={id}
      className={`lazy-section${shouldMount ? ' is-mounted' : ''}${className ? ` ${className}` : ''}`}
      style={style}
      data-music-chapter={musicChapter}
    >
      {shouldMount ? (
        <Suspense fallback={<div className="lazy-section__placeholder" aria-hidden="true" />}>
          {children}
        </Suspense>
      ) : (
        <div className="lazy-section__placeholder" aria-hidden="true" />
      )}
    </div>
  )
}
