import { facts, memeStats } from '../content/facts'
import { SectionHeading } from '../components/SectionHeading'

export function Facts({ anchorId = 'facts' }: { anchorId?: string | null }) {
  return (
    <section className="section-shell content-visibility-section" id={anchorId ?? undefined}>
      <SectionHeading eyebrow="System info" title="Арина в цифрах" />
      <div className="facts-grid">
        {facts.map(([label, value]) => <div className="fact-card" key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </div>
      <div className="stats-panel">
        {memeStats.map(([label, value], index) => (
          <div className="stat-row" key={label}>
            <div><span>{label}</span><strong>{value}</strong></div>
            <div className="stat-bar"><i style={{ width: `${[92, 63, 47, 86, 36, 58][index]}%` }} /></div>
          </div>
        ))}
      </div>
    </section>
  )
}
