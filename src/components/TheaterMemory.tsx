import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { useRef, useState } from 'react'

const rows = [82, 108, 134, 160, 186, 212, 238]

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
        <svg className="theater-map" viewBox="0 0 356 270" role="img" aria-label={upgraded ? 'Места переместились на первый ряд' : 'Исходные места почти в последнем ряду'}>
          <defs>
            <linearGradient id="stage-chrome" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f8f8ff" />
              <stop offset="0.48" stopColor="#777985" />
              <stop offset="1" stopColor="#ececf3" />
            </linearGradient>
            <filter id="pink-glow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <path className="theater-map__stage" d="M72 24 Q178 2 284 24 L272 52 Q178 36 84 52 Z" fill="url(#stage-chrome)" />
          <text x="178" y="31" textAnchor="middle">STAGE</text>
          {rows.map((y, rowIndex) => (
            <g key={y} className="theater-map__row">
              {Array.from({ length: 11 }, (_, seatIndex) => (
                <circle key={seatIndex} cx={58 + seatIndex * 24} cy={y} r="4" />
              ))}
              <text x="18" y={y + 3}>{String(rowIndex + 1).padStart(2, '0')}</text>
            </g>
          ))}
          <motion.path
            d="M298 238 C 280 180, 190 132, 64 82"
            fill="none"
            stroke="#ff4fa3"
            strokeWidth="1.5"
            strokeDasharray="4 5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: upgraded ? 1 : 0, opacity: upgraded ? 0.65 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.65 }}
          />
          <motion.circle
            r="8"
            fill="#ff4fa3"
            filter="url(#pink-glow)"
            initial={false}
            animate={{ cx: upgraded ? 64 : 298, cy: upgraded ? 82 : 238 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
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
