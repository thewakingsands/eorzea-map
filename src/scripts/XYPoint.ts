import { DomEvent, LatLng, Map as LFMap, Point } from 'leaflet'

export class XYPoint extends Point {
  constructor(x: number, y: number, round?: boolean) {
    super(2048 - y, x, round)
  }
}

export function xy(x: number, y: number): [number, number] {
  return [2048 - y, x]
}

export function llXy(latlng: LatLng): [number, number] {
  return [latlng.lng, 2048 - latlng.lat]
}

export function scaleGameXy(
  i: [number, number],
  factor: number
): [number, number] {
  factor /= 2
  let result: [number, number] = [i[0] / factor + 1, i[1] / factor + 1]
  result = result.map(x => Math.round(x * 100) / 100) as [number, number]
  return result
}

export function eventToGame(
  e: any,
  map: LFMap,
  scale: number
): [number, number] {
  return scaleGameXy(
    llXy(
      map.layerPointToLatLng(
        DomEvent.getMousePosition(e, (map as any)._container)
      )
    ),
    scale
  )
}
