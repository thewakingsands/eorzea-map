import { Point } from 'leaflet'

export class XYPoint extends Point {
  constructor(x: number, y: number, round?: boolean) {
    super(2048 - y, x, round)
  }
}

export function xy(x: number, y: number): [number, number] {
  return [2048 - y, x]
}
