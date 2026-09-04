import { PersonArchiveCard } from '../components/PersonArchiveCard'
import { SectionHeading } from '../components/SectionHeading'
import { friends } from '../content/people'
import type { PersonCategory } from '../content/types'
import '../styles/people-archive.css'

const categoryOrder: PersonCategory[] = ['FAMILY', 'SCHOOL', 'FRIEND', 'RELATIONSHIP']

export function Friends({ anchorId = 'friends' }: { anchorId?: string | null }) {
  const counts = friends.reduce<Record<PersonCategory, number>>((acc, friend) => {
    acc[friend.category] += 1
    return acc
  }, { FAMILY: 0, SCHOOL: 0, FRIEND: 0, RELATIONSHIP: 0 })

  return (
    <section className="section-shell people-archive" id={anchorId ?? undefined}>
      <SectionHeading
        eyebrow="People folder"
        title="Люди рядом"
        note="Фото, видео и имена — без длинных биографий. Нажми +, чтобы открыть архивную карточку."
      />

      <div className="people-archive__summary" aria-label="Группы людей в архиве">
        <span>{String(friends.length).padStart(2, '0')} PEOPLE</span>
        {categoryOrder.filter((category) => counts[category] > 0).map((category) => (
          <span key={category}>{counts[category]} {category}</span>
        ))}
      </div>

      <div className="people-grid people-grid--archive">
        {friends.map((friend, index) => (
          <PersonArchiveCard person={friend} index={index} total={friends.length} key={friend.name} />
        ))}
      </div>
    </section>
  )
}
