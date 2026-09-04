import { friends } from '../content/people'
import { LazyImage } from '../components/LazyImage'
import { SectionHeading } from '../components/SectionHeading'
import { LazyVideo } from '../components/LazyVideo'

export function Friends({ anchorId = 'friends' }: { anchorId?: string | null }) {
  return (
    <section className="section-shell" id={anchorId ?? undefined}>
      <SectionHeading eyebrow="People folder" title="Люди рядом" note="Только фото + имя. Без лишних биографий." />
      <div className="people-grid">
        {friends.map((friend) => (
          <article className="person-card" key={friend.name}>
            <div className="person-card__photo">
              {friend.photo?.toLowerCase().endsWith('.webm') ? (
                <LazyVideo src={friend.photo} ariaLabel={`Видео: ${friend.name}`} />
              ) : friend.photo ? (
                <LazyImage src={friend.photo} alt={`Фото: ${friend.name}`} onError={(event) => { event.currentTarget.style.display = 'none' }} />
              ) : null}
            </div>
            <strong>{friend.name}</strong>
          </article>
        ))}
      </div>
    </section>
  )
}
