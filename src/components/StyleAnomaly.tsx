import { useEffect, useId, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'

export type StyleAnomalyProps = {
  image: string
  title: string
  period: string
  severity: string
  caption: string
}

export function StyleAnomaly({ image, title, period, severity, caption }: StyleAnomalyProps) {
  const sceneRef = useRef<HTMLElement>(null)
  const glitchTimerRef = useRef<number | null>(null)
  const retrieveTimerRef = useRef<number | null>(null)
  const evidenceId = `style-anomaly-evidence-${useId().replace(/:/g, '')}`
  const isInView = useInView(sceneRef, { once: true, amount: 0.3 })
  const shouldReduceMotion = useReducedMotion()
  const [isGlitching, setIsGlitching] = useState(false)
  const [isRetrieving, setIsRetrieving] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isInView) return

    if (shouldReduceMotion) return

    setIsGlitching(true)
    glitchTimerRef.current = window.setTimeout(() => setIsGlitching(false), 210)

    return () => {
      if (glitchTimerRef.current !== null) window.clearTimeout(glitchTimerRef.current)
      if (retrieveTimerRef.current !== null) window.clearTimeout(retrieveTimerRef.current)
    }
  }, [isInView, shouldReduceMotion])

  const retrieveEvidence = () => {
    if (isRetrieving) return

    if (isOpen) {
      setIsOpen(false)
      return
    }

    setIsRetrieving(true)
    retrieveTimerRef.current = window.setTimeout(() => {
      setIsRetrieving(false)
      setIsOpen(true)
    }, 420)
  }

  return (
    <motion.section
      ref={sceneRef}
      className={`style-anomaly${isGlitching ? ' is-glitching' : ''}${isOpen ? ' is-open' : ''}`}
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.62, ease: [0.22, 1, 0.36, 1] }}
      data-glitch={title}
    >
      <div className="style-anomaly__chrome" aria-hidden="true">
        <span>ARCHIVE SCANNER</span>
        <i />
        <span>07 / 100</span>
      </div>

      <div className="style-anomaly__header">
        <p className="style-anomaly__warning"><span aria-hidden="true">⚠</span> STYLE ANOMALY DETECTED</p>
        <span className="style-anomaly__dot" aria-label="Критическая аномалия" />
      </div>

      <h3 data-glitch={title}>{title}</h3>

      <dl className="style-anomaly__meta">
        <div><dt>severity:</dt><dd>{severity}</dd></div>
        <div><dt>period:</dt><dd>{period}</dd></div>
        <div><dt>confidence:</dt><dd>100%</dd></div>
        <div><dt>status:</dt><dd>archived evidence found</dd></div>
      </dl>

      <div className="style-anomaly__command-row">
        {!isOpen && (
          <button
            className="style-anomaly__command"
            type="button"
            onClick={retrieveEvidence}
            disabled={isRetrieving}
            aria-controls={evidenceId}
            aria-expanded={isOpen}
          >
            &gt; {isRetrieving ? 'ЗАГРУЗКА...' : 'ПОКАЗАТЬ УЛИКУ'}
          </button>
        )}
        {isOpen && (
          <div className="style-anomaly__loaded" role="status">
            УЛИКА ЗАГРУЖЕНА <span aria-hidden="true">✓</span>
            <button type="button" onClick={retrieveEvidence} aria-controls={evidenceId}>
              СКРЫТЬ УЛИКУ
            </button>
          </div>
        )}
      </div>

      <div className="style-anomaly__retrieving" aria-live="polite" aria-hidden={!isRetrieving}>
        <span>retrieving archived evidence...</span>
        <i><b style={{ transform: isRetrieving ? 'scaleX(1)' : 'scaleX(0)' }} /></i>
      </div>

      <figure className="style-anomaly__evidence" id={evidenceId}>
        <div className="style-anomaly__evidence-stage">
          <span className="style-anomaly__encrypted" aria-hidden={isOpen}>
            ENCRYPTED EVIDENCE
            <small>tap command to decode</small>
          </span>
          <motion.img
            src={image}
            alt={`${title}, ${period}`}
            loading="lazy"
            aria-hidden={!isOpen}
            initial={{ opacity: 0, scale: 1.08, filter: 'blur(16px) contrast(1.45) saturate(.65)', clipPath: 'inset(0 100% 0 0)' }}
            animate={isOpen
              ? { opacity: 1, scale: 1, filter: 'blur(0px) contrast(1) saturate(1)', clipPath: 'inset(0 0% 0 0)' }
              : { opacity: 0, scale: 1.08, filter: 'blur(16px) contrast(1.45) saturate(.65)', clipPath: 'inset(0 100% 0 0)' }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.82, ease: [0.22, 1, 0.36, 1] }}
          />
          <span className="style-anomaly__scanline" aria-hidden="true" />
        </div>
        <figcaption className={isOpen ? '' : 'is-hidden'} aria-hidden={!isOpen}>
          <strong>EVIDENCE CONFIRMED</strong>
          <span>{caption}</span>
          <small>status: пережито <i>·</i> damage: cosmetic only</small>
        </figcaption>
      </figure>
    </motion.section>
  )
}
