import { relationshipMoments } from '../content/relationship'
import { SectionHeading } from '../components/SectionHeading'

const relationshipPhotos = [
  { src: '/media/relationship/our-photo-01.webp', alt: 'Наша фотография на скамейке' },
  { src: '/media/relationship/our-photo-02.webp', alt: 'Наша фотография на закате' },
  { src: '/media/relationship/our-photo-03.jpg', alt: 'Наша фотография у университета' },
  ...Array.from({ length: 16 }, (_, index) => ({
    src: `/media/relationship/our-archive-${String(index + 1).padStart(2, '0')}.webp`,
    alt: `Наша фотография из архива ${index + 1}`,
  })),
]

export function Relationship() {
  return (
    <section className="section-shell relationship" id="relationship">
      <SectionHeading eyebrow="Plot twist" title="А потом появился Ярик" note="Не отдельная история вместо биографии, а одна из её важных глав." />
      <div className="relationship__hero">
        <div className="relationship__photos" aria-label="Фотографии отношений, листайте в сторону">
          {relationshipPhotos.map((photo) => (
            <article className="relationship__photo" key={photo.src}>
              <img src={photo.src} alt={photo.alt} loading="lazy" />
            </article>
          ))}
        </div>
        <div className="relationship__swipe-hint" aria-hidden="true">свайп → следующий кадр</div>
        <div className="relationship__stamp">connected ✓</div>
      </div>
      <div className="memory-line">
        {relationshipMoments.map((moment) => (
          <article key={moment.title}>
            <span>{moment.date}</span>
            <h3>{moment.title}</h3>
            <p>{moment.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
