import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { useRef, useState } from 'react'
import { LazyImage } from './LazyImage'

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
        <div className="theater-map" role="img" aria-label="Реальная схема зала оперы и балета с ложами и рядами">
          <LazyImage src="/media/opera-ballet-map.svg" alt="Схема зала оперы и балета" />
          <svg className="theater-map__overlay" viewBox="0 0 100 100" aria-hidden="true">
            <motion.path
              d="M80 80 C68 61 47 45 23 23"
              fill="none"
              stroke="#ff4fa3"
              strokeWidth="0.7"
              strokeDasharray="2 2.5"
              pathLength={1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: upgraded ? 1 : 0, opacity: upgraded ? 0.65 : 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.65 }}
            />
            <motion.circle
              r="3"
              fill="#ff4fa3"
              initial={false}
              animate={{ cx: upgraded ? 23 : 80, cy: upgraded ? 23 : 80 }}
              transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
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
            <><span>INITIAL SEATS</span><strong>ПОЧТИ САМЫЙ КОНЕЦ</strong><small>листайте дальше · seat conflict detected</small></>
          )}
        </motion.div>
        <div className="theater-memory__caption"><span>ROMEO &amp; JULIET</span><p>первый совместный поход в театр · май</p></div>
      </div>
    </div>
  )
}
