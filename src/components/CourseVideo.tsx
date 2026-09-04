import { useState } from 'react'
import { motion } from 'motion/react'
import type { Video } from '../content/types'
import { LazyImage } from './LazyImage'
import { LazyVideo } from './LazyVideo'

export function CourseVideo({ video }: { video: Video }) {
  const [hasError, setHasError] = useState(false)
  const [retryToken, setRetryToken] = useState(0)
  const isGif = video.kind === 'gif'
  const format = video.src.split('.').pop()?.toUpperCase() ?? 'VIDEO'

  const retry = () => {
    setHasError(false)
    setRetryToken((value) => value + 1)
  }

  return (
    <motion.figure
      className={`course-video${isGif ? ' course-video--gif' : ''}`}
      initial={{ opacity: 0, y: 32, rotate: isGif ? -1.8 : 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: isGif ? -1.8 : 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="course-video__screen">
        {!hasError ? (
          <>
            <div className="course-video__label" aria-hidden="true">MEDIA // CHAPTER 06</div>
            {isGif ? (
              <LazyImage src={video.src} alt={video.title} onError={() => setHasError(true)} />
            ) : (
              <LazyVideo
                key={retryToken}
                controls
                autoPlay={false}
                loop={false}
                preloadWhenNear="none"
                src={video.src}
                ariaLabel={video.title}
                onError={() => setHasError(true)}
              />
            )}
          </>
        ) : (
          <div className="course-video__empty">
            <span className="course-video__empty-icon" aria-hidden="true">▶</span>
            <strong>Не удалось загрузить видео</strong>
            <span>Проверь соединение и попробуй ещё раз.</span>
            <button type="button" onClick={retry}>Повторить</button>
          </div>
        )}
      </div>
      <figcaption className="course-video__caption">
        <div>
          <strong>{video.title}</strong>
          {video.description && <span>{video.description}</span>}
        </div>
        {!isGif && <span className="course-video__format">{format} / HD</span>}
      </figcaption>
    </motion.figure>
  )
}
