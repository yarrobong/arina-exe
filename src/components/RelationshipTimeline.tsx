import { motion, useScroll } from 'motion/react'
import { useRef } from 'react'
import type { RelationshipEvent } from '../content/relationship'
import { relationshipPhotos } from '../content/relationship'
import { NightChat } from './NightChat'
import { OutfitScan } from './OutfitScan'
import { RelationshipPhotoArchive } from './RelationshipPhotoArchive'
import { TarotCheck } from './TarotCheck'
import { TheaterMemory } from './TheaterMemory'

function EventInterface({ event }: { event: RelationshipEvent }) {
  if (event.type === 'connection') {
    return (
      <div className="connection-route" aria-label="Переход между платформами">
        <span>Дайвинчик</span><i>↓</i><span>Discord</span><i>↓</i><span>TikTok</span>
      </div>
    )
  }

  if (event.type === 'call') {
    return (
      <div className="voice-call">
        <div className="voice-call__avatar">Y</div>
        <div><span>CONNECTION ESTABLISHED</span><strong>voice call</strong><small>00:XX:XX</small></div>
        <i aria-hidden="true">⌁⌁⌁</i>
      </div>
    )
  }

  if (event.type === 'idle') {
    return (
      <div className="idle-signal">
        <span>connection idle…</span>
        <i><b /><b /><b /><b /><b /></i>
        <small>несколько недель</small>
      </div>
    )
  }

  if (event.type === 'media') {
    return (
      <div className="media-exchange">
        <div><i>▶</i><span>media packet</span><small>sent</small></div>
        <b>→</b>
        <div><i>▶</i><span>media packet</span><small>received</small></div>
      </div>
    )
  }

  if (event.type === 'night') {
    return (
      <>
        <NightChat />
        <div className="connection-active"><span>connection status:</span><strong>ACTIVE</strong><small>после этой ночи общение становится регулярнее</small></div>
      </>
    )
  }

  if (event.type === 'meetup') {
    return (
      <div className="meetup-request">
        <span>MEETUP REQUEST</span>
        <div><small>PLAN A</small><strong>прогулка</strong><em>weather not vibe</em></div>
        <i>↓</i>
        <div className="is-accepted"><small>PLAN B</small><strong>«Очень странные дела»</strong><em>accepted ✓</em></div>
      </div>
    )
  }

  if (event.type === 'tarot') return <TarotCheck />

  if (event.type === 'first-meetup') {
    return (
      <div className="first-meetup">
        <div className="first-meetup__stamp"><span>EARLY DECEMBER</span><strong>FIRST MEETUP</strong><small>connection status: together</small></div>
        <OutfitScan />
      </div>
    )
  }

  if (event.type === 'archive') {
    return <RelationshipPhotoArchive photos={relationshipPhotos} />
  }

  return <TheaterMemory />
}

export function RelationshipTimeline({ events }: { events: RelationshipEvent[] }) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start center', 'end center'] })

  return (
    <div className="relationship-timeline" ref={timelineRef}>
      <div className="relationship-timeline__rail" aria-hidden="true">
        <motion.i style={{ scaleY: scrollYProgress }} />
      </div>
      {events.map((event, index) => (
        <motion.article
          className={`relationship-event relationship-event--${event.type}`}
          id={`relationship-${event.id}`}
          key={event.id}
          initial={{ opacity: 0.28, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relationship-event__dot" data-timeline-index={index} aria-hidden="true"><span>{String(index + 1).padStart(2, '0')}</span></div>
          <header>
            <div className="relationship-event__meta"><span>{event.period}</span><small>{event.label}</small></div>
            <h3>{event.title}</h3>
            <p>{event.text}</p>
          </header>
          <EventInterface event={event} />
        </motion.article>
      ))}
    </div>
  )
}
