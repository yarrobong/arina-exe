import { useEffect, useRef } from 'react'
import { TopNav } from './components/TopNav'
import { MusicDock, type MusicDockHandle } from './components/MusicDock'
import { eras } from './content/biography'
import { Hero } from './sections/Hero'
import { EraSection } from './sections/EraSection'
import { Geography } from './sections/Geography'
import { Evolution } from './sections/Evolution'
import { Friends } from './sections/Friends'
import { Relationship } from './sections/Relationship'
import { Facts } from './sections/Facts'
import { Inventory } from './sections/Inventory'
import { Compromat } from './sections/Compromat'
import { Future } from './sections/Future'
import { SportArchive } from './sections/SportArchive'

export default function App() {
  const musicDock = useRef<MusicDockHandle>(null)
  const playChapter = (trackId: string) => musicDock.current?.playTrack(trackId)

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.era-section'))
    if (sections.length === 0) return

    const visibility = new Map<Element, number>()
    let activeChapter: string | null = null
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibility.set(entry.target, entry.intersectionRatio)
        else visibility.delete(entry.target)
      })

      const current = sections
        .filter((section) => visibility.has(section))
        .sort((a, b) => (visibility.get(b) ?? 0) - (visibility.get(a) ?? 0))[0]

      if (current && current.id !== activeChapter) {
        activeChapter = current.id
        musicDock.current?.selectTrack(current.id)
      }
    }, { rootMargin: '-42% 0px -42% 0px', threshold: [0, 0.2, 0.5, 1] })

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="desktop-stage">
      <main className="site-shell">
        <TopNav />
        <Hero />
        <EraSection era={eras[0]} onPlay={playChapter} />
        <Geography />
        <EraSection era={eras[1]} onPlay={playChapter} />
        <EraSection era={eras[2]} onPlay={playChapter} />
        <SportArchive />
        <Evolution />
        <EraSection era={eras[3]} onPlay={playChapter} />
        <section id="university">
          <EraSection era={eras[4]} onPlay={playChapter} />
          <EraSection era={eras[5]} onPlay={playChapter} />
        </section>
        <Friends />
        <Relationship />
        <Facts />
        <Inventory />
        <Compromat />
        <Future />
        <footer className="footer">ARINA.EXE · MEMORY ARCHIVE · 2007 → ∞</footer>
        <MusicDock ref={musicDock} />
      </main>
    </div>
  )
}
