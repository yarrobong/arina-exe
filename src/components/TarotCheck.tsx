import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

export function TarotCheck() {
  const [opened, setOpened] = useState<boolean[]>([false, false, false])
  const reduceMotion = useReducedMotion()
  const complete = opened.every(Boolean)

  const openCard = (index: number) => {
    setOpened((current) => current.map((value, cardIndex) => cardIndex === index ? true : value))
  }

  return (
    <div className="tarot-check">
      <div className="tarot-check__status">
        <span>SAFETY CHECK</span>
        <div><small>destination:</small><strong>Ярик</strong></div>
        <div><small>status:</small><strong>{complete ? 'complete ✓' : 'pending'}</strong></div>
      </div>
      <div className="tarot-check__cards" aria-label="Открыть три карты проверки">
        {opened.map((isOpen, index) => (
          <button
            type="button"
            className={`tarot-card${isOpen ? ' is-open' : ''}`}
            key={index}
            onClick={() => openCard(index)}
            aria-label={`${isOpen ? 'Открыта' : 'Открыть'} карта ${index + 1}`}
            aria-pressed={isOpen}
          >
            <span className="tarot-card__inner">
              <span className="tarot-card__face tarot-card__back"><i>✦</i><small>CARD 0{index + 1}</small></span>
              <span className="tarot-card__face tarot-card__front"><i>✓</i><small>OPEN</small></span>
            </span>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {complete && (
          <motion.div
            className="tarot-check__result"
            initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: reduceMotion ? 0 : 0.45 }}
          >
            <span>CHECK COMPLETE</span>
            <strong>ехать можно</strong>
            <p>risk level: вроде норм</p>
            <small>Если что-то будет не так, Арина это почувствует и уедет.</small>
            <b>MEETUP CONFIRMED ✓</b>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
