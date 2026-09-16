import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { useRef, useState } from 'react'
import '../styles/theater-memory.css'

export function TheaterMemory() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const [upgraded, setUpgraded] = useState(false)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ['start center', 'end center'] })

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (value > 0.5 || reduceMotion) setUpgraded(true)
  })

  return (
    <div className="theater-memory" ref={sceneRef}>
      <div className="theater-memory__sticky">
        <div className="theater-memory__topline">
          <span>THEATER SEAT UPGRADE</span>
          <strong>{upgraded ? 'ROW 01' : 'BACK ROW'}</strong>
        </div>

        <div className="theater-seat-plan" role="img" aria-label="Упрощённая схема зала: места перемещаются с дальнего ряда на первый ряд">
          <div className="theater-seat-plan__chrome" aria-hidden="true">
            <span>OPERA HOUSE</span><i /><strong>SEAT MEMORY</strong>
          </div>

          <svg viewBox="0 0 320 230" aria-hidden="true">
            <path className="theater-seat-plan__stage" d="M103 18 Q160 2 217 18 L207 47 Q160 34 113 47 Z" />
            <text className="theater-seat-plan__stage-label" x="160" y="28">СЦЕНА</text>

            <path className="theater-seat-plan__row theater-seat-plan__row--front" d="M94 72 Q160 50 226 72" />
            <path className="theater-seat-plan__row" d="M72 103 Q160 72 248 103" />
            <path className="theater-seat-plan__row" d="M51 136 Q160 98 269 136" />
            <path className="theater-seat-plan__row" d="M35 170 Q160 126 285 170" />
            <path className="theater-seat-plan__row" d="M24 203 Q160 154 296 203" />

            <motion.path
              className="theater-seat-plan__route"
              d="M250 193 C235 165 217 135 193 107 C179 91 168 80 160 69"
              pathLength={1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: upgraded ? 1 : 0, opacity: upgraded ? 0.82 : 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.circle
              className="theater-seat-plan__seat-ring"
              r="10"
              initial={false}
              animate={{ cx: upgraded ? 160 : 250, cy: upgraded ? 69 : 193, opacity: upgraded ? 0.8 : 0.45 }}
              transition={{ duration: reduceMotion ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.circle
              className="theater-seat-plan__seat"
              r="5"
              initial={false}
              animate={{ cx: upgraded ? 160 : 250, cy: upgraded ? 69 : 193 }}
              transition={{ duration: reduceMotion ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>

          <div className="theater-seat-plan__labels" aria-hidden="true">
            <span className={`theater-seat-plan__label${!upgraded ? ' is-active' : ''}`}><i />ПОЧТИ КОНЕЦ ЗАЛА</span>
            <span className={`theater-seat-plan__label${upgraded ? ' is-active' : ''}`}><i />ПЕРВЫЙ РЯД</span>
          </div>
        </div>

        <motion.div
          className="theater-memory__status"
          key={upgraded ? 'upgraded' : 'conflict'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {upgraded ? (
            <><span>UNEXPECTED UPGRADE ✦</span><strong>ПЕРВЫЙ РЯД</strong><small>≈ 10 000 ₽</small></>
          ) : (
            <><span>INITIAL SEATS</span><strong>ПОЧТИ САМЫЙ КОНЕЦ</strong><small>листайте дальше · места изменились</small></>
          )}
        </motion.div>
        <div className="theater-memory__caption"><span>ROMEO &amp; JULIET</span><p>первый совместный поход в театр · май</p></div>
      </div>
    </div>
  )
}
