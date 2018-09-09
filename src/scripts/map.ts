import {
  Control,
  CRS,
  imageOverlay,
  LatLngBoundsLiteral,
  map as createLeafletMap,
  Map as LFMap
} from 'leaflet'
import { getMapMarkers } from './fetchData'
import { getMapUrl, IMapInfo } from './loader'
import { createMarker } from './marker'

export function loadMapOverlay(map: LFMap, mapInfo: IMapInfo) {
  const overlay = createMapOverlay(mapInfo)
  overlay.addTo(map)
  return map
}

export function createMapOverlay(mapInfo: IMapInfo) {
  const url = getMapUrl(mapInfo.id)
  const mapImage = imageOverlay(url, MAP_BOUNDS, {
    attribution:
      'FINAL FANTASY XIV © 2010 - 2018 SQUARE ENIX CO., LTD. All Rights Reserved.'
  })
  return mapImage
}

export function createMap(el: HTMLElement) {
  const map = createLeafletMap(el, {
    crs: CRS.Simple,
    minZoom: -3,
    attributionControl: false,
    inertiaMaxSpeed: 5000
  })

  const attribution = new Control.Attribution({
    prefix: false
  })
  map.addControl(attribution)

  map.setMaxBounds([[-1024, -1024], [3072, 3072]])
  map.fitBounds(MAP_BOUNDS)
  map.setZoom(0)

  return map
}

export async function loadMap(map: LFMap, mapInfo: IMapInfo) {
  loadMapOverlay(map, mapInfo)
  const markers = await getMapMarkers(mapInfo)
  for (const marker of markers) {
    const mapMarker = createMarker(marker)
    if (mapMarker) {
      mapMarker.addTo(map)
    }
  }
  return map
}

export const MAP_SIZE = 2048
export const MAP_BOUNDS: LatLngBoundsLiteral = [[0, 0], [MAP_SIZE, MAP_SIZE]]
