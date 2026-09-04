import { SectionHeading } from '../components/SectionHeading'

export function Future({ anchorId = 'future' }: { anchorId?: string | null }) {
  return (
    <section className="section-shell future content-visibility-section" id={anchorId ?? undefined}>
      <SectionHeading eyebrow="Next release" title="Что дальше?" />
      <article className="future-card">
        <span>версия Арины</span>
        <h3>Через 5–10 лет</h3>
        <p>Текст Арина напишет сама. Здесь будет не список целей, а её собственное ощущение будущей жизни.</p>
      </article>
      <article className="future-card future-card--yarik">
        <span>версия Ярика</span>
        <h3>Прогноз</h3>
        <p>Успешная бизнес-леди, которая всё так же любит пиво и Ярика.</p>
      </article>
    </section>
  )
}
