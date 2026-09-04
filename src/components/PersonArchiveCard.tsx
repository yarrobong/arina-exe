import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import type { Person } from '../content/types'
import { LazyImage } from './LazyImage'
import { LazyVideo } from './LazyVideo'

type PersonArchiveCardProps = {
  person: Person
  index: number
}

const mediaKind = (src?: string) => src?.toLowerCase().endsWith('.webm') ? 'VIDEO' : src ? 'PHOTO' : 'PHOTO SLOT'

export function PersonArchiveCard({ person, index }: PersonArchiveCardProps) {
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [mediaFailed, setMediaFailed] = useState(false)
  const kind = mediaKind(person.photo)
  const hasMedia = Boolean(person.photo) && !mediaFailed
  const initial = person.name.trim().charAt(0).toUpperCase()

  return (
    <motion.article
      layout={!reduceMotion}
      className={`person-archive-card${open ? ' is-open' : ''}`}
      data-category={person.category}
      transition={{ layout: { duration: reduceMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] } }}
    >
      <div className="person-archive-card__chrome" aria-hidden="true">
        <span>ENTRY {String(index + 1).padStart(2, '0')}</span>
        <i />
        <span>{kind}</span>
      </div>

      <div className={`person-archive-card__media${kind === 'VIDEO' ? ' is-video' : ''}${!hasMedia ? ' is-empty' : ''}`}>
        {hasMedia && person.photo?.toLowerCase().endsWith('.webm') ? (
          <LazyVideo
            src={person.photo}
            ariaLabel={`Видео: ${person.name}`}
            preloadWhenNear="metadata"
            onError={() => setMediaFailed(true)}
          />
        ) : hasMedia && person.photo ? (
          <LazyImage
            src={person.photo}
            alt={`Фото: ${person.name}`}
            rootMargin="420px 100px"
            onError={() => setMediaFailed(true)}
          />
        ) : (
          <div className="person-archive-card__placeholder" aria-label={`Фото для ${person.name} пока не добавлено`}>
            <strong>{initial}</strong>
            <span>PHOTO SLOT</span>
            <small>archive media pending</small>
          </div>
        )}

        {kind === 'VIDEO' && hasMedia && (
          <div className="person-archive-card__video-badge" aria-hidden="true"><i /> VIDEO</div>
        )}
        <div className="person-archive-card__scan" aria-hidden="true" />
      </div>

      <div className="person-archive-card__footer">
        <div>
          <span className="person-archive-card__category">{person.category}</span>
          <strong>{person.name}</strong>
        </div>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-label={`${open ? 'Закрыть' : 'Открыть'} карточку ${person.name}`}
        >
          {open ? '×' : '+'}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="person-archive-card__inspect"
            initial={reduceMotion ? false : { opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -4 }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div><span>ARCHIVE ENTRY</span><strong>{String(index + 1).padStart(2, '0')} / 12</strong></div>
            <div><span>GROUP</span><strong>{person.category}</strong></div>
            <div><span>MEDIA</span><strong>{hasMedia ? kind : 'AWAITING PHOTO'}</strong></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}
