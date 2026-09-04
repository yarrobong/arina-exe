import { assetUrl } from './assetUrl'

export type VideoSource = {
  src: string
  type: string
}

export function videoSources(src: string): VideoSource[] {
  const resolved = assetUrl(src)
  if (!/\.webm(?:[?#].*)?$/i.test(src)) {
    return [{ src: resolved, type: 'video/mp4' }]
  }

  if (import.meta.env.PROD) {
    return [{ src: assetUrl(src.replace(/\.webm(?=([?#]|$))/i, '.mp4')), type: 'video/mp4' }]
  }

  return [{ src: resolved, type: 'video/webm' }]
}
