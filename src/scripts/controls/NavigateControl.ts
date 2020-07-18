import crel from 'crel'
import { Control } from 'leaflet'
import { EoMap } from '../EoMap'
import { IRegion } from '../fetchData'

export class NavigateControl extends Control {
  public regions: IRegion[]

  private map: EoMap
  private rootContainer: HTMLElement
  private rangeInput: HTMLInputElement
  private rangeLock = false

  public onAdd(map: EoMap) {
    this.map = map
    this.map.on('zoomend', this.onZoomEnd)

    this.rootContainer = crel(
      'nav',
      { class: 'eorzea-map-nav eorzea-map-nav-upper' },
      [
        crel('button', {
          class: 'eorza-map-nav-button eorza-map-world',
          'data-action': 'world'
        }),
        crel('button', {
          class: 'eorza-map-nav-button eorza-map-zoom-in',
          'data-action': 'zoom-in'
        }),
        crel('div', { class: 'eorzea-map-range-container' }, [
          crel('div', { class: 'eorzea-map-range-slider' }),
          crel('input', {
            type: 'range',
            min: '-3',
            max: '4',
            step: '1',
            value: '-1'
          })
        ]),
        crel('button', {
          class: 'eorza-map-nav-button eorza-map-zoom-out',
          'data-action': 'zoom-out'
        })
      ]
    )

    this.rangeInput = this.rootContainer.querySelector('input[type=range]')

    this.rangeInput.addEventListener('input', () => {
      this.rangeLock = true
      this.map.setZoom((this.rangeInput.value as unknown) as number)
    })
    this.rangeInput.addEventListener('change', () => {
      this.rangeLock = false
    })

    for (const eventName of 'mousedown pointerdown mouseup pointerup click mousemove pointermove dblclick'.split(
      ' '
    )) {
      this.rootContainer.addEventListener(eventName, e => e.stopPropagation())
    }

    this.rootContainer.addEventListener('click', e => {
      for (
        let target = e.target as HTMLElement;
        target && target !== this.rootContainer;
        target = target.parentNode as HTMLElement
      ) {
        if (
          target.classList &&
          target.classList.contains('eorza-map-nav-button')
        ) {
          this.onButtonClick(target.dataset.action)
        }
      }
    })

    return this.rootContainer
  }

  private onZoomEnd = e => {
    if (!this.rangeLock) {
      this.rangeInput.value = '' + this.map.getZoom()
    }
  }

  public onRemove(map: EoMap) {
    this.map.off('zoomend', this.onZoomEnd)
  }

  private onButtonClick = (action: string) => {
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
