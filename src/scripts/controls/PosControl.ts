import { Control, ControlOptions, Map as LFMap } from 'leaflet'
import { MAP_SIZE } from '../map'
import { eventToGame } from '../XYPoint'

export class PosControl extends Control {
  private rootContainer: HTMLElement
  private mapContainer: HTMLElement
  private map: LFMap
  private scaleFactor: number

  constructor(options: IPosControlOptions) {
    super(options)
    this.rootContainer = document.createElement('section')
    this.rootContainer.classList.add('eorzea-map-pos')
    this.scaleFactor = options.scaleFactor || 100
  }

  public setScaleFactor(factor: number) {
    this.scaleFactor = factor
  }

  protected onAdd(map: LFMap) {
    this.map = map
    this.mapContainer = (map as any)._container
    this.mapContainer.addEventListener('mousemove', this.onMouseMoveEvent, {
      passive: false
    })
    return this.rootContainer
  }

  protected onRemove(map: LFMap) {
    this.mapContainer.removeEventListener('mousemove', this.onMouseMoveEvent)
  }

  private onMouseMoveEvent = (event: MouseEvent) => {
    const [x, y] = eventToGame(event, this.map, this.scaleFactor)
    if (x < 1 || y < 1) {
      return
    }
    const maxSize = (MAP_SIZE / this.scaleFactor) * 2 + 1
    if (x > maxSize || y > maxSize) {
      return
    }
    this.rootContainer.textContent = `X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}`
  }
}

export interface IPosControlOptions extends ControlOptions {
  scaleFactor?: number
}
