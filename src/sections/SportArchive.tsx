import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { MemoryFragmentTrigger } from '../components/MemoryFragments'
import '../styles/sport-polish.css'

const ROUTE_D = 'M 78 16 C 206 58 238 108 158 162 C 76 218 88 268 210 312 C 278 336 246 386 164 420 C 76 452 64 506 132 548 C 160 566 168 591 158 610'

const checkpoints = [
  { progress: 0.03, x: 78, y: 16, tag: 'START', label: 'детство' },
  { progress: 0.16, x: 158, y: 162, tag: 'TRAINING', label: 'лыжный спорт' },
  { progress: 0.29, x: 210, y: 312, tag: 'SPORT BUILD', label: 'active' },
  { progress: 0.42, x: 76, y: 452, tag: '12–14', label: 'спортсменка' },
]

function RouteCheckpoint({
  scrollYProgress,
  progress,
  x,
  y,
  tag,
  label,
}: (typeof checkpoints)[number] & { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [progress - 0.055, progress, progress + 0.045], [0.18, 1, 1])

  return (
    <motion.g style={{ opacity }}>
      <circle cx={x} cy={y} r="5" fill="#09090d" stroke="#f7b8d5" strokeWidth="1" />
      <circle cx={x} cy={y} r="1.7" fill="#ff4fa3" />
      <text className="sport-scene__checkpoint-tag" x={x + 10} y={y - 2}>{tag}</text>
      <text className="sport-scene__checkpoint-label" x={x + 10} y={y + 10}>{label}</text>
    </motion.g>
  )
}

export function SportArchive({ anchorId = 'sport' }: { anchorId?: string | null }) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const routeRef = useRef<SVGPathElement>(null)
  const [marker, setMarker] = useState({ x: 78, y: 16 })
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ['start 58px', 'end 100%'],
  })

  // The trail finishes first. Everything after 50% is the emotional aftermath.
  const routeProgress = useTransform(scrollYProgress, (value) => Math.min(1, Math.max(0, value / 0.5)))
  const routeLength = useTransform(routeProgress, [0, 1], [0, 1])
  const routeOpacity = useTransform(scrollYProgress, [0.48, 0.56, 0.76], [1, 0.7, 0.34])
  const quietOpacity = useTransform(scrollYProgress, [0.49, 0.525, 0.575, 0.61], [0, 0.92, 0.92, 0])

  // Beat 1: route ends. Beat 2: discontinued appears. Beat 3: current Arina. Beat 4: Arina 10.0.
  const statusOpacity = useTransform(scrollYProgress, [0.59, 0.625, 0.695, 0.735], [0, 1, 1, 0])
  const statusY = useTransform(scrollYProgress, [0.59, 0.625, 0.735], [12, 0, -8])
  const questionOpacity = useTransform(scrollYProgress, [0.745, 0.785, 1], [0, 1, 1])
  const questionY = useTransform(scrollYProgress, [0.745, 0.79], [15, 0])
  const quoteOpacity = useTransform(scrollYProgress, [0.805, 0.845, 1], [0, 1, 1])
  const quoteScale = useTransform(scrollYProgress, [0.805, 0.85], [0.96, 1])
  const responseOpacity = useTransform(scrollYProgress, [0.92, 0.965, 1], [0, 1, 1])
  const responseY = useTransform(scrollYProgress, [0.92, 0.965], [10, 0])
  const markerGlow = useTransform(scrollYProgress, [0.46, 0.51, 0.61, 0.76], [1, 1, 0.48, 0.24])
  const endPulseOpacity = useTransform(scrollYProgress, [0.485, 0.51, 0.565, 0.61], [0, 1, 0.45, 0])
  const endPulseScale = useTransform(scrollYProgress, [0.49, 0.58], [0.7, 2.2])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.44, 0.52], [1, 1, 0])

  useMotionValueEvent(routeProgress, 'change', (progress) => {
    const path = routeRef.current
    if (!path) return
    const point = path.getPointAtLength(path.getTotalLength() * progress)
    setMarker({ x: point.x, y: point.y })
  })

  useEffect(() => {
    const path = routeRef.current
    if (!path) return
    const point = path.getPointAtLength(0)
    setMarker({ x: point.x, y: point.y })
  }, [])

  return (
    <section className="sport-scene" id={anchorId ?? undefined}>
      <MemoryFragmentTrigger id="sport-build" placement="sport" />
      <motion.header
        className="sport-scene__intro"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="sport-scene__eyebrow">
          <span>SPORT ARCHIVE</span>
          <i aria-hidden="true" />
          <small>memory://sport</small>
        </div>
        <h2>Лыжный спорт</h2>
        <p>когда-то это была важная часть жизни</p>
      </motion.header>

      <div className="sport-scene__scroll" ref={sceneRef}>
        <div className="sport-scene__sticky">
          <div className="sport-scene__telemetry" aria-hidden="true">
            <span>ARINA.EXE / SPORT HISTORY</span>
            <span>SCROLL_01</span>
          </div>

          <div className="sport-scene__route-wrap">
            <motion.svg
              className="sport-scene__route"
              viewBox="0 0 320 620"
              role="img"
              aria-label="Стилизованная лыжная трасса Арины"
              style={{ opacity: reduceMotion ? 0.72 : routeOpacity }}
            >
              <defs>
                <filter id="sport-route-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <linearGradient id="sport-route-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f5f6ff" />
                  <stop offset="0.52" stopColor="#ff77b5" />
                  <stop offset="1" stopColor="#9898a8" />
                </linearGradient>
              </defs>
              <path className="sport-scene__route-ghost" d={ROUTE_D} pathLength="1" />
              <motion.path
                ref={routeRef}
                className="sport-scene__route-active"
                d={ROUTE_D}
                pathLength="1"
                style={{ pathLength: routeLength }}
              />
              <motion.g className="sport-scene__marker" transform={`translate(${marker.x} ${marker.y})`} style={{ opacity: markerGlow }}>
                <circle r="12" fill="rgba(255,79,163,.12)" filter="url(#sport-route-glow)" />
                <path d="M 0 -6 L 5 5 L 0 3 L -5 5 Z" fill="#f5f6ff" stroke="#ff4fa3" strokeWidth="1" />
              </motion.g>
              {checkpoints.map((checkpoint) => <RouteCheckpoint key={checkpoint.tag} {...checkpoint} scrollYProgress={scrollYProgress} />)}
              <circle className="sport-scene__route-end" cx="158" cy="610" r="4" />
              <motion.circle
                className="sport-scene__route-end-pulse"
                cx="158"
                cy="610"
                r="8"
                style={{ opacity: endPulseOpacity, scale: endPulseScale, transformOrigin: '158px 610px' }}
              />
            </motion.svg>

            <motion.div className="sport-scene__quiet" style={{ opacity: quietOpacity }} aria-hidden="true" />

            <motion.div className="sport-scene__status" style={{ opacity: statusOpacity, y: statusY }} aria-live="polite">
              <span>SPORT BUILD</span>
              <strong>discontinued</strong>
              <small>status: archived · route ended here</small>
            </motion.div>

            <motion.div className="sport-scene__dialog" style={{ opacity: questionOpacity, y: questionY }}>
              <span>Что бы Арина сказала себе в 10 лет?</span>
              <motion.p style={{ opacity: quoteOpacity, scale: quoteScale }}>«Не бросай спорт.»</motion.p>
              <motion.div className="sport-scene__response" style={{ opacity: responseOpacity, y: responseY }}>
                <small>ARINA 10.0 RESPONSE:</small>
                <p>«Ты чё не стала олимпийской чемпионкой?»</p>
              </motion.div>
            </motion.div>
          </div>

          <motion.div className="sport-scene__cue" style={{ opacity: cueOpacity }} aria-hidden="true"><i>↓</i> прокрути, чтобы продолжить</motion.div>
        </div>

        <div className="sport-scene__steps" aria-hidden="true">
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    </section>
  )
}
