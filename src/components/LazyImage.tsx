import type { ImgHTMLAttributes } from 'react'
import { useNearViewport } from '../hooks/useNearViewport'
import { assetUrl } from '../utils/assetUrl'

type LazyImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'loading' | 'decoding' | 'fetchPriority'> & {
  src: string
  rootMargin?: string
}

export function LazyImage({ src, rootMargin = '600px 120px', ...props }: LazyImageProps) {
  const { ref, isNear } = useNearViewport<HTMLImageElement>({ rootMargin })
  const resolvedSrc = assetUrl(src)

  return <img {...props} ref={ref} src={isNear ? resolvedSrc : undefined} loading="lazy" decoding="async" fetchPriority="low" />
}
