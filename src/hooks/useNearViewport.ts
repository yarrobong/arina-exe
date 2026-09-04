import { useEffect, useRef, useState } from 'react'

type NearViewportOptions = {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
  once?: boolean
}

export function useNearViewport<T extends Element>({
  root = null,
  rootMargin = '800px 0px',
  threshold = 0,
  once = true,
}: NearViewportOptions = {}) {
  const ref = useRef<T>(null)
  const [isNear, setIsNear] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (!('IntersectionObserver' in window)) {
      setIsNear(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      const nextIsNear = entry.isIntersecting
      setIsNear(nextIsNear)
      if (nextIsNear && once) observer.disconnect()
    }, { root, rootMargin, threshold })

    observer.observe(node)
    return () => observer.disconnect()
  }, [once, root, rootMargin, threshold])

  return { ref, isNear }
}
