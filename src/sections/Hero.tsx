import { motion } from 'motion/react'

const slides = [
  '/media/evolution/arina-18.webp',
  '/media/urfu/year-1-01.webp',
  '/media/relationship/our-photo-01.webp',
]

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__slides" aria-label="Фотографии Арины">
        {slides.map((src, index) => (
          <motion.div key={src} className="hero__slide" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * .08, duration: .7 }}>
            <img src={src} alt="Арина" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            <div className="hero__placeholder" aria-hidden="true" />
          </motion.div>
        ))}
      </div>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25, duration: .7 }}>Арина</motion.h1>
      <div className="hero__ticker"><span>MEMORY ARCHIVE ✦ 2007 → NOW ✦ Y2K BIOGRAPHY ✦ </span><span>MEMORY ARCHIVE ✦ 2007 → NOW ✦ Y2K BIOGRAPHY ✦ </span></div>
    </section>
  )
}
