import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { LazyImage } from './LazyImage'
import '../styles/relationship-photo-archive.css'

type ArchivePhoto = {
  src: string
  alt: string
}

type RelationshipPhotoArchiveProps = {
  photos: ArchivePhoto[]
}

const STACK_SIZE = 4
const STACK_VISIBLE = 3

export function RelationshipPhotoArchive({ photos }: RelationshipPhotoArchiveProps) {
  const reduceMotion = useReducedMotion()
  const [stackIndex, setStackIndex] = useState(0)
  const [stackFinished, setStackFinished] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState(1)

  const stackPhotos = photos.slice(0, Math.min(STACK_SIZE, photos.length))
  const flowingPhotos = photos.slice(stackPhotos.length)
  const visibleStack = stackPhotos.slice(stackIndex, stackIndex + STACK_VISIBLE)

  const advance = (direction = 1) => {
    if (stackFinished || stackPhotos.length === 0) return
    setSwipeDirection(direction >= 0 ? 1 : -1)

    if (stackIndex >= stackPhotos.length - 1) {
      setStackFinished(true)
      return
    }

    setStackIndex((current) => Math.min(current + 1, stackPhotos.length - 1))
  }

  const previous = () => {
    if (stackFinished) {
      setStackFinished(false)
      setStackIndex(stackPhotos.length - 1)
      return
    }

    if (stackIndex === 0) return
    setSwipeDirection(-1)
    setStackIndex((current) => Math.max(0, current - 1))
  }

  const openFlow = () => {
    setSwipeDirection(1)
    setStackFinished(true)
  }

  return (
    <div className="relationship-photo-archive">
      <div className="relationship-photo-archive__topline">
        <div>
          <span>OUR ARCHIVE</span>
          <small>ARINA + YARIK / MEMORY FRAGMENTS</small>
        </div>
        <strong>{String(photos.length).padStart(2, '0')} FRAGMENTS</strong>
      </div>

      <div className={`relationship-photo-stack${stackFinished ? ' is-finished' : ''}`}>
        <AnimatePresence initial={false} mode="popLayout">
          {!stackFinished ? (
            visibleStack.map((photo, layer) => {
              const absoluteIndex = stackIndex + layer
              const isTop = layer === 0

              return (
                <motion.figure
                  key={photo.src}
                  className={`relationship-photo-stack__card${isTop ? ' is-top' : ''}`}
                  style={{ zIndex: 20 - layer }}
                  initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.96 }}
                  animate={{
                    opacity: 1 - layer * 0.2,
                    y: layer * 10,
                    scale: 1 - layer * 0.045,
                    rotate: layer === 0 ? -0.8 : layer === 1 ? 1.8 : -2.4,
                  }}
                  exit={reduceMotion ? { opacity: 0 } : {
                    x: swipeDirection * 360,
                    y: -8,
                    rotate: swipeDirection * 9,
                    opacity: 0,
                    scale: 0.98,
                  }}
                  transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
                  drag={isTop && !reduceMotion ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.42}
                  onDragEnd={(_, info) => {
                    if (Math.abs(info.offset.x) < 68 && Math.abs(info.velocity.x) < 430) return
                    advance(info.offset.x >= 0 ? 1 : -1)
                  }}
                >
                  <div className="relationship-photo-stack__image">
                    <LazyImage src={photo.src} alt={photo.alt} draggable={false} rootMargin="360px 80px" />
                    {isTop && <div className="relationship-photo-stack__shine" aria-hidden="true" />}
                  </div>
                  <figcaption>
                    <span>MEMORY {String(absoluteIndex + 1).padStart(2, '0')}</span>
                    <small>{isTop ? 'swipe me' : 'queued'}</small>
                  </figcaption>
                </motion.figure>
              )
            })
          ) : (
            <motion.div
              key="archive-unlocked"
              className="relationship-photo-stack__unlocked"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: reduceMotion ? 0 : 0.42 }}
            >
              <span>STACK COMPLETE ✓</span>
              <strong>АРХИВ РАСКРЫТ</strong>
              <p>{flowingPhotos.length > 0 ? `ещё ${flowingPhotos.length} кадров ждут ниже` : 'все кадры просмотрены'}</p>
              <i aria-hidden="true">✦</i>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relationship-photo-stack__controls">
        <button type="button" onClick={previous} disabled={!stackFinished && stackIndex === 0}>←</button>
        <div>
          <span>{stackFinished ? '04 / 04' : `${String(stackIndex + 1).padStart(2, '0')} / ${String(stackPhotos.length).padStart(2, '0')}`}</span>
          <small>{stackFinished ? 'stack recovered' : 'свайпни верхний кадр'}</small>
        </div>
        {!stackFinished ? (
          <button type="button" onClick={() => advance(1)}>→</button>
        ) : (
          <button type="button" onClick={() => setStackFinished(false)}>↺</button>
        )}
      </div>

      {!stackFinished && flowingPhotos.length > 0 && (
        <button className="relationship-photo-archive__skip" type="button" onClick={openFlow}>
          ОТКРЫТЬ ЕЩЁ {flowingPhotos.length} КАДРОВ ↓
        </button>
      )}

      <AnimatePresence initial={false}>
        {stackFinished && flowingPhotos.length > 0 && (
          <motion.div
            className="relationship-photo-flow"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.42, delay: reduceMotion ? 0 : 0.08 }}
          >
            <div className="relationship-photo-flow__topline">
              <span>MORE FRAGMENTS</span>
              <small>даты не указаны · порядок не утверждает хронологию</small>
            </div>
            <div className="relationship-photo-flow__track" aria-label="Остальные совместные фотографии, листайте в сторону">
              {flowingPhotos.map((photo, index) => (
                <figure key={photo.src}>
                  <LazyImage src={photo.src} alt={photo.alt} draggable={false} rootMargin="320px 220px" />
                  <figcaption>
                    <span>MEMORY {String(index + stackPhotos.length + 1).padStart(2, '0')}</span>
                    <small>date: unknown</small>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="relationship-photo-flow__cue" aria-hidden="true"><span>листай архив</span><i>→</i></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
