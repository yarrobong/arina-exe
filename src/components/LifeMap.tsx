import { useEffect, useRef, useState } from 'react'
import { Map, Marker, setWorkerUrl } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import { places } from '../content/places'

setWorkerUrl(workerUrl)

export function LifeMap() {
  const container = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Map | null>(null)
  const markersRef = useRef<Marker[]>([])
  const stepRefs = useRef<Array<HTMLElement | null>>([])
  const activeRef = useRef(0)
  const lastScrollYRef = useRef(0)
  const zoomTimerRef = useRef<number | null>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!container.current || mapRef.current) return
    const map = new Map({
      container: container.current,
      style: 'https://tiles.openfreemap.org/styles/positron',
      center: places[0].coordinates!,
      zoom: places[0].zoom ?? 11,
      attributionControl: false,
      dragPan: false,
      scrollZoom: false,
      doubleClickZoom: false,
      touchZoomRotate: false,
      dragRotate: false,
      touchPitch: false,
      boxZoom: false,
      keyboard: false,
    })
    mapRef.current = map

    const mappedPlaces = places.filter((place) => place.coordinates)
    markersRef.current = mappedPlaces.map((place, index) => {
      const element = document.createElement('div')
      element.className = 'life-map__marker'
      element.setAttribute('role', 'img')
      element.setAttribute('aria-label', `${index + 1}. ${place.title}`)

      const dot = document.createElement('span')
      dot.className = 'life-map__marker-dot'
      const label = document.createElement('span')
      label.className = 'life-map__marker-label'
      label.textContent = place.title
      const years = document.createElement('small')
      years.textContent = place.years
      const description = document.createElement('span')
      description.className = 'life-map__marker-description'
      description.textContent = place.story
      label.append(years, description)
      element.append(dot, label)

      const marker = new Marker({ element, anchor: 'bottom' })
        .setLngLat(place.coordinates!)
        .addTo(map)
      return marker
    })

    map.once('load', () => {
      const route = mappedPlaces.map((place) => place.coordinates!)
      map.addSource('life-route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: route },
        },
      })
      map.addLayer({
        id: 'life-route-line',
        type: 'line',
        source: 'life-route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#ff4fa3',
          'line-width': 3,
          'line-opacity': 0.8,
          'line-dasharray': [1.2, 1.2],
        },
      })

    })

    return () => {
      if (zoomTimerRef.current !== null) window.clearTimeout(zoomTimerRef.current)
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    markersRef.current.forEach((marker, index) => {
      marker.getElement().classList.toggle('is-active', index === active)
    })
  }, [active])

  useEffect(() => {
    const updateActive = () => {
      const scrollingDown = window.scrollY >= lastScrollYRef.current
      lastScrollYRef.current = window.scrollY
      const focusLine = window.innerHeight * 0.43
      let nextIndex = activeRef.current
      let closestDistance = Number.POSITIVE_INFINITY

      stepRefs.current.forEach((node, index) => {
        if (!node) return
        const rect = node.getBoundingClientRect()
        const distance = Math.abs((rect.top + rect.bottom) / 2 - focusLine)
        if (distance < closestDistance) {
          closestDistance = distance
          nextIndex = index
        }
      })

      if (nextIndex === activeRef.current) return
      if (scrollingDown && nextIndex < activeRef.current) return
      if (!scrollingDown && nextIndex > activeRef.current) return
      activeRef.current = nextIndex
      setActive(nextIndex)

      const place = places[nextIndex]
      if (!place.coordinates || !mapRef.current) return
      if (zoomTimerRef.current !== null) window.clearTimeout(zoomTimerRef.current)

      const map = mapRef.current
      map.stop()
      map.flyTo({
        center: place.coordinates,
        zoom: (place.zoom ?? 11) + 2,
        duration: 800,
        essential: true,
      })
      zoomTimerRef.current = window.setTimeout(() => {
        map.flyTo({
          center: place.coordinates!,
          zoom: place.zoom ?? 11,
          duration: 850,
          essential: true,
        })
        zoomTimerRef.current = null
      }, 900)
    }

    let frame = 0
    const handleScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        updateActive()
      })
    }

    lastScrollYRef.current = window.scrollY
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="life-map-story">
      <div className="life-map-story__sticky">
        <div className="life-map__canvas" ref={container} />
      </div>
      <div className="life-map__steps" aria-label="Точки маршрута">
        {places.map((place, index) => (
          <article
            key={place.id}
            data-index={index}
            ref={(node) => { stepRefs.current[index] = node }}
            className={index === active ? 'life-map__step is-active' : 'life-map__step'}
          >
            <span className="sr-only">{String(index + 1).padStart(2, '0')} · {place.years}</span>
            <h3 className="sr-only">{place.title}</h3>
            <p className="sr-only">{place.story}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
