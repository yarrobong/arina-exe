import { useEffect, useRef, useState } from 'react'
import type { GeoJSONSource, Map as MapLibreMap, Marker, StyleSpecification } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import 'maplibre-gl/dist/maplibre-gl.css'
import '../styles/life-map.css'
import { places } from '../content/places'
import type { Place } from '../content/types'
import { useActiveEra } from '../hooks/useActiveEra'
import { useNearViewport } from '../hooks/useNearViewport'
import { MapStoryCard } from './MapStoryCard'

const ROUTE_SOURCE = 'life-route'
const VISITED_SOURCE = 'life-route-visited'
const SHORT_MOVE_KM = 90

const MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      maxzoom: 19,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm-base',
      type: 'raster',
      source: 'osm',
      paint: {
        'raster-saturation': -0.85,
        'raster-contrast': 0.2,
        'raster-brightness-min': 0.03,
        'raster-brightness-max': 0.42,
      },
    },
  ],
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

function distanceKm(from: [number, number], to: [number, number]) {
  const toRadians = (value: number) => value * Math.PI / 180
  const earthRadiusKm = 6371
  const lat1 = toRadians(from[1])
  const lat2 = toRadians(to[1])
  const deltaLat = toRadians(to[1] - from[1])
  const deltaLng = toRadians(to[0] - from[0])
  const a = Math.sin(deltaLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(a))
}

function moveCamera(map: MapLibreMap, place: Place, reduceMotion: boolean, immediate = false) {
  if (!place.coordinates) return

  map.stop()
  const center = map.getCenter()
  const distance = distanceKm([center.lng, center.lat], place.coordinates)
  const camera = {
    center: place.coordinates,
    zoom: place.zoom ?? 11,
    bearing: place.bearing ?? 0,
    pitch: place.pitch ?? 44,
    padding: { top: 76, right: 24, bottom: 270, left: 24 },
  }

  if (immediate || reduceMotion) {
    map.jumpTo(camera)
    return
  }

  if (distance < SHORT_MOVE_KM) {
    map.easeTo({
      ...camera,
      duration: 850,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      essential: false,
    })
    return
  }

  map.flyTo({
    ...camera,
    duration: 1150,
    curve: 1.08,
    speed: 1.25,
    essential: false,
  })
}

export function LifeMap() {
  const { ref: activationRef, isNear } = useNearViewport<HTMLDivElement>({ rootMargin: '700px 0px' })
  const container = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markerRefs = useRef(new Map<string, Marker>())
  const activeRef = useRef(0)
  const exploreModeRef = useRef(false)
  const mapReadyRef = useRef(false)
  const [isExploreMode, setIsExploreMode] = useState(false)
  const { active, setActive, setStepRef } = useActiveEra(places.length)
  const currentPlace = places[active]
  const routeComplete = active === places.length - 1

  activeRef.current = active
  exploreModeRef.current = isExploreMode

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
        style: MAP_STYLE,
        center: firstPlace.coordinates,
        zoom: firstPlace.zoom ?? 11,
        bearing: firstPlace.bearing ?? 0,
        pitch: firstPlace.pitch ?? 42,
        attributionControl: { compact: true },
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
        element.setAttribute('tabindex', '-1')
        element.innerHTML = `
          <span class="life-map__marker-orbit"></span>
          <span class="life-map__marker-core">${String(index + 1).padStart(2, '0')}</span>
          <span class="life-map__marker-name">${place.title}</span>
        `

        const inspectPlace = () => {
          if (!exploreModeRef.current) return
          setActive(index)
          moveCamera(mapInstance, place, reduceMotion)
        }
        element.addEventListener('click', inspectPlace)
        element.addEventListener('keydown', (event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return
          event.preventDefault()
          inspectPlace()
        })

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

      updateMarkerStates(0)
      mapInstance.once('load', () => {
        mapInstance.addSource(ROUTE_SOURCE, { type: 'geojson', data: routeFeature(route) })
        mapInstance.addSource(VISITED_SOURCE, { type: 'geojson', data: routeFeature(route.slice(0, 1)) })

        mapInstance.addLayer({
          id: 'life-route-glow',
          type: 'line',
          source: ROUTE_SOURCE,
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': '#ff4fa3', 'line-width': 9, 'line-opacity': 0.13, 'line-blur': 5 },
        })
        mapInstance.addLayer({
          id: 'life-route-line',
          type: 'line',
          source: ROUTE_SOURCE,
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': '#bbb9c5', 'line-width': 1.25, 'line-opacity': 0.36, 'line-dasharray': [1.4, 2.1] },
        })
        mapInstance.addLayer({
          id: 'life-route-visited-line',
          type: 'line',
          source: VISITED_SOURCE,
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': '#ff4fa3', 'line-width': 2.4, 'line-opacity': 0.92 },
        })

        mapReadyRef.current = true
        const initialIndex = activeRef.current
        updateMarkerStates(initialIndex)
        ;(mapInstance.getSource(VISITED_SOURCE) as GeoJSONSource).setData(routeFeature(route.slice(0, initialIndex + 1)))
        moveCamera(mapInstance, places[initialIndex], reduceMotion, true)
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
  }, [isNear, setActive])

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

    if (isExploreMode) return
    moveCamera(map, currentPlace, window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [active, currentPlace, isExploreMode])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReadyRef.current) return

    markerRefs.current.forEach((marker) => {
      const element = marker.getElement()
      element.setAttribute('role', isExploreMode ? 'button' : 'img')
      element.setAttribute('tabindex', isExploreMode ? '0' : '-1')
    })

    if (isExploreMode) {
      map.stop()
      map.dragPan.enable()
      map.touchZoomRotate.enable()
      map.doubleClickZoom.enable()
      map.keyboard.enable()
      return
    }

    map.dragPan.disable()
    map.touchZoomRotate.disable()
    map.doubleClickZoom.disable()
    map.keyboard.disable()
    moveCamera(map, currentPlace, window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [currentPlace, isExploreMode])

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
    <div ref={activationRef} className={`life-map-story${isExploreMode ? ' is-explore' : ''}`}>
      <div className="life-map-story__sticky">
        <div className="life-map__canvas" ref={container} aria-label="Маршрут жизни Арины на карте" />
        <div className="life-map__atmosphere" aria-hidden="true" />
        <div className="life-map__chrome" aria-hidden="true">
          <span>{isExploreMode ? 'EXPLORE MODE' : 'MEMORY MAP'}</span>
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

        {routeComplete && !isExploreMode && (
          <div className="life-map__completion" aria-live="polite">
            <div>
              <span>МАРШРУТ ПРОЙДЕН ✓</span>
              <small>4 точки · одна история</small>
            </div>
            <button type="button" onClick={() => setIsExploreMode(true)}>
              ИЗУЧИТЬ КАРТУ
            </button>
          </div>
        )}

        {isExploreMode && (
          <div className="life-map__explore-toolbar">
            <div>
              <span>КАРТА РАЗБЛОКИРОВАНА</span>
              <small>двигай · увеличивай · нажимай на точки</small>
            </div>
            <button type="button" onClick={() => setIsExploreMode(false)}>
              ← К ИСТОРИИ
            </button>
          </div>
        )}

        {!routeComplete && !isExploreMode && (
          <span className="life-map__scroll-cue" aria-hidden="true">листай историю <i>↓</i></span>
        )}
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
