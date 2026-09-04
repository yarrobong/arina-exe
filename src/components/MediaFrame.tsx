import { useState } from 'react'
import { motion } from 'motion/react'
import { LazyImage } from './LazyImage'
import { LazyVideo } from './LazyVideo'

export function MediaFrame({ src, alt, caption, date, tilt = 0 }: { src: string; alt: string; caption?: string; date?: string; tilt?: number }) {
  const [broken, setBroken] = useState(false)
  const isVideo = src.toLowerCase().endsWith('.webm')
  return (
    <motion.figure
      className="media-frame"
      initial={{ opacity: 0, y: 32, rotate: tilt * 1.8 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="media-frame__image">
        {!broken ? (
          isVideo ? (
            <LazyVideo src={src} ariaLabel={alt} onError={() => setBroken(true)} />
          ) : (
            <LazyImage src={src} alt={alt} onError={() => setBroken(true)} />
          )
        ) : (
          <div className="media-placeholder" aria-label={alt}>
            <small>{src.split('/').at(-1)}</small>
          </div>
        )}
      </div>
      {(caption || date) && (
        <figcaption>
          <span>{caption}</span>
          {date && <time>{date}</time>}
        </figcaption>
      )}
    </motion.figure>
  )
}
