import { motion } from 'motion/react'
import { evolution } from '../content/evolution'
import { SectionHeading } from '../components/SectionHeading'

export function Evolution() {
  return (
    <section className="section-shell" id="evolution">
      <SectionHeading eyebrow="Changelog" title="Эволюция Арины" note="Ключевые версии. Потом заменим на реальные фотографии почти по каждому возрасту." />
      <div className="version-list">
        {evolution.map((item, i) => (
          <motion.article key={item.version} className="version-card" initial={{ opacity: 0, x: i % 2 ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="version-card__photo">
              {item.photo && <img src={item.photo} alt={`Фото ${item.version}`} onError={(event) => { event.currentTarget.style.display = 'none' }} />}
            </div>
            <div>
              <span>{item.age}</span>
              <h3>{item.version}</h3>
              <strong>{item.title}</strong>
              <ul>{item.notes.map((note) => <li key={note}>+ {note}</li>)}</ul>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
