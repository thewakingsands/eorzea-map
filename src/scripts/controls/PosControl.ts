import { Control, ControlOptions, Map as LFMap } from 'leaflet'
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
    const [x, y] = eventToGame(event, this.map, this.scaleFactor).map(i =>
      i.toFixed(2)
    )
    this.rootContainer.textContent = `X: ${x}, Y: ${y}`
  }
}

export interface IPosControlOptions extends ControlOptions {
  scaleFactor?: number
}
