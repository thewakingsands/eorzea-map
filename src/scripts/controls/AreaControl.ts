import { Control, ControlOptions } from 'leaflet'
import { EoMap } from '../EoMap'
import { IRegion } from '../fetchData'
import { $ } from '../jquery'
import { IMapInfo } from '../loader'

export class AreaControl extends Control {
  public regions: IRegion[]

  private map: EoMap
  private rootContainer: JQuery<HTMLElement>
  private placeNameContainer: JQuery<HTMLElement>
  private select: HTMLSelectElement

  constructor(options: INavigateControlOptions) {
    super(options)
    this.regions = options.regions
  }

  public onAdd(map: EoMap) {
    this.map = map
    this.map.onUpdateInfo(this.onUpdateInfo)

    this.rootContainer = $(`<nav class="eorzea-map-nav">
      <div class="eorzea-map-bg"></div>
      <div class="eorzea-map-nav-aside">
        <div class="eorzea-map-place-name" for="eroza-map-place-select">？？？？</div>
        <div class="eorzea-map-place-select-container"></div>
      </div>
    </nav>`)

    this.placeNameContainer = this.rootContainer.find('.eorzea-map-place-name')

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
}

export interface INavigateControlOptions extends ControlOptions {
  regions: IRegion[]
}
