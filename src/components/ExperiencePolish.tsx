import { useEffect, useState } from 'react'
import '../styles/experience-polish.css'

const BOOT_STORAGE_KEY = 'arina-exe:boot-seen:v1'

const timeline = [
  { year: '2007', label: 'Рождение', detail: 'Пионерский', href: '#childhood' },
  { year: '2018', label: 'Новая школа', detail: 'Советский', href: '#school-5-9' },
  { year: '2023', label: 'Казань', detail: 'поездка с классом', href: '#school-5-9' },
  { year: '2025', label: 'УрФУ', detail: 'бизнес-информатика', href: '#university' },
  { year: '2026', label: 'Новая глава', detail: 'второй курс', href: '#university' },
] as const

export function BootSequence() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined' || window.location.hash) return false
    try {
      return window.sessionStorage.getItem(BOOT_STORAGE_KEY) !== '1'
    } catch {
      return true
    }
  })

  useEffect(() => {
    if (!visible) return

    try {
      window.sessionStorage.setItem(BOOT_STORAGE_KEY, '1')
    } catch {
      // Session storage is optional; the boot still works without persistence.
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(() => setVisible(false), reduceMotion ? 180 : 1450)
    return () => window.clearTimeout(timer)
  }, [visible])

  if (!visible) return null

  return (
    <div className="experience-boot" aria-hidden="true" onPointerDown={() => setVisible(false)}>
      <div className="experience-boot__scan" />
      <div className="experience-boot__terminal">
        <span>ARINA.EXE / BOOT</span>
        <strong>MEMORY ARCHIVE</strong>
        <div>
          <i>01</i><p>SYSTEM START</p>
          <i>02</i><p>MEMORY INDEX FOUND</p>
          <i>03</i><p>PERSONAL ARCHIVE OPENED</p>
        </div>
        <small>2007 → NOW</small>
      </div>
    </div>
  )
}

export function LifeTimeline() {
  const [openedAt] = useState(() => new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date()))

  return (
    <section className="life-index" aria-labelledby="life-index-title">
      <header className="life-index__header">
        <div>
          <span id="life-index-title">LIFE TIMELINE</span>
          <small>5 CONFIRMED NODES</small>
        </div>
        <strong>ARCHIVE OPENED · {openedAt}</strong>
      </header>

      <div className="life-index__track" aria-label="Ключевые точки истории Арины">
        {timeline.map((item, index) => (
          <a href={item.href} className="life-index__node" key={`${item.year}-${item.label}`}>
            <i aria-hidden="true">{String(index + 1).padStart(2, '0')}</i>
            <time>{item.year}</time>
            <strong>{item.label}</strong>
            <small>{item.detail}</small>
          </a>
        ))}
      </div>

      <div className="life-index__status" aria-hidden="true">
        <span>MEMORY INDEX</span><i /><strong>STATUS: LOADED ✓</strong>
      </div>
    </section>
  )
}

type ChapterBridgeProps = {
  from: string
  to: string
  href: string
  note?: string
}

export function ChapterBridge({ from, to, href, note }: ChapterBridgeProps) {
  return (
    <a className="chapter-bridge" href={href} aria-label={`Следующая глава: ${to}`}>
      <span>{from}</span>
      <i aria-hidden="true">→</i>
      <div>
        <small>{note ?? 'NEXT FILE'}</small>
        <strong>{to}</strong>
      </div>
    </a>
  )
}

export function UniversityProfile() {
  return (
    <section className="university-profile" aria-label="Профиль Арины в УрФУ">
      <div className="university-profile__chrome">
        <span>URFU PROFILE</span><i /><strong>ACTIVE</strong>
      </div>
      <div className="university-profile__identity">
        <div aria-hidden="true">A</div>
        <p><small>STUDENT</small><strong>ARINA.EXE</strong><span>current chapter · university</span></p>
      </div>
      <dl>
        <div><dt>Институт</dt><dd>ИНЭУ</dd></div>
        <div><dt>Направление</dt><dd>Бизнес-информатика</dd></div>
        <div><dt>Уровень</dt><dd>Бакалавриат</dd></div>
        <div><dt>Статус</dt><dd>2 курс</dd></div>
      </dl>
      <div className="university-profile__footer"><span>2025 → NOW</span><strong>CHAPTER 06 LOADING…</strong></div>
    </section>
  )
}
