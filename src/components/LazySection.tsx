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

function currentHashId() {
  const hash = window.location.hash.slice(1)
  try {
    return decodeURIComponent(hash)
  } catch {
    return hash
  }
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
  const [targetAttempt, setTargetAttempt] = useState(0)
  const shouldMount = isNear || wasTargeted
  const style = { '--lazy-section-min-height': minHeight } as CSSProperties

  useEffect(() => {
    if (!id) return
    const checkHash = () => {
      if (currentHashId() !== id) return
      setWasTargeted(true)
      setTargetAttempt((attempt) => attempt + 1)
    }
    checkHash()
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [id])

  useEffect(() => {
    if (!id || !wasTargeted || targetAttempt === 0 || currentHashId() !== id) return

    let cancelled = false
    let sampleTimer: number | undefined
    let frame: number | undefined
    let hardTimeout: number | undefined
    let lastTop: number | null = null
    let stableMeasurements = 0
    const tolerance = 3

    const stopSettling = () => {
      if (cancelled) return
      cancelled = true
      if (sampleTimer !== undefined) window.clearTimeout(sampleTimer)
      if (frame !== undefined) window.cancelAnimationFrame(frame)
      if (hardTimeout !== undefined) window.clearTimeout(hardTimeout)
    }

    const sample = () => {
      const target = ref.current
      if (cancelled || !target) return

      const scrollMarginTop = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0
      let top = target.getBoundingClientRect().top
      const atPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - tolerance
      const isAligned = Math.abs(top - scrollMarginTop) <= tolerance || atPageEnd

      if (!isAligned) {
        target.scrollIntoView({ block: 'start', behavior: 'auto' })
        top = target.getBoundingClientRect().top
        stableMeasurements = 0
      } else if (lastTop !== null && Math.abs(top - lastTop) <= tolerance) {
        stableMeasurements += 1
      } else {
        stableMeasurements = 0
      }

      lastTop = top
      if (stableMeasurements >= 3) {
        stopSettling()
        return
      }

      sampleTimer = window.setTimeout(sample, 90)
    }

    frame = window.requestAnimationFrame(() => {
      ref.current?.scrollIntoView({ block: 'start', behavior: 'auto' })
      sampleTimer = window.setTimeout(sample, 90)
    })
    hardTimeout = window.setTimeout(stopSettling, 2600)

    window.addEventListener('touchstart', stopSettling, { passive: true, once: true })
    window.addEventListener('wheel', stopSettling, { passive: true, once: true })
    window.addEventListener('pointerdown', stopSettling, { passive: true, once: true })
    window.addEventListener('keydown', stopSettling, { once: true })
    window.addEventListener('hashchange', stopSettling, { once: true })

    return () => {
      stopSettling()
      window.removeEventListener('touchstart', stopSettling)
      window.removeEventListener('wheel', stopSettling)
      window.removeEventListener('pointerdown', stopSettling)
      window.removeEventListener('keydown', stopSettling)
      window.removeEventListener('hashchange', stopSettling)
    }
  }, [id, ref, targetAttempt, wasTargeted])

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
