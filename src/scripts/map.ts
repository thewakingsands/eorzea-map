import { CRS, LatLngBoundsLiteral, map as createLeafletMap } from 'leaflet'
import { EoMap } from './EoMap'
import { getRegion } from './fetchData'

export async function initMap(el: HTMLElement) {
  const lfMap = createLeafletMap(el, {
    crs: CRS.Simple,
    minZoom: -3,
    attributionControl: false,
    inertiaMaxSpeed: 5000
  })
  const map: EoMap = Object.setPrototypeOf(lfMap, EoMap.prototype)

  const regions = await getRegion()
  map.init(regions)

  return map
}

export const MAP_SIZE = 2048
export const MAP_BOUNDS: LatLngBoundsLiteral = [[0, 0], [MAP_SIZE, MAP_SIZE]]
