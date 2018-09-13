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
  private rangeInput: JQuery<HTMLElement>
  private select: HTMLSelectElement
  private rangeLock: boolean = false

  constructor(options: INavigateControlOptions) {
    super(options)
    this.regions = options.regions
  }

  public onAdd(map: EoMap) {
    this.map = map
    this.map.onUpdateInfo(this.onUpdateInfo)
    this.map.on('zoomend', this.onZoomEnd)

    this.rootContainer = $(`<nav class="eorzea-map-nav">
      <button class="eorza-map-nav-button eorza-map-world" data-action="world"></button>
      <button class="eorza-map-nav-button eorza-map-zoom-in" data-action="zoom-in"></button>
      <div class="eorzea-map-range-container">
        <div class="eorzea-map-range-slider"></div>
        <input type="range" min="-3" max="4" step="1" value="-1">
      </div>
      <button class="eorza-map-nav-button eorza-map-zoom-out" data-action="zoom-out"></button>
      <div class="eorzea-map-nav-aside">
        <div class="eorzea-map-place-name" for="eroza-map-place-select">？？？？</div>
        <div class="eorzea-map-place-select-container"></div>
      </div>
    </nav>`)

    this.placeNameContainer = this.rootContainer.find('.eorzea-map-place-name')
    this.rangeInput = this.rootContainer.find('input[type=range]')

    this.rangeInput.on('input', () => {
      this.rangeLock = true
      this.map.setZoom(this.rangeInput.val() as number)
    })
    this.rangeInput.on('change', () => {
      this.rangeLock = false
    })

    this.select = document.createElement('select')
    this.select.id = 'eroza-map-place-select'
    this.select.addEventListener('change', this.onSelectChange, {
      passive: true
    })

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

    this.rootContainer
      .find('.eorzea-map-place-select-container')
      .append(this.select)

    this.rootContainer.on(
      'mousedown pointerdown mouseup pointerup click mousemove pointermove dblclick',
      e => e.stopPropagation()
    )

    this.rootContainer.on('click', '.eorza-map-nav-button', this.onButtonClick)
    return this.rootContainer[0]
  }

  private onSelectChange = () => {
    if (this.map.mapInfo['#'] !== this.select.value) {
      this.map.loadMapKey(parseInt(this.select.value))
    }
  }

  private onZoomEnd = e => {
    if (!this.rangeLock) {
      this.rangeInput.val(this.map.getZoom())
    }
  }

  public onRemove(map: EoMap) {
    this.map.offUpdateInfo(this.onUpdateInfo)
    this.map.off('zoomend', this.onZoomEnd)
  }

  private onUpdateInfo = (mapInfo: IMapInfo) => {
    let text = mapInfo.placeName
    if (mapInfo['placeName{Sub}']) {
      text += '<br>' + mapInfo['placeName{Sub}']
    }
    if (mapInfo.id.startsWith('region')) {
      text += '<br>区域地图显示信息可能有所缺失<br>可点击上面地名选择地图'
    }
    this.placeNameContainer.html(text)
    this.select.value = mapInfo['#']
  }

  private onButtonClick = e => {
    const action = $(e.target).data('action')
    if (action === 'world') {
      this.map.loadMapKey(92)
    }
    if (action === 'zoom-in') {
      this.map.zoomIn()
    }
    if (action === 'zoom-out') {
      this.map.zoomOut()
    }
  }
}

export interface INavigateControlOptions extends ControlOptions {
  regions: IRegion[]
}
