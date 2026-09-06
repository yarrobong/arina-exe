import { useEffect, useState } from 'react'
import '../styles/experience-polish.css'

const BOOT_STORAGE_KEY = 'arina-exe:boot-seen:v1'

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
