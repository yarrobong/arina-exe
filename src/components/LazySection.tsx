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
    const settle = () => ref.current?.scrollIntoView({ block: 'start', behavior: 'auto' })
    const timers = [100, 500, 1200].map((delay) => window.setTimeout(settle, delay))
    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(settle) : null
    resizeObserver?.observe(document.documentElement)
    const stopObserving = window.setTimeout(() => resizeObserver?.disconnect(), 3200)

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      window.clearTimeout(stopObserving)
      resizeObserver?.disconnect()
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
