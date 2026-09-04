import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useRef } from 'react'

type RelationshipIntroProps = {
  connected: boolean
  onConnect: () => void
}

export function RelationshipIntro({ connected, onConnect }: RelationshipIntroProps) {
  const headingRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const acceptConnection = () => {
    onConnect()
    window.setTimeout(() => {
      headingRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' })
    }, reduceMotion ? 0 : 420)
  }

  return (
    <div className="relationship-intro">
      <motion.div
        className={`connection-card${connected ? ' is-connected' : ''}`}
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="connection-card__chrome">
          <span>ARINA.EXE / INCOMING</span>
          <i aria-hidden="true" />
          <span>MID NOVEMBER</span>
        </div>
        <p className="connection-card__signal">NEW CONNECTION DETECTED</p>
        <div className="connection-card__nodes" aria-label="Соединение Арины и Ярика">
          <div className="connection-card__person"><span>A</span><strong>ARINA</strong></div>
          <svg viewBox="0 0 120 34" aria-hidden="true">
            <motion.path
              d="M8 17 C 35 2, 85 32, 112 17"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0.3 }}
              animate={{ pathLength: connected ? 1 : 0.22, opacity: connected ? 1 : 0.45 }}
              transition={{ duration: reduceMotion ? 0 : 0.8, ease: 'easeInOut' }}
            />
            <motion.circle
              cx="60"
              cy="17"
              r="3"
              fill="currentColor"
              animate={{ opacity: connected ? [0.3, 1, 0.3] : 0.35, scale: connected ? [0.8, 1.35, 0.8] : 1 }}
              transition={{ duration: 1.5, repeat: connected && !reduceMotion ? Infinity : 0 }}
            />
          </svg>
          <div className="connection-card__person"><span>Y</span><strong>YARIK</strong></div>
        </div>
        <div className="connection-card__source"><span>source:</span><strong>Дайвинчик</strong></div>
        <button type="button" onClick={acceptConnection} disabled={connected}>
          {connected ? 'CONNECTED ✓' : 'ПРИНЯТЬ СОЕДИНЕНИЕ'}
        </button>
      </motion.div>

      <motion.div
        ref={headingRef}
        className="relationship-intro__heading"
        onViewportEnter={onConnect}
        viewport={{ once: true, amount: 0.55 }}
      >
        <AnimatePresence mode="wait">
          {connected && (
            <motion.div
              key="connected-heading"
              initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.65 }}
            >
              <span>CHAPTER UNLOCKED · RELATIONSHIP ARCHIVE</span>
              <h2>А потом появился Ярик</h2>
              <p>Не отдельная история вместо биографии, а одна из её важных глав — запись за записью, строго по времени.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
