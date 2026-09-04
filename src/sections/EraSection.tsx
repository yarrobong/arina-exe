import { CourseVideo } from '../components/CourseVideo'
import { ScrollaroidGallery } from '../components/ScrollaroidGallery'
import { StyleAnomaly } from '../components/StyleAnomaly'
import type { Era } from '../content/types'

export function EraSection({ era, onPlay, anchorId = era.id }: { era: Era; onPlay: (trackId: string) => void; anchorId?: string | null }) {
  const galleryPhotos = era.photos.filter((photo) => photo.src !== '/media/school/5-9/brows.webp')

  return (
    <section className="era-section" id={anchorId ?? undefined}>
      <div className="era-section__topline">
        <span>{era.eyebrow}</span>
        <button
          className="era-section__play"
          type="button"
          onClick={() => onPlay(era.id)}
          aria-label={`Воспроизвести песню: ${era.song.title}`}
        >
          <span aria-hidden="true">▶</span>
        </button>
      </div>
      <div className="era-section__years">{era.years}</div>
      <h2>{era.title}</h2>
      <p className="era-section__story">{era.story}</p>
      {era.id === 'school-5-9' && (
        <StyleAnomaly
          title="GRAPHIC BROWS"
          period="7 класс"
          severity="CRITICAL"
          image="/media/school/5-9/brows.webp"
          caption="Архив модных решений"
        />
      )}
      {era.video && <CourseVideo video={era.video} />}
      {galleryPhotos.length > 0 && (
        <ScrollaroidGallery photos={galleryPhotos} label={era.title} />
      )}
    </section>
  )
}
