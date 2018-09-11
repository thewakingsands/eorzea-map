import { Control, ControlOptions } from 'leaflet'
import { EoMap } from '../EoMap'
import { IRegion } from '../fetchData'
import { IMapInfo } from '../loader'

export class NavigateControl extends Control {
  public regions: IRegion[]

  private map: EoMap
  private rootContainer: HTMLElement
  private placeNameContainer: HTMLElement
  private selectContainer: HTMLDivElement
  private select: HTMLSelectElement

  constructor(options: INavigateControlOptions) {
    super(options)
    this.regions = options.regions
  }

  public onAdd(map: EoMap) {
    this.map = map
    this.map.onUpdateInfo(this.onUpdateInfo)

    this.rootContainer = document.createElement('nav')

    this.placeNameContainer = document.createElement('div')

    this.selectContainer = document.createElement('div')
    this.select = document.createElement('select')
    this.select.addEventListener('change', this.onSelectChange, {
      passive: true
    })
    this.selectContainer.appendChild(this.select)

    for (const group of this.regions) {
      const optGroup = document.createElement('optgroup')
      optGroup.label = group.regionName
      this.select.appendChild(optGroup)

      for (const area of group.maps) {
        const option = document.createElement('option')
        option.value = `${area.key}`
        option.text = `${area.name}`
        if (area.subName) {
          option.text += ` - ${area.subName}`
        }
        optGroup.appendChild(option)
      }
    }

    this.rootContainer.appendChild(this.placeNameContainer)
    this.rootContainer.appendChild(this.selectContainer)
    return this.rootContainer
  }

  private onSelectChange = () => {
    if (this.map.mapInfo['#'] !== this.select.value) {
      this.map.loadMapKey(parseInt(this.select.value))
    }
  }

  public onRemove(map: EoMap) {
    this.map.offUpdateInfo(this.onUpdateInfo)
  }

  private onUpdateInfo = (mapInfo: IMapInfo) => {
    this.placeNameContainer.textContent = mapInfo.placeName
    this.select.value = mapInfo['#']
  }
}

export interface INavigateControlOptions extends ControlOptions {
  regions: IRegion[]
}
