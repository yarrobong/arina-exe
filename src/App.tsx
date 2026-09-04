import { lazy, useEffect, useRef } from 'react'
import { LazySection } from './components/LazySection'
import { MemoryFragmentProvider, MemoryFragmentSummary } from './components/MemoryFragments'
import { MusicDock, type MusicDockHandle } from './components/MusicDock'
import { TopNav } from './components/TopNav'
import { eras } from './content/biography'
import { Hero } from './sections/Hero'

const DeferredEraSection = lazy(() => import('./sections/EraSection').then((module) => ({ default: module.EraSection })))
const DeferredGeography = lazy(() => import('./sections/Geography').then((module) => ({ default: module.Geography })))
const DeferredSportArchive = lazy(() => import('./sections/SportArchive').then((module) => ({ default: module.SportArchive })))
const DeferredEvolution = lazy(() => import('./sections/Evolution').then((module) => ({ default: module.Evolution })))
const DeferredFriends = lazy(() => import('./sections/Friends').then((module) => ({ default: module.Friends })))
const DeferredRelationship = lazy(() => import('./sections/Relationship').then((module) => ({ default: module.Relationship })))
const DeferredFacts = lazy(() => import('./sections/Facts').then((module) => ({ default: module.Facts })))
const DeferredInventory = lazy(() => import('./sections/Inventory').then((module) => ({ default: module.Inventory })))
const DeferredCompromat = lazy(() => import('./sections/Compromat').then((module) => ({ default: module.Compromat })))
const DeferredFuture = lazy(() => import('./sections/Future').then((module) => ({ default: module.Future })))

const eraMinHeight = (photoCount: number, extra = '300px') => `calc(${Math.max(photoCount, 1)} * 60svh + ${extra})`

export default function App() {
  const musicDock = useRef<MusicDockHandle>(null)
  const playChapter = (trackId: string) => musicDock.current?.playTrack(trackId)

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-music-chapter]'))
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
      const chapter = current?.dataset.musicChapter

      if (chapter && chapter !== activeChapter) {
        activeChapter = chapter
        musicDock.current?.selectTrack(chapter)
      }
    }, { rootMargin: '-42% 0px -42% 0px', threshold: [0, 0.2, 0.5, 1] })

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <MemoryFragmentProvider>
      <div className="desktop-stage">
        <main className="site-shell">
          <TopNav />
          <Hero />

          <LazySection id={eras[0].id} musicChapter={eras[0].id} minHeight={eraMinHeight(eras[0].photos.length)}>
            <DeferredEraSection era={eras[0]} onPlay={playChapter} anchorId={null} />
          </LazySection>
          <LazySection id="geography" minHeight="190svh">
            <DeferredGeography anchorId={null} />
          </LazySection>
          <LazySection id={eras[1].id} musicChapter={eras[1].id} minHeight={eraMinHeight(eras[1].photos.length)}>
            <DeferredEraSection era={eras[1]} onPlay={playChapter} anchorId={null} />
          </LazySection>
          <LazySection id={eras[2].id} musicChapter={eras[2].id} minHeight={eraMinHeight(eras[2].photos.length, '900px')}>
            <DeferredEraSection era={eras[2]} onPlay={playChapter} anchorId={null} />
          </LazySection>
          <LazySection id="sport" minHeight="240svh">
            <DeferredSportArchive anchorId={null} />
          </LazySection>
          <LazySection id="evolution" minHeight="640px">
            <DeferredEvolution anchorId={null} />
          </LazySection>
          <LazySection id={eras[3].id} musicChapter={eras[3].id} minHeight={eraMinHeight(eras[3].photos.length)}>
            <DeferredEraSection era={eras[3]} onPlay={playChapter} anchorId={null} />
          </LazySection>

          <section className="university-anchor">
            <LazySection id="university" musicChapter={eras[4].id} minHeight={eraMinHeight(eras[4].photos.length)}>
              <DeferredEraSection era={eras[4]} onPlay={playChapter} anchorId={null} />
            </LazySection>
            <LazySection musicChapter={eras[5].id} minHeight={eraMinHeight(eras[5].photos.length)}>
              <DeferredEraSection era={eras[5]} onPlay={playChapter} anchorId={null} />
            </LazySection>
          </section>

          <LazySection id="friends" minHeight="1600px">
            <DeferredFriends anchorId={null} />
          </LazySection>
          <LazySection id="relationship" minHeight="1800px">
            <DeferredRelationship anchorId={null} />
          </LazySection>
          <LazySection id="facts" minHeight="560px">
            <DeferredFacts anchorId={null} />
          </LazySection>
          <LazySection id="inventory" minHeight="920px">
            <DeferredInventory anchorId={null} />
          </LazySection>
          <LazySection id="compromat" minHeight="540px">
            <DeferredCompromat anchorId={null} />
          </LazySection>
          <LazySection id="future" minHeight="520px">
            <DeferredFuture anchorId={null} />
          </LazySection>

          <MemoryFragmentSummary />
          <footer className="footer">ARINA.EXE · MEMORY ARCHIVE · 2007 → ∞</footer>
          <MusicDock ref={musicDock} />
        </main>
      </div>
    </MemoryFragmentProvider>
  )
}
