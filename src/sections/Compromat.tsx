import { useState } from 'react'
import { LazyImage } from '../components/LazyImage'
import { SectionHeading } from '../components/SectionHeading'

export function Compromat({ anchorId = 'compromat' }: { anchorId?: string | null }) {
  const [open, setOpen] = useState(false)
  return (
    <section className="section-shell" id={anchorId ?? undefined}>
      <SectionHeading eyebrow="Restricted folder" title="Компромат" note="Открывается только после официального разрешения Арины." />
      <button className="compromat" type="button" onClick={() => setOpen(!open)}>
        <div className={open ? 'compromat__photo is-open' : 'compromat__photo'}>
          <LazyImage src="/media/compromat/compromat.webp" alt="Компроматная фотография Арины" />
        </div>
        <strong>{open ? 'закрыть архив' : 'открыть архив'}</strong>
      </button>
    </section>
  )
}
