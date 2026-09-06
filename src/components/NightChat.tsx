import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import { TikTokChatScene } from './TikTokChatScene'
import '../styles/tiktok-chat.css'

export function NightChat() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [activeStage, setActiveStage] = useState(reduceMotion ? 5 : 0)
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ['start start', 'end end'] })
  const dawnOpacity = useTransform(scrollYProgress, [0, 0.68, 1], [0, 0.25, 0.78])
  const skyShift = useTransform(scrollYProgress, [0, 1], ['#050611', '#18223b'])

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = reduceMotion ? 5 : Math.min(5, Math.floor(value * 6))
    setActiveStage((current) => current === next ? current : next)
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
        <div className="night-chat__phone"><TikTokChatScene activeStage={activeStage} /></div>
        <div className="night-chat__context night-chat__context--arina">
          <span>ARINA</span>
          <p>друзья из Советского уже спят</p>
        </div>
        <div className="night-chat__note">время — художественная шкала той ночи</div>
      </motion.div>
    </div>
  )
}
