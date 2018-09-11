import $ = require('jquery')
import { EoMap } from './EoMap'
import { getMapKeyById } from './fetchData'
import { loadMap } from './map'

export function initEvents(el: HTMLElement, map: EoMap) {
  initTravelEvents(el, map)
}

function initTravelEvents(el: HTMLElement, map: EoMap) {
  $(el).on('click', '[data-data-type="1"]', async function() {
    const $el = $(this)
    const mapId = $el.data('data-key')
    const mapKey = await getMapKeyById(mapId)
    loadMap(map, mapKey)
  })
}
