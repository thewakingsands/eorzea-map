import crel from 'crel'
import { Control, ControlOptions } from 'leaflet'
import { EoMap } from '../EoMap'
import { IRegion } from '../fetchData'
import { IMapInfo } from '../loader'

export class AreaControl extends Control {
  public regions: IRegion[]

  private map: EoMap
  private rootContainer: HTMLElement
  private placeNameContainer: HTMLElement
  private select: HTMLSelectElement

  constructor(options: INavigateControlOptions) {
    super(options)
    this.regions = options.regions
  }

  public onAdd(map: EoMap) {
    this.map = map
    this.map.onUpdateInfo(this.onUpdateInfo)

    this.rootContainer = crel('nav', { class: 'eorzea-map-nav' }, [
      crel('div', { class: 'eorzea-map-bg' }),
      crel('div', { class: 'eorzea-map-nav-aside' }, [
        crel(
          'div',
          { class: 'eorzea-map-place-name', for: 'eroza-map-place-select' },
          '？？？？'
        ),
        crel('div', { class: 'eorzea-map-place-select-container' })
      ])
    ])

    this.placeNameContainer = this.rootContainer.querySelector(
      '.eorzea-map-place-name'
    )

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
      .querySelector('.eorzea-map-place-select-container')
      .appendChild(this.select)

    for (const eventName of 'mousedown pointerdown mouseup pointerup click mousemove pointermove dblclick'.split(
      ' '
    )) {
      this.rootContainer.addEventListener(eventName, e => e.stopPropagation())
    }

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
    let text = mapInfo.placeName
    if (mapInfo['placeName{Sub}']) {
      text += '<br>' + mapInfo['placeName{Sub}']
    }
    if (mapInfo.id.startsWith('region')) {
      text += '<br>区域地图显示信息可能有所缺失<br>可点击上面地名选择地图'
    }
    this.placeNameContainer.innerHTML = text
    this.select.value = mapInfo['#']
  }
}

export interface INavigateControlOptions extends ControlOptions {
  regions: IRegion[]
}
