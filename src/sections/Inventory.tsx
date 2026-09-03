import { inventory } from '../content/inventory'
import { SectionHeading } from '../components/SectionHeading'

export function Inventory() {
  return (
    <section className="section-shell" id="inventory">
      <SectionHeading eyebrow="Inventory" title="Вещи Арины" note="Эти карточки специально ждут фотографии вещей, которые вы снимете для сайта." />
      <div className="inventory-grid">
        {inventory.map((item) => (
          <article className="inventory-card" key={item.name}>
            <div className="inventory-card__photo">ITEM</div>
            <span>{item.rarity}</span>
            <h3>{item.name}</h3>
          </article>
        ))}
      </div>
    </section>
  )
}
