import { useCallback, useEffect, useRef, useState } from 'react'

export function useActiveEra(count: number) {
  const [active, setActive] = useState(0)
  const nodes = useRef<Array<HTMLElement | null>>([])

  const setStepRef = useCallback((index: number, node: HTMLElement | null) => {
    nodes.current[index] = node
  }, [])

  useEffect(() => {
    const visibility = new Map<Element, number>()
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibility.set(entry.target, entry.intersectionRatio)
        else visibility.delete(entry.target)
      })

      const closest = [...visibility.entries()]
        .map(([element, ratio]) => ({
          index: Number((element as HTMLElement).dataset.index),
          ratio,
          distance: Math.abs(element.getBoundingClientRect().top - window.innerHeight * 0.44),
        }))
        .sort((a, b) => b.ratio - a.ratio || a.distance - b.distance)[0]

      if (closest && Number.isFinite(closest.index)) setActive(closest.index)
    }, {
      rootMargin: '-39% 0px -43% 0px',
      threshold: [0, 0.1, 0.35, 0.65, 1],
    })

    nodes.current.slice(0, count).forEach((node) => node && observer.observe(node))
    return () => observer.disconnect()
  }, [count])

  return { active, setActive, setStepRef }
}
