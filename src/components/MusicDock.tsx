import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState, type CSSProperties } from 'react'
import { eras } from '../content/biography'
import { assetUrl } from '../utils/assetUrl'
import '../styles/music-polish.css'

const tracks = eras.map((era) => ({
  id: era.id,
  era: era.eyebrow,
  title: era.song?.title ?? `Песня главы · ${era.title}`,
  artist: era.song?.artist ?? 'добавим позже',
  src: era.song?.src ? assetUrl(era.song.src) : '',
}))

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const remainder = Math.floor(seconds % 60)
  return `${minutes}:${String(remainder).padStart(2, '0')}`
}

export type MusicDockHandle = {
  selectTrack: (trackId: string) => void
  playTrack: (trackId: string) => void
}

export const MusicDock = forwardRef<MusicDockHandle>(function MusicDock(_, ref) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audio = useRef<HTMLAudioElement>(null)
  const requestedTrack = useRef<string | null>(null)
  const promptTimer = useRef<number | null>(null)
  const track = tracks[index]
  const hasAudio = Boolean(track.src)
  const showPlayPrompt = showPrompt && !playing && hasAudio
  const status = useMemo(() => hasAudio ? (playing ? 'играет' : 'пауза') : 'ожидает трек', [hasAudio, playing])
  const progress = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0

  const resetTimeline = () => {
    setCurrentTime(0)
    setDuration(0)
  }

  const releaseAudio = () => {
    const element = audio.current
    if (!element) return
    element.pause()
    element.removeAttribute('src')
    element.load()
    resetTimeline()
  }

  const next = () => {
    releaseAudio()
    setPlaying(false)
    setShowPrompt(false)
    setIndex((i) => (i + 1) % tracks.length)
  }

  const prev = () => {
    releaseAudio()
    setPlaying(false)
    setShowPrompt(false)
    setIndex((i) => (i - 1 + tracks.length) % tracks.length)
  }

  const playCurrent = async () => {
    if (!hasAudio || !audio.current) return
    if (audio.current.getAttribute('src') !== track.src) {
      audio.current.src = track.src
      audio.current.load()
    }
    try {
      await audio.current.play()
      setPlaying(true)
      setShowPrompt(false)
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
    releaseAudio()
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
    releaseAudio()
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

  useEffect(() => () => {
    if (promptTimer.current !== null) window.clearTimeout(promptTimer.current)
  }, [])

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
    <div
      className={`music-dock${showPlayPrompt ? ' music-dock--prompt' : ''}${playing ? ' is-playing' : ''}`}
      style={{ '--music-progress': `${progress}%` } as CSSProperties}
      data-track={track.id}
    >
      <audio
        ref={audio}
        preload="none"
        onEnded={next}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime || 0)}
        onLoadedMetadata={(event) => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)}
        onDurationChange={(event) => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)}
      />
      <button onClick={prev} aria-label="Предыдущий трек">‹</button>
      <button
        className={`music-dock__play${showPlayPrompt ? ' music-dock__play--prompt' : ''}`}
        onClick={toggle}
        aria-label={showPlayPrompt ? 'Включить музыку главы' : playing ? 'Поставить музыку на паузу' : 'Воспроизвести музыку'}
      >
        <span className="music-dock__play-icon" aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
        {showPlayPrompt && <span className="music-dock__prompt-label">Включить музыку главы</span>}
      </button>
      <div className="music-dock__meta">
        <div className="music-dock__status-row">
          <span>{track.era} · {status}</span>
          <div className="music-dock__eq" aria-hidden="true"><i /><i /><i /><i /></div>
        </div>
        <strong>{track.title}</strong>
        <small>{track.artist}</small>
      </div>
      <button onClick={next} aria-label="Следующий трек">›</button>
      <div className="music-dock__timeline" aria-hidden="true" />
      <div className="music-dock__time" aria-hidden="true">{formatTime(currentTime)} / {formatTime(duration)}</div>
    </div>
  )
})
