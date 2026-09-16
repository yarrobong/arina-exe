import { useEffect } from 'react'

type NetworkInformationLike = {
  saveData?: boolean
  effectiveType?: string
}

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformationLike
}

const waitForPageLoad = () => new Promise<void>((resolve) => {
  if (document.readyState === 'complete') {
    resolve()
    return
  }

  window.addEventListener('load', () => resolve(), { once: true })
})

const preloadImage = (src: string) => new Promise<void>((resolve) => {
  const image = new Image()
  image.decoding = 'async'
  image.setAttribute('fetchpriority', 'low')
  image.onload = () => resolve()
  image.onerror = () => resolve()
  image.src = src
})

export function MediaWarmup() {
  useEffect(() => {
    if (!import.meta.env.PROD) return

    const controller = new AbortController()
    let cancelled = false
    let timer = 0

    const run = async () => {
      await waitForPageLoad()
      if (cancelled) return

      const connection = (navigator as NavigatorWithConnection).connection
      if (connection?.saveData || /(?:^|-)2g$/.test(connection?.effectiveType ?? '')) return

      try {
        const response = await fetch(`${import.meta.env.BASE_URL}media-image-manifest.json`, {
          cache: 'force-cache',
          signal: controller.signal,
        })
        if (!response.ok) return

        const files = await response.json() as string[]
        let cursor = 0
        const workers = connection?.effectiveType === '3g' ? 2 : 4

        const warmWorker = async () => {
          while (!cancelled && cursor < files.length) {
            const relative = files[cursor]
            cursor += 1
            await preloadImage(`${import.meta.env.BASE_URL}${relative.replace(/^\/+/, '')}`)
          }
        }

        await Promise.all(Array.from({ length: workers }, () => warmWorker()))
      } catch {
        // Background cache warming is optional and must never affect page usage.
      }
    }

    timer = window.setTimeout(() => void run(), 450)

    return () => {
      cancelled = true
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [])

  return null
}
