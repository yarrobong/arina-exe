import type { CSSProperties } from 'react'
import { SectionHeading } from '../components/SectionHeading'
import { facts, memeStats } from '../content/facts'
import { useNearViewport } from '../hooks/useNearViewport'

const statLevels = [92, 63, 47, 86, 36, 58]

export function Facts({ anchorId = 'facts' }: { anchorId?: string | null }) {
  const { ref, isNear } = useNearViewport<HTMLElement>({ rootMargin: '-8% 0px', threshold: 0.12 })

  return (
    <section
      ref={ref}
      className={`section-shell content-visibility-section facts-screen${isNear ? ' is-revealed' : ''}`}
      id={anchorId ?? undefined}
    >
      <SectionHeading eyebrow="System info" title="Арина в цифрах" />
      <div className="system-status-card" aria-hidden="true">
        <div className="system-status-card__chrome"><span>ARINA.EXE STATUS</span><i /><strong>ONLINE</strong></div>
      </div>
      <div className="facts-grid">
        {facts.map(([label, value]) => <div className="fact-card" key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </div>
      <div className="stats-panel">
        {memeStats.map(([label, value], index) => (
          <div className="stat-row" key={label}>
            <div><span>{label}</span><strong>{value}</strong></div>
            <div className="stat-bar">
              <i
                style={{
                  '--stat-value': `${statLevels[index]}%`,
                  '--stat-delay': `${index * 70}ms`,
                } as CSSProperties}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
