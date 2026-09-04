export function assetUrl(src: string) {
  if (!src || !src.startsWith('/') || src.startsWith('//')) return src

  const baseUrl = import.meta.env.BASE_URL || '/'
  if (baseUrl === '/' || src.startsWith(baseUrl)) return src

  return `${baseUrl}${src.slice(1)}`
}
