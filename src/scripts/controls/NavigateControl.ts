import { Control, ControlOptions } from 'leaflet'
import { EoMap } from '../EoMap'
import { IRegion } from '../fetchData'
import { $ } from '../jquery'

export class NavigateControl extends Control {
  public regions: IRegion[]

  private map: EoMap
  private rootContainer: JQuery<HTMLElement>
  private rangeInput: JQuery<HTMLElement>
  private rangeLock = false

  public onAdd(map: EoMap) {
    this.map = map
    this.map.on('zoomend', this.onZoomEnd)

    this.rootContainer = $(`<nav class="eorzea-map-nav eorzea-map-nav-upper">
      <button class="eorza-map-nav-button eorza-map-world" data-action="world"></button>
      <button class="eorza-map-nav-button eorza-map-zoom-in" data-action="zoom-in"></button>
      <div class="eorzea-map-range-container">
        <div class="eorzea-map-range-slider"></div>
        <input type="range" min="-3" max="4" step="1" value="-1">
      </div>
      <button class="eorza-map-nav-button eorza-map-zoom-out" data-action="zoom-out"></button>
    </nav>`)

    this.rangeInput = this.rootContainer.find('input[type=range]')

    this.rangeInput.on('input', () => {
      this.rangeLock = true
      this.map.setZoom(this.rangeInput.val() as number)
    })
    this.rangeInput.on('change', () => {
      this.rangeLock = false
    })

    this.rootContainer.on(
      'mousedown pointerdown mouseup pointerup click mousemove pointermove dblclick',
      e => e.stopPropagation()
    )

    this.rootContainer.on('click', '.eorza-map-nav-button', this.onButtonClick)
    return this.rootContainer[0]
  }

  private onZoomEnd = e => {
    if (!this.rangeLock) {
      this.rangeInput.val(this.map.getZoom())
    }
  }

  public onRemove(map: EoMap) {
    this.map.off('zoomend', this.onZoomEnd)
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
