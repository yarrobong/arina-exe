import { PersonArchiveCard } from '../components/PersonArchiveCard'
import { SectionHeading } from '../components/SectionHeading'
import { friends } from '../content/people'
import '../styles/people-archive.css'

export function Friends({ anchorId = 'friends' }: { anchorId?: string | null }) {
  return (
    <section className="section-shell people-archive" id={anchorId ?? undefined}>
      <SectionHeading
        eyebrow="People folder"
        title="Люди рядом"
      />

      <div className="people-grid people-grid--archive">
        {friends.map((friend) => (
          <PersonArchiveCard person={friend} key={friend.name} />
        ))}
      </div>
    </section>
  )
}
