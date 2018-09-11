import { Control } from 'leaflet'
import { EoMap } from '../EoMap'
import { IMapInfo } from '../loader'

export class NavigateControl extends Control {
  private map: EoMap
  private rootContainer: HTMLElement
  private placeNameContainer: HTMLElement

  public onAdd(map: EoMap) {
    this.map = map
    this.map.onUpdateInfo(this.onUpdateInfo)

    this.rootContainer = document.createElement('nav')

    this.placeNameContainer = document.createElement('div')

    this.rootContainer.appendChild(this.placeNameContainer)
    return this.rootContainer
  }

  public onRemove(map: EoMap) {
    this.map.offUpdateInfo(this.onUpdateInfo)
  }

  private onUpdateInfo = (mapInfo: IMapInfo) => {
    this.placeNameContainer.textContent = mapInfo.placeName
  }
}
