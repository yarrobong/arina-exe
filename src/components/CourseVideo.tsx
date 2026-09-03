import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import type { Video } from '../content/types'

export function CourseVideo({ video }: { video: Video }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasError, setHasError] = useState(false)
  const isGif = video.kind === 'gif'

  const retry = () => {
    setHasError(false)
    videoRef.current?.load()
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
              <img src={video.src} alt={video.title} onError={() => setHasError(true)} />
            ) : (
              <video
                ref={videoRef}
                controls
                playsInline
                preload="metadata"
                onError={() => setHasError(true)}
                aria-label={video.title}
              >
                <source src={video.src} type="video/mp4" />
                Ваш браузер не поддерживает воспроизведение видео.
              </video>
            )}
          </>
        ) : (
          <div className="course-video__empty">
            <span className="course-video__empty-icon" aria-hidden="true">▶</span>
            <strong>Видео скоро загрузится</strong>
            <span>Добавь файл в <code>{video.src}</code></span>
            <button type="button" onClick={retry}>Проверить снова</button>
          </div>
        )}
      </div>
      <figcaption className="course-video__caption">
        <div>
          <strong>{video.title}</strong>
          {video.description && <span>{video.description}</span>}
        </div>
        {!isGif && <span className="course-video__format">MP4 / HD</span>}
      </figcaption>
    </motion.figure>
  )
}
