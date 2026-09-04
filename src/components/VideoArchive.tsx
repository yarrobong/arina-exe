import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { assetUrl } from '../utils/assetUrl'
import '../styles/video-archive.css'

type Tape = {
  id: string
  src: string
  year: string
  title: string
  caption: string
}

const tapes: Tape[] = [
  {
    id: 'tape-01',
    src: '/media/childhood/baby-01.webm',
    year: '2008',
    title: 'Ранний видеоархив',
    caption: 'Архив детства',
  },
  {
    id: 'tape-02',
    src: '/media/childhood/baby-02.webm',
    year: '2009',
    title: 'Ещё одно детское видео',
    caption: 'Домашняя запись',
  },
]

export function VideoArchive() {
  const [active, setActive] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [tracking, setTracking] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const touchStartX = useRef<number | null>(null)
  const switchTimer = useRef<number | null>(null)
  const activeTape = tapes[active]

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (!isPlaying) {
      video.pause()
      return
    }
    void video.play().catch(() => setIsPlaying(false))
  }, [isPlaying, active])

  useEffect(() => () => {
    if (switchTimer.current !== null) window.clearTimeout(switchTimer.current)
  }, [])

  const switchTape = (next: number) => {
    if (next === active || tracking) return
    setIsPlaying(false)
    setTracking(true)
    switchTimer.current = window.setTimeout(() => {
      setActive(next)
      setTracking(false)
      switchTimer.current = null
    }, 320)
  }

  const step = (direction: -1 | 1) => {
    const next = (active + direction + tapes.length) % tapes.length
    switchTape(next)
  }

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current
    const delta = endX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < 48) return
    step(delta < 0 ? 1 : -1)
  }

  return (
    <section className="video-archive" aria-label="Видеоархив детства Арины">
      <div className="video-archive__topline">
        <div>
          <span>HOME VIDEO ARCHIVE</span>
          <small>ARINA.EXE / CHILDHOOD</small>
        </div>
        <strong>{String(active + 1).padStart(2, '0')} / {String(tapes.length).padStart(2, '0')}</strong>
      </div>

      <div className="video-archive__screen" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="video-archive__hud" aria-hidden="true">
          <span className="video-archive__rec"><i /> REC</span>
          <span>{activeTape.year}<br />SP</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTape.id}
            className="video-archive__media"
            initial={{ opacity: 0, scale: 1.025, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.99, filter: 'blur(4px)' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <video
              ref={videoRef}
              src={assetUrl(activeTape.src)}
              muted
              playsInline
              loop
              preload="metadata"
              onClick={() => setIsPlaying((value) => !value)}
              aria-label={activeTape.title}
            />
          </motion.div>
        </AnimatePresence>

        <div className="video-archive__scanlines" aria-hidden="true" />
        <div className="video-archive__counter" aria-hidden="true">{isPlaying ? 'PLAY' : 'PAUSE'} · SP</div>

        <button
          className="video-archive__play"
          type="button"
          onClick={() => setIsPlaying((value) => !value)}
          aria-label={isPlaying ? 'Поставить видео на паузу' : 'Воспроизвести видео'}
        >
          {isPlaying ? 'Ⅱ' : '▶'}
        </button>

        <AnimatePresence>
          {tracking && (
            <motion.div
              className="video-archive__tracking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              <span>TRACKING...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="video-archive__caption">
        <span>memory_{String(active + 1).padStart(2, '0')}</span>
        <strong>{activeTape.title}</strong>
        <small>{activeTape.caption}</small>
      </div>

      <div className="video-archive__tapes" aria-label="Выбор кассеты">
        {tapes.map((tape, index) => (
          <button
            key={tape.id}
            className={index === active ? 'video-tape is-active' : 'video-tape'}
            type="button"
            onClick={() => switchTape(index)}
            aria-pressed={index === active}
          >
            <span className="video-tape__icon" aria-hidden="true"><i /><b>{String(index + 1).padStart(2, '0')}</b><i /></span>
            <span><small>TAPE {String(index + 1).padStart(2, '0')}</small><strong>{tape.year}</strong></span>
          </button>
        ))}
      </div>

      <div className="video-archive__controls">
        <button type="button" onClick={() => step(-1)}>‹ PREV</button>
        <span>свайпни плёнку</span>
        <button type="button" onClick={() => step(1)}>NEXT ›</button>
      </div>
    </section>
  )
}
