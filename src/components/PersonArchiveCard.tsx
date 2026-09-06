import { useState } from 'react'
import type { Person } from '../content/types'
import { LazyImage } from './LazyImage'
import { LazyVideo } from './LazyVideo'

type PersonArchiveCardProps = {
  person: Person
}

const isVideoSource = (src?: string) => /\.(?:webm|mp4)(?:[?#].*)?$/i.test(src ?? '')

export function PersonArchiveCard({ person }: PersonArchiveCardProps) {
  const [mediaFailed, setMediaFailed] = useState(false)
  const isVideo = isVideoSource(person.photo)
  const hasMedia = Boolean(person.photo) && !mediaFailed
  const initial = person.name.trim().charAt(0).toUpperCase()

  return (
    <article
      className="person-archive-card"
      data-category={person.category}
    >
      <div className={`person-archive-card__media${isVideo ? ' is-video' : ''}${!hasMedia ? ' is-empty' : ''}`}>
        {hasMedia && isVideo ? (
          <LazyVideo
            src={person.photo ?? ''}
            ariaLabel={`Видео: ${person.name}`}
            preloadWhenNear="none"
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
          </div>
        )}

        <div className="person-archive-card__scan" aria-hidden="true" />
      </div>

      <div className="person-archive-card__footer">
        <div>
          <span className="person-archive-card__category">
            {person.category === 'FRIEND' ? 'friends' : person.category.toLowerCase()}
          </span>
          <strong>{person.name}</strong>
        </div>
      </div>

    </article>
  )
}
