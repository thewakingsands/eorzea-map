import $ = require('jquery')
import { Control, ControlOptions } from 'leaflet'
import { EoMap } from '../EoMap'
import { IRegion } from '../fetchData'
import { IMapInfo } from '../loader'

export class NavigateControl extends Control {
  public regions: IRegion[]

  private map: EoMap
  private rootContainer: JQuery<HTMLElement>
  private placeNameContainer: JQuery<HTMLElement>
  private rangeInput: HTMLInputElement
  private selectContainer: HTMLDivElement
  private select: HTMLSelectElement

  constructor(options: INavigateControlOptions) {
    super(options)
    this.regions = options.regions
  }

  public onAdd(map: EoMap) {
    this.map = map
    this.map.onUpdateInfo(this.onUpdateInfo)

    this.rootContainer = $(`<nav class="eorzea-map-nav">
      <div class="eorzea-map-place-name"></div>
      <button class="eorza-map-nav-button eorza-map-zoom-in"></button>
      <div class="eorzea-map-range-container">
        <div class="eorzea-map-range-slider"></div>
        <input type="range" min="-3" max="4" step="1">
      </div>
      <button class="eorza-map-nav-button eorza-map-zoom-out"></button>
    </nav>`)

    this.placeNameContainer = this.rootContainer.find('.eorzea-map-place-name')

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

    this.rootContainer.append(this.selectContainer)

    this.rootContainer.on(
      'mousedown pointerdown mouseup pointerup click mousemove pointermove dblclick',
      e => e.stopPropagation()
    )
    return this.rootContainer[0]
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
    this.placeNameContainer.text(mapInfo.placeName)
    this.select.value = mapInfo['#']
  }
}

export interface INavigateControlOptions extends ControlOptions {
  regions: IRegion[]
}
