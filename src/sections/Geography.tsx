import { SectionHeading } from '../components/SectionHeading'
import { LifeMap } from '../components/LifeMap'

export function Geography() {
  return (
    <section className="section-shell geography" id="geography">
      <SectionHeading eyebrow="География Арины" title="Карта воспоминаний" note="Четыре точки, из которых сложилась одна история. Листай — маршрут поведёт тебя от самого начала к новой главе." />
      <LifeMap />
    </section>
  )
}
