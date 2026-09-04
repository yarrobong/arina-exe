import { useEffect, useRef } from 'react'
import { GeoJSONSource, Map as MapLibreMap, Marker, setWorkerUrl } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import { places } from '../content/places'
import { useActiveEra } from '../hooks/useActiveEra'
import { MapStoryCard } from './MapStoryCard'

setWorkerUrl(workerUrl)

const ROUTE_SOURCE = 'life-route'
const VISITED_SOURCE = 'life-route-visited'
const SATELLITE_SOURCE = 'satellite-imagery'
const SATELLITE_LAYER = 'satellite-imagery-layer'

function routeFeature(coordinates: [number, number][]) {
  const lineCoordinates = coordinates.length === 1
    ? [coordinates[0], coordinates[0]]
    : coordinates

  return {
    type: 'Feature' as const,
    properties: {},
    geometry: { type: 'LineString' as const, coordinates: lineCoordinates },
  }
}

export function LifeMap() {
  const container = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markerRefs = useRef(new Map<string, Marker>())
  const activeRef = useRef(0)
  const mapReadyRef = useRef(false)
  const { active, setActive, setStepRef } = useActiveEra(places.length)
  const currentPlace = places[active]

  activeRef.current = active

  useEffect(() => {
    if (!container.current || mapRef.current) return

    const firstPlace = places.find((place) => place.coordinates)
    if (!firstPlace?.coordinates) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mappedPlaces = places.filter((place) => place.coordinates)
    const route = mappedPlaces.map((place) => place.coordinates!)
    const map = new MapLibreMap({
      container: container.current,
      style: 'https://tiles.openfreemap.org/styles/dark',
      center: firstPlace.coordinates,
      zoom: firstPlace.zoom ?? 11,
      bearing: firstPlace.bearing ?? 0,
      pitch: firstPlace.pitch ?? 42,
      attributionControl: false,
      dragPan: false,
      scrollZoom: false,
      doubleClickZoom: false,
      touchZoomRotate: false,
      dragRotate: false,
      touchPitch: false,
      boxZoom: false,
      keyboard: false,
      maxPitch: 60,
    })
    mapRef.current = map

    mappedPlaces.forEach((place, index) => {
      const element = document.createElement('div')
      element.className = 'life-map__marker'
      element.setAttribute('role', 'img')
      element.setAttribute('aria-label', `${index + 1}. ${place.title}`)
      element.innerHTML = `
        <span class="life-map__marker-orbit"></span>
        <span class="life-map__marker-core">${String(index + 1).padStart(2, '0')}</span>
        <span class="life-map__marker-name">${place.title}</span>
      `

      const marker = new Marker({ element, anchor: 'center' })
        .setLngLat(place.coordinates!)
        .addTo(map)
      markerRefs.current.set(place.id, marker)
    })

    const updateMarkerStates = (activeIndex: number) => {
      places.forEach((place, index) => {
        const element = markerRefs.current.get(place.id)?.getElement()
        element?.classList.toggle('is-active', index === activeIndex)
        element?.classList.toggle('is-visited', index < activeIndex)
      })
    }

    const moveCamera = (index: number, immediate = false) => {
      const place = places[index]
      if (!place?.coordinates) return

      map.stop()
      const camera = {
        center: place.coordinates,
        zoom: place.zoom ?? 11,
        bearing: place.bearing ?? 0,
        pitch: place.pitch ?? 44,
        padding: { top: 76, right: 24, bottom: 270, left: 24 },
      }

      if (immediate || reduceMotion) map.jumpTo(camera)
      else map.flyTo({
        ...camera,
        duration: 1850,
        curve: 1.28,
        speed: 0.78,
        essential: false,
      })
    }

    updateMarkerStates(0)
    map.once('load', () => {
      const firstSymbolLayer = map.getStyle().layers?.find((layer) => layer.type === 'symbol')?.id
      map.addSource(SATELLITE_SOURCE, {
        type: 'raster',
        tiles: ['https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg'],
        tileSize: 256,
        maxzoom: 14,
        attribution: 'Sentinel-2 cloudless — EOX',
      })
      map.addLayer({
        id: SATELLITE_LAYER,
        type: 'raster',
        source: SATELLITE_SOURCE,
        paint: {
          'raster-saturation': 0.04,
          'raster-contrast': 0.08,
          'raster-brightness-max': 0.9,
          'raster-fade-duration': 450,
        },
      }, firstSymbolLayer)
      map.addSource(ROUTE_SOURCE, { type: 'geojson', data: routeFeature(route) })
      map.addSource(VISITED_SOURCE, { type: 'geojson', data: routeFeature(route.slice(0, 1)) })

      map.addLayer({
        id: 'life-route-glow',
        type: 'line',
        source: ROUTE_SOURCE,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#ff4fa3', 'line-width': 9, 'line-opacity': 0.13, 'line-blur': 5 },
      }, firstSymbolLayer)
      map.addLayer({
        id: 'life-route-line',
        type: 'line',
        source: ROUTE_SOURCE,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#bbb9c5', 'line-width': 1.25, 'line-opacity': 0.36, 'line-dasharray': [1.4, 2.1] },
      }, firstSymbolLayer)
      map.addLayer({
        id: 'life-route-visited-line',
        type: 'line',
        source: VISITED_SOURCE,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#ff4fa3', 'line-width': 2.4, 'line-opacity': 0.92 },
      }, firstSymbolLayer)

      mapReadyRef.current = true
      const initialIndex = activeRef.current
      updateMarkerStates(initialIndex)
      ;(map.getSource(VISITED_SOURCE) as GeoJSONSource).setData(routeFeature(route.slice(0, initialIndex + 1)))
      moveCamera(initialIndex, true)
    })

    const resizeObserver = new ResizeObserver(() => map.resize())
    resizeObserver.observe(container.current)

    return () => {
      resizeObserver.disconnect()
      markerRefs.current.clear()
      map.remove()
      mapRef.current = null
      mapReadyRef.current = false
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReadyRef.current || !currentPlace.coordinates) return

    places.forEach((place, index) => {
      const element = markerRefs.current.get(place.id)?.getElement()
      element?.classList.toggle('is-active', index === active)
      element?.classList.toggle('is-visited', index < active)
    })

    const route = places.filter((place) => place.coordinates).map((place) => place.coordinates!)
    ;(map.getSource(VISITED_SOURCE) as GeoJSONSource | undefined)?.setData(routeFeature(route.slice(0, active + 1)))

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const camera = {
      center: currentPlace.coordinates,
      zoom: currentPlace.zoom ?? 11,
      bearing: currentPlace.bearing ?? 0,
      pitch: currentPlace.pitch ?? 44,
      padding: { top: 76, right: 24, bottom: 270, left: 24 },
    }
    map.stop()
    if (reduceMotion) map.jumpTo(camera)
    else map.flyTo({ ...camera, duration: 1850, curve: 1.28, speed: 0.78, essential: false })
  }, [active, currentPlace])

  const selectStep = (index: number) => {
    const step = document.querySelector<HTMLElement>(`.life-map__step[data-index="${index}"]`)
    if (!step) return
    setActive(index)
    window.scrollTo({
      top: window.scrollY + step.getBoundingClientRect().top - window.innerHeight * 0.1,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  return (
    <div className="life-map-story">
      <div className="life-map-story__sticky">
        <div className="life-map__canvas" ref={container} aria-label="Маршрут жизни Арины на карте" />
        <div className="life-map__atmosphere" aria-hidden="true" />
        <div className="life-map__chrome" aria-hidden="true">
          <span>MEMORY MAP</span>
          <i />
          <span>ARINA.EXE</span>
        </div>
        <div className="life-map__counter" aria-hidden="true">
          <span>{String(active + 1).padStart(2, '0')}</span>
          <small>/ {String(places.length).padStart(2, '0')}</small>
        </div>
        <MapStoryCard
          place={currentPlace}
          active={active}
          total={places.length}
          labels={places.map((place) => place.title)}
          onSelect={selectStep}
        />
        <span className="life-map__scroll-cue" aria-hidden="true">листай историю <i>↓</i></span>
      </div>

      <div className="life-map__steps" aria-label="Этапы маршрута">
        {places.map((place, index) => (
          <article
            key={place.id}
            data-index={index}
            ref={(node) => setStepRef(index, node)}
            className={index === active ? 'life-map__step is-active' : 'life-map__step'}
            aria-label={`${place.chapter}. ${place.title}. ${place.years}. ${place.story}`}
          />
        ))}
      </div>
    </div>
  )
}
