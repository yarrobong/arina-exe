import { useState } from 'react'
import { SectionHeading } from '../components/SectionHeading'

export function Compromat() {
  const [open, setOpen] = useState(false)
  return (
    <section className="section-shell" id="compromat">
      <SectionHeading eyebrow="Restricted folder" title="Компромат" note="Открывается только после официального разрешения Арины." />
      <button className="compromat" type="button" onClick={() => setOpen(!open)}>
        <div className={open ? 'compromat__photo is-open' : 'compromat__photo'}>
          <img src="/media/compromat/compromat.webp" alt="Компроматная фотография Арины" />
        </div>
        <strong>{open ? 'закрыть архив' : 'открыть архив'}</strong>
      </button>
    </section>
  )
}
