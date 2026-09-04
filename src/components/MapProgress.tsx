type MapProgressProps = {
  active: number
  total: number
  labels: string[]
  onSelect: (index: number) => void
}

export function MapProgress({ active, total, labels, onSelect }: MapProgressProps) {
  const progress = total > 1 ? (active / (total - 1)) * 100 : 100

  return (
    <div className="map-progress" aria-label={`Пройдено ${active + 1} из ${total} этапов`}>
      <div className="map-progress__track" aria-hidden="true">
        <span className="map-progress__fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="map-progress__stops">
        {labels.map((label, index) => (
          <button
            type="button"
            key={label}
            className={index === active ? 'is-active' : index < active ? 'is-visited' : ''}
            aria-label={`Перейти к этапу ${index + 1}: ${label}`}
            aria-current={index === active ? 'step' : undefined}
            onClick={() => onSelect(index)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
