import { useEffect, useRef, useState } from 'react'
import { motion, useScroll } from 'motion/react'
import { MemoryFragmentTrigger } from '../components/MemoryFragments'
import { RelationshipIntro } from '../components/RelationshipIntro'
import { RelationshipTimeline } from '../components/RelationshipTimeline'
import { relationshipTimeline } from '../content/relationship'
import '../styles/relationship-density.css'

export function Relationship({ anchorId = 'relationship' }: { anchorId?: string | null }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [connected, setConnected] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })

  useEffect(() => {
    const dots = Array.from(sectionRef.current?.querySelectorAll<HTMLElement>('[data-timeline-index]') ?? [])
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const next = Number((entry.target as HTMLElement).dataset.timelineIndex)
        if (Number.isFinite(next)) setActiveIndex(next)
      })
    }, { rootMargin: '-42% 0px -55% 0px', threshold: 0 })

    dots.forEach((dot) => observer.observe(dot))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section-shell relationship" id={anchorId ?? undefined} ref={sectionRef}>
      <MemoryFragmentTrigger id="pink-jeans" placement="relationship" />
      <RelationshipIntro connected={connected} onConnect={() => setConnected(true)} />
      <div className="relationship-progress" aria-label={`Этап ${activeIndex + 1} из ${relationshipTimeline.length}: ${relationshipTimeline[activeIndex].period}`}>
        <div><span>RELATIONSHIP ARCHIVE</span><strong>{String(activeIndex + 1).padStart(2, '0')} / {relationshipTimeline.length}</strong></div>
        <div className="relationship-progress__track"><motion.i style={{ scaleX: scrollYProgress }} /></div>
        <small>{relationshipTimeline[activeIndex].period}</small>
      </div>
      <RelationshipTimeline events={relationshipTimeline} />
    </section>
  )
}
