import { friends } from '../content/people'
import { SectionHeading } from '../components/SectionHeading'

export function Friends() {
  return (
    <section className="section-shell" id="friends">
      <SectionHeading eyebrow="People folder" title="Люди рядом" note="Только фото + имя. Без лишних биографий." />
      <div className="people-grid">
        {friends.map((friend) => (
          <article className="person-card" key={friend.name}>
            <div className="person-card__photo">
              {friend.photo && <img src={friend.photo} alt={`Фото: ${friend.name}`} onError={(event) => { event.currentTarget.style.display = 'none' }} />}
            </div>
            <strong>{friend.name}</strong>
          </article>
        ))}
      </div>
    </section>
  )
}
