import { useEffect, useRef, useState } from 'react'

const items = [
  ['#childhood', 'детство'],
  ['#geography', 'карта'],
  ['#school-5-9', 'школа'],
  ['#sport', 'спорт'],
  ['#evolution', 'версии'],
  ['#university', 'УрФУ'],
  ['#friends', 'люди'],
  ['#relationship', 'Ярик'],
  ['#facts', 'цифры'],
  ['#inventory', 'инвентарь'],
  ['#future', 'будущее'],
] as const

export function TopNav() {
  const trackRef = useRef<HTMLDivElement>(null)
  const lastManualNavScroll = useRef(0)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const sections = items
      .map(([href]) => document.getElementById(href.slice(1)))
      .filter((section): section is HTMLElement => section !== null)
    if (sections.length === 0) return

    let frame: number | null = null
    const updateActiveSection = () => {
      frame = null
      const activationLine = 72
      const current = sections.find((section) => {
        const rect = section.getBoundingClientRect()
        return rect.top <= activationLine && rect.bottom > activationLine
      })
      setActiveId(current?.id ?? null)
    }
    const scheduleUpdate = () => {
      if (frame === null) frame = window.requestAnimationFrame(updateActiveSection)
    }

    updateActiveSection()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track || !activeId || Date.now() - lastManualNavScroll.current < 1400) return

    const activeLink = track.querySelector<HTMLAnchorElement>(`a[href="#${CSS.escape(activeId)}"]`)
    if (!activeLink) return

    const left = activeLink.offsetLeft - (track.clientWidth - activeLink.offsetWidth) / 2
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollTo({ left: Math.max(0, left), behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [activeId])

  const markManualNavScroll = () => {
    lastManualNavScroll.current = Date.now()
  }

  return (
    <nav className="top-nav" aria-label="Навигация по истории">
      <div
        ref={trackRef}
        className="top-nav__track"
        onPointerDown={markManualNavScroll}
        onTouchStart={markManualNavScroll}
        onWheel={markManualNavScroll}
      >
        {items.map(([href, label]) => {
          const isActive = href.slice(1) === activeId
          return (
            <a
              key={href}
              className={isActive ? 'is-active' : undefined}
              href={href}
              aria-current={isActive ? 'location' : undefined}
            >
              {label}
            </a>
          )
        })}
      </div>
    </nav>
  )
}
