import { SectionHeading } from '../components/SectionHeading'
import { LifeMap } from '../components/LifeMap'

export function Geography() {
  return (
    <section className="section-shell" id="geography">
      <SectionHeading eyebrow="География Арины" title="Где жила" note="Карта уже рабочая. Точные точки домов, школы, садика и тренировок добавим после сбора адресов." />
      <LifeMap />
    </section>
  )
}
