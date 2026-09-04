import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { MemoryFragment } from '../content/memoryFragments'

type MemoryFragmentRevealProps = {
  active: MemoryFragment | null
  recoveredCount: number
  totalCount: number
  onDismiss: () => void
}

export function MemoryFragmentReveal({
  active,
  recoveredCount,
  totalCount,
  onDismiss,
}: MemoryFragmentRevealProps) {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="memory-fragment-reveal"
          role="dialog"
          aria-modal="true"
          aria-label="Найден фрагмент воспоминания"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
        >
          <motion.div
            className="memory-fragment-reveal__card"
            initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.96, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="memory-fragment-reveal__chrome">
              <span>MEMORY FRAGMENT</span>
              <i />
              <strong>{String(recoveredCount).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}</strong>
            </div>
            <div className="memory-fragment-reveal__symbol" aria-hidden="true">✦</div>
            <small>{active.label}</small>
            <p>{active.memory}</p>
            <div className="memory-fragment-reveal__source">{active.source}</div>
            <button type="button" onClick={onDismiss}>RECOVERED ✓</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
