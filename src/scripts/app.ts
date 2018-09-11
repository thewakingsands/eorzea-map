import 'babel-polyfill'
import 'dom4'

import { initMap, loadMap } from './map'

const mapEl = document.querySelector('section.map') as HTMLElement
const map = initMap(mapEl)

loadMap(map, 12).catch(e => console.error(e))
