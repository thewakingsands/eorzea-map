import {
  Control,
  CRS,
  imageOverlay,
  LatLngBoundsLiteral,
  map as createLeafletMap
} from 'leaflet'
import { PosControl } from './controls/PosControl'
import { EoMap } from './EoMap'
import { getMap, getMapMarkers } from './fetchData'
import { getMapUrl, IMapInfo } from './loader'
import { createMarker } from './marker'

export function loadMapOverlay(map: EoMap, mapInfo: IMapInfo) {
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

export function initMap(el: HTMLElement) {
  const lfMap = createLeafletMap(el, {
    crs: CRS.Simple,
    minZoom: -3,
    attributionControl: false,
    inertiaMaxSpeed: 5000
  })
  const map: EoMap = Object.setPrototypeOf(lfMap, EoMap.prototype)
  map.init()

  return map
}

export async function updateMapInfo(map: EoMap, mapInfo: IMapInfo) {
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

export async function loadMap(map: EoMap, mapId: number) {
  const mapInfo = await getMap(mapId)
  await updateMapInfo(map, mapInfo)
  const posControl = new PosControl({
    position: 'topright',
    scaleFactor: mapInfo.sizeFactor
  })
  posControl.addTo(map)
}

function cleanMap(map: EoMap) {}

export const MAP_SIZE = 2048
export const MAP_BOUNDS: LatLngBoundsLiteral = [[0, 0], [MAP_SIZE, MAP_SIZE]]
