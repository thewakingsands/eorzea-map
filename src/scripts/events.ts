import { EoMap } from './EoMap'
import { $ } from './jquery'

export function initEvents(el: HTMLElement, map: EoMap) {
  initTravelEvents(el, map)
}

function initTravelEvents(el: HTMLElement, map: EoMap) {
  $(el).on('click', '[data-data-type="1"]', async function() {
    const $el = $(this)
    const mapId = $el.data('data-key')
    map.loadMapId(mapId)
  })
}
