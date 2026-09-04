import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { LazyImage } from './LazyImage'

export function OutfitScan() {
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  return (
    <div className="outfit-scan">
      <div className="outfit-scan__photo">
        <LazyImage src="/media/relationship/our-archive-15.webp" alt="Архивный кадр с розовыми джинсами" />
        <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
          {open ? 'CLOSE SCAN' : 'OUTFIT SCAN'}
        </button>
        <small>архивный кадр образа · дата не указана</small>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="outfit-scan__result"
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0 : 0.32 }}
          >
            <span>PINK JEANS</span>
            <p><strong>Arina:</strong> «Вау, нифига он на стиле»</p>
            <p><strong>Yarik:</strong> «Это были единственные чистые джинсы»</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
