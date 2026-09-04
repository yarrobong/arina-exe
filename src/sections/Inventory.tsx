import { InventoryItemCard } from '../components/InventoryItemCard'
import { inventory } from '../content/inventory'
import { SectionHeading } from '../components/SectionHeading'
import '../styles/inventory-archive.css'

export function Inventory({ anchorId = 'inventory' }: { anchorId?: string | null }) {
  const linkedMemories = inventory.filter((item) => item.archiveLink).length

  return (
    <section className="section-shell content-visibility-section inventory-archive" id={anchorId ?? undefined}>
      <SectionHeading
        eyebrow="Inventory"
        title="Вещи Арины"
        note="Не просто список предметов: открывай карточки как игровые items. Реальные фото подхватятся из media, а один предмет уже связан с детством."
      />

      <div className="inventory-archive__summary" aria-label="Сводка инвентаря">
        <div><span>ITEMS</span><strong>{String(inventory.length).padStart(2, '0')}</strong></div>
        <i aria-hidden="true" />
        <div><span>MEMORY LINKS</span><strong>{String(linkedMemories).padStart(2, '0')}</strong></div>
        <i aria-hidden="true" />
        <div><span>STATUS</span><strong>LOADED</strong></div>
      </div>

      <div className="inventory-archive__grid">
        {inventory.map((item, index) => (
          <InventoryItemCard item={item} index={index} key={item.id} />
        ))}
      </div>

      <div className="inventory-archive__footer" aria-hidden="true">
        <span>ARINA.EXE / PERSONAL ITEMS</span>
        <i />
        <small>tap item to inspect</small>
      </div>
    </section>
  )
}
