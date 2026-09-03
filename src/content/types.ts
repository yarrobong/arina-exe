export type Photo = {
  src: string
  alt: string
  caption?: string
  date?: string
}

export type Video = {
  src: string
  title: string
  description?: string
  kind?: 'video' | 'gif'
}

export type Era = {
  id: string
  eyebrow: string
  title: string
  years?: string
  story: string
  photos: Photo[]
  video?: Video
  song: { title: string; artist?: string; src?: string }
  accent?: string
}

export type Person = {
  name: string
  photo?: string
}

export type Place = {
  id: string
  title: string
  address?: string
  years: string
  story: string
  coordinates?: [number, number]
  zoom?: number
}
