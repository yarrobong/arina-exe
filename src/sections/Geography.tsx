import { SectionHeading } from '../components/SectionHeading'
import { LifeMap } from '../components/LifeMap'

export function Geography({ anchorId = 'geography' }: { anchorId?: string | null }) {
  return (
    <section className="section-shell geography" id={anchorId ?? undefined}>
      <SectionHeading eyebrow="География Арины" title="Карта воспоминаний" note="Четыре точки, из которых сложилась одна история. Листай — маршрут поведёт тебя от самого начала к новой главе." />
      <LifeMap />
    </section>
  )
}
