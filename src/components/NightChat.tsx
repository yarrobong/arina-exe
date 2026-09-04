import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import { nightChatMoments } from '../content/relationship'

export function NightChat() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ['start start', 'end end'] })
  const dawnOpacity = useTransform(scrollYProgress, [0, 0.68, 1], [0, 0.25, 0.78])
  const skyShift = useTransform(scrollYProgress, [0, 1], ['#050611', '#18223b'])

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = reduceMotion ? nightChatMoments.length - 1 : Math.min(nightChatMoments.length - 1, Math.floor(value * nightChatMoments.length))
    setActiveIndex((current) => current === next ? current : next)
  })

  return (
    <div className="night-chat" ref={sceneRef}>
      <motion.div className="night-chat__sticky" style={{ backgroundColor: skyShift }}>
        <motion.div className="night-chat__dawn" style={{ opacity: dawnOpacity }} />
        <div className="night-chat__stars" aria-hidden="true" />
        <div className="night-chat__context night-chat__context--yarik">
          <span>YARIK</span>
          <p>день рождения Юли · второй этаж</p>
        </div>
        <div className="night-chat__phone">
          <div className="night-chat__statusbar">
            <strong>{nightChatMoments[activeIndex].time}</strong>
            <span>online · 42%</span>
          </div>
          <div className="night-chat__contact">
            <i />
            <div><strong>ARINA + YARIK</strong><span>both online</span></div>
          </div>
          <div className="night-chat__feed" aria-live="polite">
            {nightChatMoments.map((moment, index) => (
              <motion.div
                className={`night-chat__packet${index <= activeIndex ? ' is-visible' : ''}`}
                key={moment.time}
                animate={{ opacity: index <= activeIndex ? 1 : 0.12, y: index <= activeIndex ? 0 : 8 }}
                transition={{ duration: reduceMotion ? 0 : 0.35 }}
              >
                <time>{moment.time}</time>
                <span>{moment.activity}</span>
              </motion.div>
            ))}
          </div>
          <div className="night-chat__composer"><span>typing…</span><i>↑</i></div>
        </div>
        <div className="night-chat__context night-chat__context--arina">
          <span>ARINA</span>
          <p>друзья из Советского уже спят</p>
        </div>
        <div className="night-chat__note">время — художественная шкала той ночи</div>
      </motion.div>
    </div>
  )
}
