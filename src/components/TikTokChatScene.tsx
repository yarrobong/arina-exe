import { useState, type ReactNode } from 'react'
import { LazyImage } from './LazyImage'
import { LazyVideo } from './LazyVideo'

export type SharedVideoMessage = {
  poster: string
  videoSrc?: string
  overlayText?: string
  author: string
  authorAvatar?: string
  isPhoto?: boolean
}

type IconProps = { className?: string }

function BackIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m15 4-8 8 8 8" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function MoreIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 28 10" fill="currentColor" aria-hidden="true"><circle cx="4" cy="5" r="2.1" /><circle cx="14" cy="5" r="2.1" /><circle cx="24" cy="5" r="2.1" /></svg>
}

function StreakIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 20 24" fill="none" aria-hidden="true"><path d="M11.7 1.5c.5 4.6-3.6 5.3-3.3 9.2.2 1.7 1.5 2.5 2.4 3.2-.1-2.1 1.1-3.6 2.6-4.7 1.5 2.1 3.5 4.3 3.5 7.3a6.9 6.9 0 1 1-13.8 0c0-3.1 1.8-5.4 3.8-7.5-.2 2 0 3.3.8 4.2-.7-4.3 1.3-8.3 4-11.7Z" fill="currentColor" /></svg>
}

function SignalIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 22 18" fill="currentColor" aria-hidden="true"><path d="M1 17h3V8H1v9Zm6 0h3V5H7v12Zm6 0h3V2h-3v15Zm6 0h3V0h-3v17Z" /></svg>
}

function WifiIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 25 18" fill="none" aria-hidden="true"><path d="M2 6.3a15.5 15.5 0 0 1 21 0M5.8 10.2a10 10 0 0 1 13.4 0M10.1 14a4.6 4.6 0 0 1 4.8 0" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /><circle cx="12.5" cy="16" r="1.3" fill="currentColor" /></svg>
}

function BatteryIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 31 16" fill="none" aria-hidden="true"><rect x=".8" y="1" width="26" height="14" rx="3.8" stroke="currentColor" strokeWidth="1.8" /><path d="M29 6v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M3.5 3.7h5.2v8.6H3.5z" fill="#f6ca2e" /></svg>
}

function ShareIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M6 18.5c0-5.7 4.3-9.4 12.7-9.4h2.2M15.2 4.5l6.5 4.8-6.5 5.3" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /><path d="M6 18.5c0 2.6 1.4 4.2 4.3 5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" /></svg>
}

function PlayIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 32 36" fill="currentColor" aria-hidden="true"><path d="M29 15.4c2.7 1.5 2.7 3.7 0 5.2L6.1 33.8C3.5 35.3 1 34 1 31V5c0-3 2.5-4.3 5.1-2.8L29 15.4Z" /></svg>
}

function DownIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 24 14" fill="none" aria-hidden="true"><path d="m3 2 9 9 9-9" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function StickerIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2.4" /><path d="M10.5 14.1c1.7-2.3 3.2-2.3 4.9 0m1.2 0c1.7-2.3 3.2-2.3 4.9 0M11 20.3c3.2 2.5 6.8 2.5 10 0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /><path d="M23 23v6l-3-2-3 2v-6" fill="currentColor" /></svg>
}

function MicIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 24 32" fill="none" aria-hidden="true"><rect x="7" y="1" width="10" height="20" rx="5" fill="currentColor" /><path d="M3.5 15.5a8.5 8.5 0 0 0 17 0M12 24v6M8 30h8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
}

function DoodleAvatar({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="m9 12 2.3-6 5 3.1L22 6l1.8 6.2c1.2 6.1-1 10.7-7.1 10.7S7.7 18.2 9 12Z" fill="#111" /><path d="M11 16c1.5 1 2.8 1 4.2 0m1.7 0c1.4 1 2.7 1 4.1 0M15 19.5c1.3.8 2.6.8 3.9 0" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" /><path d="m8 25-3 2m19-2 3 2" stroke="#111" strokeWidth="1.5" strokeLinecap="round" /></svg>
}

function PaperDoodle({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 54 48" fill="none" aria-hidden="true"><path d="M7 12c5-4 9-3 13 1l3-6 4 7c6-4 12-3 18 2" stroke="#111" strokeWidth="1.5" strokeLinecap="round" /><path d="M10 14 7 8l6 2 4-5 3 7m22 2 2-7 4 6 5-1-3 7" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="13" cy="20" r="1.6" fill="#e83d62" /><path d="M5 37c6-2 10-2 14 2m13-1c5-4 9-4 16-1" stroke="#8d8d8f" strokeWidth="1.4" strokeLinecap="round" /></svg>
}

function BearSticker({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 28 32" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="4" fill="#9b5e2a" /><circle cx="21" cy="7" r="4" fill="#9b5e2a" /><path d="M5 13c0-4.1 4.3-6.5 9-6.5s9 2.4 9 6.5v8.5c0 4.6-4 8-9 8s-9-3.4-9-8V13Z" fill="#a66b32" /><ellipse cx="14" cy="19" rx="5.6" ry="5" fill="#f5c889" /><circle cx="11" cy="16" r="1.2" fill="#191919" /><circle cx="17" cy="16" r="1.2" fill="#191919" /><path d="M12.5 20.5c1 .9 2 .9 3 0" stroke="#191919" strokeWidth="1.2" strokeLinecap="round" /><path d="m6 25-3 2m19-2 3 2" stroke="#9b5e2a" strokeWidth="2" strokeLinecap="round" /></svg>
}

export function TikTokStatusBar() {
  return (
    <div className="tiktok-chat__status" aria-hidden="true">
      <strong>8:52</strong>
      <div className="tiktok-chat__status-icons"><SignalIcon /><WifiIcon /><span>13</span><BatteryIcon /></div>
    </div>
  )
}

export function TikTokChatHeader() {
  return (
    <header className="tiktok-chat__header">
      <button className="tiktok-chat__back" type="button" aria-label="Назад"><BackIcon /></button>
      <div className="tiktok-chat__avatar"><DoodleAvatar /></div>
      <div className="tiktok-chat__identity"><strong>yarroray</strong><span><StreakIcon />260</span></div>
      <button className="tiktok-chat__more" type="button" aria-label="Дополнительные действия"><MoreIcon /></button>
    </header>
  )
}

export function TikTokSharedVideo({ poster, videoSrc, overlayText, author, authorAvatar, isPhoto = false }: SharedVideoMessage) {
  return (
    <button className={`tiktok-chat__shared-video${isPhoto ? ' tiktok-chat__shared-video--photo' : ''}`} type="button" aria-label={`${isPhoto ? 'Открыть фото' : 'Открыть видео'} от ${author}`}>
      {videoSrc ? <LazyVideo src={videoSrc} ariaLabel={`Видео от ${author}`} autoPlay={false} preloadWhenNear="none" className="tiktok-chat__video" /> : null}
      <LazyImage className="tiktok-chat__video-poster" src={poster} alt={`Отправленное ${isPhoto ? 'фото' : 'TikTok-видео'}`} />
      <span className="tiktok-chat__video-shade" aria-hidden="true" />
      {!isPhoto && overlayText && <span className="tiktok-chat__video-caption">{overlayText}</span>}
      <PlayIcon className="tiktok-chat__play" />
      <span className="tiktok-chat__video-author">
          {authorAvatar ? <LazyImage src={authorAvatar} alt="" /> : <span className="tiktok-chat__author-placeholder">D</span>}
          <strong>{author}</strong>
        </span>
    </button>
  )
}

export function TikTokPaperMessage({ children, className = '', variant = 'short', visible, label }: { children: ReactNode; className?: string; variant?: 'short' | 'long' | 'last'; visible: boolean; label: string }) {
  return (
    <article className={`tiktok-chat__paper-message tiktok-chat__paper-message--${variant}${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`} aria-label={label}>
      <svg className="tiktok-chat__paper-frame" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M3 9c6-3 9 0 14-2 8 2 14-1 22 1 10-2 19 2 28 0 9 2 16-1 29 2l-2 16c2 13-2 21 0 31-3 12 2 19-2 30-11-3-19 1-29-1-9 3-17-1-26 1-11-2-19 1-28-2-4 1-8-1-11 1 2-11-2-18 0-29C1 45 5 36 3 25c2-6-2-10 0-16Z" fill="#fff" stroke="#111" strokeWidth="1.15" strokeLinejoin="round" /></svg>
      <PaperDoodle className="tiktok-chat__paper-doodle" />
      <p>{children}</p>
    </article>
  )
}

export function TikTokReplyMessage({ visible }: { visible: boolean }) {
  return <div className={`tiktok-chat__reply${visible ? ' is-visible' : ''}`} aria-label="Ответ на сообщение"><span>kdrs: ярик я не буду пукать</span><i aria-hidden="true" /></div>
}

export function TikTokReactionBar() {
  return (
    <div className="tiktok-chat__reactions" aria-label="Быстрые реакции">
      {['❤️', '😂', '👍', '👆'].map((reaction) => <button key={reaction} type="button" aria-label={`Отправить реакцию ${reaction}`}>{reaction}</button>)}
      <button className="tiktok-chat__feed-pill" type="button" aria-label="Открыть общую ленту"><span aria-hidden="true">◩</span>Общая лента</button>
      <button className="tiktok-chat__feed-pill tiktok-chat__feed-pill--extra" type="button" aria-label="Ещё реакции"><span aria-hidden="true">◧</span></button>
    </div>
  )
}

export function TikTokComposer() {
  return (
    <div className="tiktok-chat__composer" role="textbox" aria-label="Сообщение" aria-readonly="true" tabIndex={0}>
      <span>Написать...</span>
      <div className="tiktok-chat__composer-icons"><button type="button" aria-label="Открыть стикеры"><StickerIcon /></button><button type="button" aria-label="Записать голосовое сообщение"><MicIcon /></button></div>
    </div>
  )
}

export function TikTokChatScene({ activeStage = 5 }: { activeStage?: number }) {
  const [isDownButtonFocused, setIsDownButtonFocused] = useState(false)
  const video: SharedVideoMessage = {
    poster: '/media/relationship/chat-photo.png',
    author: 'elenadildo',
    authorAvatar: '/media/relationship/chat-photo.png',
    isPhoto: true,
  }
  const show = (stage: number) => activeStage >= stage

  return (
    <div className="tiktok-chat" aria-label="Переписка в TikTok">
      <TikTokStatusBar />
      <TikTokChatHeader />
      <main className="tiktok-chat__canvas">
        <TikTokSharedVideo {...video} />
        <button className="tiktok-chat__share" type="button" aria-label="Поделиться видео"><ShareIcon /></button>
        <TikTokPaperMessage variant="short" visible={show(2)} label="Входящее сообщение: хочу быть как она">хочу быть как она</TikTokPaperMessage>
        <TikTokPaperMessage variant="long" visible={show(3)} label="Входящее сообщение: газ завтра увидимся">газ завтра увидимся</TikTokPaperMessage>
        <div className="tiktok-chat__incoming-avatar tiktok-chat__incoming-avatar--first" aria-hidden="true"><DoodleAvatar /></div>
        <div className="tiktok-chat__incoming-avatar tiktok-chat__incoming-avatar--second" aria-hidden="true"><DoodleAvatar /></div>
        <div className={`tiktok-chat__staged tiktok-chat__staged--reply-reaction${show(4) ? ' is-visible' : ''}`}><div className={`tiktok-chat__outgoing${show(4) ? ' is-visible' : ''}`}><BearSticker className="tiktok-chat__bear" /><span>гаааззз</span><i aria-hidden="true" /></div></div>
        <TikTokPaperMessage variant="last" visible={show(5)} label="Входящее сообщение: потом полетите с вадимычем помогать">потом полетите с вадимычем{`\n`}помогать</TikTokPaperMessage>
        <button className={`tiktok-chat__down${isDownButtonFocused ? ' is-focused' : ''}`} type="button" aria-label="Перейти к последним сообщениям" onFocus={() => setIsDownButtonFocused(true)} onBlur={() => setIsDownButtonFocused(false)}><DownIcon /></button>
      </main>
      <TikTokReactionBar />
      <TikTokComposer />
      <div className="tiktok-chat__home-indicator" aria-hidden="true" />
    </div>
  )
}
