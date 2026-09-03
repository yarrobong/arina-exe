import { MediaFrame } from '../components/MediaFrame'
import { CourseVideo } from '../components/CourseVideo'
import type { Era } from '../content/types'

export function EraSection({ era, onPlay }: { era: Era; onPlay: (trackId: string) => void }) {
  return (
    <section className="era-section" id={era.id}>
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
      {era.video && <CourseVideo video={era.video} />}
      {era.photos.length > 0 && (
        <div className="photo-stack">
          {era.photos.map((photo, i) => <MediaFrame key={photo.src} {...photo} tilt={i % 2 === 0 ? -1.8 : 1.4} />)}
        </div>
      )}
    </section>
  )
}
