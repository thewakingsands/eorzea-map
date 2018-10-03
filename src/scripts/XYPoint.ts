import { DomEvent, LatLng, Point } from 'leaflet'
import { toMapXY2D } from './coordinate'
import { EoMap } from './EoMap'

export class XYPoint extends Point {
  constructor(x: number, y: number, round?: boolean) {
    super(2048 - y, x, round)
  }
}

export function xy(xy: [number, number]): [number, number]
export function xy(x: number, y: number): [number, number]
export function xy(
  arg1: number | [number, number],
  arg2?: number
): [number, number] {
  const x = arg2 ? arg1 : arg1[0]
  const y = arg2 ? arg2 : arg1[1]
  return [2048 - y, x]
}

export function llXy(latlng: LatLng): [number, number] {
  return [latlng.lng, 2048 - latlng.lat]
}

export function eventToGame(e: any, map: EoMap): [number, number] {
  const c = llXy(
    map.containerPointToLatLng(
      DomEvent.getMousePosition(e, (map as any)._container)
    )
  )
  return toMapXY2D(map.mapInfo, ...c)
}
