import { EoMap } from './EoMap'

export function initEvents(el: HTMLElement, map: EoMap) {
  initTravelEvents(el, map)
}

function initTravelEvents(el: HTMLElement, map: EoMap) {
  el.addEventListener('click', e => {
    for (
      let target = e.target as HTMLElement;
      target && target !== this;
      target = target.parentNode as HTMLElement
    ) {
      if (target.dataset && target.dataset.dataType === '1') {
        const mapId = target.dataset.dataKey
        map.loadMapId(mapId)
        break
      }
    }
  })
}
