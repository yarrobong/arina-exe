import { useEffect, useRef } from 'react'
import type { GeoJSONSource, Map as MapLibreMap, Marker } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import 'maplibre-gl/dist/maplibre-gl.css'
import { places } from '../content/places'
import { useActiveEra } from '../hooks/useActiveEra'
import { useNearViewport } from '../hooks/useNearViewport'
import { MapStoryCard } from './MapStoryCard'

const ROUTE_SOURCE = 'life-route'
const VISITED_SOURCE = 'life-route-visited'
function hideRoadLayers(map: MapLibreMap) {
  map.getStyle().layers
    ?.filter((layer) => {
      const layerConfig = layer as unknown as { sourceLayer?: string; 'source-layer'?: string }
      const sourceLayer = layerConfig.sourceLayer ?? layerConfig['source-layer']
      return sourceLayer === 'transportation' || sourceLayer === 'transportation_name'
    })
    .forEach((layer) => map.setLayoutProperty(layer.id, 'visibility', 'none'))
}

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
  const { ref: activationRef, isNear } = useNearViewport<HTMLDivElement>({ rootMargin: '700px 0px' })
  const container = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markerRefs = useRef(new Map<string, Marker>())
  const activeRef = useRef(0)
  const mapReadyRef = useRef(false)
  const { active, setActive, setStepRef } = useActiveEra(places.length)
  const currentPlace = places[active]

  activeRef.current = active

  useEffect(() => {
    if (!isNear || !container.current || mapRef.current) return

    const firstPlace = places.find((place) => place.coordinates)
    if (!firstPlace?.coordinates) return

    let cancelled = false
    let resizeObserver: ResizeObserver | null = null
    let map: MapLibreMap | null = null

    void (async () => {
      const maplibre = await import('maplibre-gl')
      if (cancelled || !container.current) return

      maplibre.setWorkerUrl(workerUrl)

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const mappedPlaces = places.filter((place) => place.coordinates)
      const route = mappedPlaces.map((place) => place.coordinates!)
      const mapInstance = new maplibre.Map({
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
      map = mapInstance
      mapRef.current = mapInstance

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

      const marker = new maplibre.Marker({ element, anchor: 'center' })
        .setLngLat(place.coordinates!)
        .addTo(mapInstance)
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

      mapInstance.stop()
      const camera = {
        center: place.coordinates,
        zoom: place.zoom ?? 11,
        bearing: place.bearing ?? 0,
        pitch: place.pitch ?? 44,
        padding: { top: 76, right: 24, bottom: 270, left: 24 },
      }

      if (immediate || reduceMotion) mapInstance.jumpTo(camera)
      else mapInstance.flyTo({
        ...camera,
        duration: 1850,
        curve: 1.28,
        speed: 0.78,
        essential: false,
      })
    }

    updateMarkerStates(0)
      mapInstance.once('load', () => {
      hideRoadLayers(mapInstance)
      const firstSymbolLayer = mapInstance.getStyle().layers?.find((layer) => layer.type === 'symbol')?.id
      mapInstance.addSource(ROUTE_SOURCE, { type: 'geojson', data: routeFeature(route) })
      mapInstance.addSource(VISITED_SOURCE, { type: 'geojson', data: routeFeature(route.slice(0, 1)) })

      mapInstance.addLayer({
        id: 'life-route-glow',
        type: 'line',
        source: ROUTE_SOURCE,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#ff4fa3', 'line-width': 9, 'line-opacity': 0.13, 'line-blur': 5 },
      }, firstSymbolLayer)
      mapInstance.addLayer({
        id: 'life-route-line',
        type: 'line',
        source: ROUTE_SOURCE,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#bbb9c5', 'line-width': 1.25, 'line-opacity': 0.36, 'line-dasharray': [1.4, 2.1] },
      }, firstSymbolLayer)
      mapInstance.addLayer({
        id: 'life-route-visited-line',
        type: 'line',
        source: VISITED_SOURCE,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#ff4fa3', 'line-width': 2.4, 'line-opacity': 0.92 },
      }, firstSymbolLayer)

      mapReadyRef.current = true
      const initialIndex = activeRef.current
      updateMarkerStates(initialIndex)
      ;(mapInstance.getSource(VISITED_SOURCE) as GeoJSONSource).setData(routeFeature(route.slice(0, initialIndex + 1)))
      moveCamera(initialIndex, true)
    })

      resizeObserver = new ResizeObserver(() => mapInstance.resize())
      resizeObserver.observe(container.current)
    })()

    return () => {
      cancelled = true
      resizeObserver?.disconnect()
      markerRefs.current.clear()
      map?.remove()
      mapRef.current = null
      mapReadyRef.current = false
    }
  }, [isNear])

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
    step.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'center',
    })
  }

  return (
    <div ref={activationRef} className="life-map-story">
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
