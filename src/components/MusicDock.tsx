import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { eras } from '../content/biography'

const tracks = eras.map((era) => ({
  id: era.id,
  era: era.eyebrow,
  title: era.song?.title ?? `Песня главы · ${era.title}`,
  artist: era.song?.artist ?? 'добавим позже',
  src: era.song?.src ?? '',
}))

export type MusicDockHandle = {
  selectTrack: (trackId: string) => void
  playTrack: (trackId: string) => void
}

export const MusicDock = forwardRef<MusicDockHandle>(function MusicDock(_, ref) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const audio = useRef<HTMLAudioElement>(null)
  const requestedTrack = useRef<string | null>(null)
  const promptTimer = useRef<number | null>(null)
  const track = tracks[index]
  const hasAudio = Boolean(track.src)
  const showPlayPrompt = showPrompt && !playing && hasAudio
  const status = useMemo(() => hasAudio ? (playing ? 'играет' : 'пауза') : 'ожидает трек', [hasAudio, playing])

  const next = () => { audio.current?.pause(); setPlaying(false); setIndex((i) => (i + 1) % tracks.length) }
  const prev = () => { audio.current?.pause(); setPlaying(false); setIndex((i) => (i - 1 + tracks.length) % tracks.length) }

  const playCurrent = async () => {
    if (!hasAudio || !audio.current) return
    try {
      await audio.current.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
  }

  const selectTrack = (trackId: string) => {
    const nextIndex = tracks.findIndex((item) => item.id === trackId)
    if (nextIndex < 0) return

    const wasPlaying = playing
    if (nextIndex === index) {
      setShowPrompt(false)
      return
    }

    requestedTrack.current = wasPlaying ? trackId : null
    audio.current?.pause()
    setPlaying(false)
    setIndex(nextIndex)
    setShowPrompt(!wasPlaying)

    if (promptTimer.current !== null) window.clearTimeout(promptTimer.current)
    if (!wasPlaying) {
      promptTimer.current = window.setTimeout(() => setShowPrompt(false), 9000)
    }
  }

  const playTrack = (trackId: string) => {
    const nextIndex = tracks.findIndex((item) => item.id === trackId)
    if (nextIndex < 0) return

    requestedTrack.current = trackId
    audio.current?.pause()
    setPlaying(false)
    setShowPrompt(false)
    setIndex(nextIndex)
    if (nextIndex === index) void playCurrent()
  }

  useImperativeHandle(ref, () => ({ selectTrack, playTrack }), [hasAudio, index, playing])

  useEffect(() => {
    if (requestedTrack.current !== track.id) return
    requestedTrack.current = null
    void playCurrent()
  }, [index, track.id])

  const toggle = async () => {
    if (!hasAudio || !audio.current) return
    if (playing) {
      audio.current.pause()
      setPlaying(false)
    } else {
      await playCurrent()
    }
  }

  return (
    <div className={`music-dock${showPlayPrompt ? ' music-dock--prompt' : ''}`}>
      <audio ref={audio} src={track.src || undefined} onEnded={next} />
      <button onClick={prev} aria-label="Предыдущий трек">‹</button>
      <button
        className={`music-dock__play${showPlayPrompt ? ' music-dock__play--prompt' : ''}`}
        onClick={toggle}
        aria-label={showPlayPrompt ? 'Включить музыку главы' : 'Воспроизвести или поставить на паузу'}
      >
        <span className="music-dock__play-icon" aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
        {showPlayPrompt && <span className="music-dock__prompt-label">Включить музыку главы</span>}
      </button>
      <div className="music-dock__meta">
        <span>{track.era} · {status}</span>
        <strong>{track.title}</strong>
        <small>{track.artist}</small>
      </div>
      <button onClick={next} aria-label="Следующий трек">›</button>
    </div>
  )
})
