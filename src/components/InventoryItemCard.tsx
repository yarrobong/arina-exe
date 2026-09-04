import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { createPortal } from 'react-dom'
import { useEffect, useRef, useState } from 'react'
import type { InventoryItem } from '../content/inventory'
import { LazyImage } from './LazyImage'

type InventoryItemCardProps = {
  item: InventoryItem
  index: number
}

function ItemMedia({ item, expanded = false }: { item: InventoryItem; expanded?: boolean }) {
  const [failed, setFailed] = useState(false)
  const hasPhoto = Boolean(item.photo) && !failed

  return (
    <div className={`inventory-item-media${expanded ? ' is-expanded' : ''}${!hasPhoto ? ' is-placeholder' : ''}`}>
      {hasPhoto && item.photo ? (
        <LazyImage
          src={item.photo}
          alt={`Предмет: ${item.name}`}
          rootMargin={expanded ? '1200px 200px' : '500px 100px'}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="inventory-item-media__placeholder" aria-label={`Фото предмета ${item.name} пока не добавлено`}>
          <span>{item.kind}</span>
          <strong>{String(item.slot).padStart(2, '0')}</strong>
          <small>MEDIA PENDING</small>
        </div>
      )}
      <div className="inventory-item-media__scan" aria-hidden="true" />
      <div className="inventory-item-media__label" aria-hidden="true">
        <span>ITEM_{String(item.slot).padStart(2, '0')}</span>
        <small>{hasPhoto ? 'MEDIA FOUND' : 'AWAITING PHOTO'}</small>
      </div>
    </div>
  )
}

function ItemInspect({ item, onClose }: { item: InventoryItem; onClose: () => void }) {
  const reduceMotion = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return createPortal(
    <motion.div
      className="inventory-inspect"
      data-rarity={item.rarity.toLowerCase()}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
      role="presentation"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <motion.div
        className="inventory-inspect__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`inventory-title-${item.id}`}
        initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: reduceMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="inventory-inspect__chrome">
          <span>ARINA.EXE / ITEM INSPECT</span>
          <i aria-hidden="true" />
          <span>{String(item.slot).padStart(2, '0')} / 04</span>
        </div>

        <button ref={closeRef} className="inventory-inspect__close" type="button" onClick={onClose} aria-label="Закрыть предмет">
          ×
        </button>

        <ItemMedia item={item} expanded />

        <div className="inventory-inspect__identity">
          <span>{item.kind}</span>
          <h3 id={`inventory-title-${item.id}`}>{item.name}</h3>
          <strong>{item.rarity}</strong>
        </div>

        <div className="inventory-inspect__specs">
          <div><span>RARITY</span><strong>{item.rarity.toUpperCase()}</strong></div>
          <div><span>STATUS</span><strong>{item.status}</strong></div>
          <div><span>ORIGIN</span><strong>{item.origin ?? 'не подписано'}</strong></div>
        </div>

        <div className={`inventory-inspect__memory${item.memory ? ' has-memory' : ''}`}>
          <span>{item.memory ? 'MEMORY ATTACHED' : 'MEMORY SLOT'}</span>
          <p>{item.memory ?? 'Фотография и история этого предмета появятся после предметной съёмки.'}</p>
        </div>

        {item.archiveLink && (
          <a className="inventory-inspect__archive-link" href={item.archiveLink} onClick={onClose}>
            <span>CONNECTED MEMORY</span>
            <strong>{item.archiveLabel ?? 'ОТКРЫТЬ АРХИВ'} ↗</strong>
          </a>
        )}
      </motion.div>
    </motion.div>,
    document.body,
  )
}

export function InventoryItemCard({ item, index }: InventoryItemCardProps) {
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.article
        className="inventory-item-card"
        data-rarity={item.rarity.toLowerCase()}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.28 }}
        transition={{ duration: reduceMotion ? 0 : 0.42, delay: reduceMotion ? 0 : index * 0.045 }}
      >
        <button className="inventory-item-card__open" type="button" onClick={() => setOpen(true)} aria-label={`Открыть предмет ${item.name}`}>
          <div className="inventory-item-card__chrome">
            <span>ITEM_{String(item.slot).padStart(2, '0')}</span>
            <i aria-hidden="true" />
            <span>{item.status}</span>
          </div>

          <ItemMedia item={item} />

          <div className="inventory-item-card__meta">
            <span>{item.rarity}</span>
            <h3>{item.name}</h3>
            <div><small>{item.kind}</small><strong>INSPECT +</strong></div>
          </div>
        </button>
      </motion.article>

      <AnimatePresence>{open && <ItemInspect item={item} onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  )
}
