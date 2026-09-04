import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Place } from '../content/types'
import { MapProgress } from './MapProgress'

type MapStoryCardProps = {
  place: Place
  active: number
  total: number
  labels: string[]
  onSelect: (index: number) => void
}

export function MapStoryCard({ place, active, total, labels, onSelect }: MapStoryCardProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="map-story-card" aria-live="polite">
      <div className="map-story-card__shine" aria-hidden="true" />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={place.id}
          className="map-story-card__content"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, filter: 'blur(6px)' }}
          transition={{ duration: reduceMotion ? 0.12 : 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="map-story-card__meta">
            <span>{place.chapter}</span>
            <span className="map-story-card__era">{place.era}</span>
          </div>
          <div className="map-story-card__title-row">
            <h3>{place.title}</h3>
            <time>{place.years}</time>
          </div>
          <p>{place.story}</p>
        </motion.div>
      </AnimatePresence>
      <MapProgress active={active} total={total} labels={labels} onSelect={onSelect} />
    </div>
  )
}
