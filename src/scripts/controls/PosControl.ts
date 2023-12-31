import { Control, ControlOptions } from 'leaflet'
import { EoMap } from '../EoMap'
import { IMapInfo } from '../loader'
import { eventToGame } from '../XYPoint'

export class PosControl extends Control {
  private rootContainer: HTMLElement
  private mapContainer: HTMLElement
  private map: EoMap
  private scaleFactor: number

  constructor(options: IPosControlOptions) {
    super(options)

    this.rootContainer = document.createElement('section')
    this.rootContainer.classList.add('eorzea-map-pos')
    this.rootContainer.classList.add('eorzea-map-text')

    this.scaleFactor = options.scaleFactor || 100
  }

  public setScaleFactor(factor: number) {
    this.scaleFactor = factor
  }

  public onAdd(map: EoMap) {
    this.map = map
    this.mapContainer = (map as any)._container
    this.mapContainer.addEventListener('mousemove', this.onMouseMoveEvent, {
      passive: false
    })
    this.mapContainer.addEventListener('mouseleave', this.onMouseLeaveEvent)
    this.map.onUpdateInfo(this.onUpdateInfo)
    return this.rootContainer
  }

  private onUpdateInfo = (mapInfo: IMapInfo) => {
    this.setScaleFactor(mapInfo.sizeFactor)
  }

  public onRemove(map: EoMap) {
    this.mapContainer.removeEventListener('mousemove', this.onMouseMoveEvent)
    this.mapContainer.removeEventListener('mouseleave', this.onMouseLeaveEvent)
    this.map.offUpdateInfo(this.onUpdateInfo)
  }

  private onMouseMoveEvent = (event: MouseEvent) => {
    const [x, y] = eventToGame(event, this.map)
    this.rootContainer.innerHTML = [
      '<span class="eorzea-map-letter">X: </span>',
      `<span class="eorzea-map-int">${x.toFixed(2).split('.')[0]}</span>`,
      `.<span class="eorzea-map-demical">${x.toFixed(2).split('.')[1]}</span>`,
      ' <span class="eorzea-map-letter">Y: </span>',
      `<span class="eorzea-map-int">${y.toFixed(2).split('.')[0]}</span>`,
      `.<span class="eorzea-map-demical">${y.toFixed(2).split('.')[1]}</span>`
    ].join('')
  }

  private onMouseLeaveEvent = () => {
    this.rootContainer.innerHTML = ''
  }
}

export interface IPosControlOptions extends ControlOptions {
  scaleFactor?: number
}
