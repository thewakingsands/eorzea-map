import 'babel-polyfill'
import 'dom4'

import { initEvents } from './events'
import { initMap, loadMap } from './map'

const mapEl = document.querySelector('section.map') as HTMLElement

const map = initMap(mapEl)
initEvents(mapEl, map)

loadMap(map, 12).catch(e => console.error(e))
