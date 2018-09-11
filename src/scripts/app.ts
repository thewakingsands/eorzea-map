import 'babel-polyfill'
import 'dom4'

import { initEvents } from './events'
import { initMap } from './map'

const mapEl = document.querySelector('section.map') as HTMLElement

const map = initMap(mapEl)
initEvents(mapEl, map)

map.loadMapKey(92).catch(e => console.error(e))
