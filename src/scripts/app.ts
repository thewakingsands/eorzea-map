import 'babel-polyfill'

import { DomEvent } from 'leaflet'
import { PosControl } from './controls/PosControl'
import { getMaps } from './fetchData'
import { createMap, loadMap } from './map'
import { eventToGame, llXy, scaleGameXy } from './XYPoint'

const mapEl = document.querySelector('section.map') as HTMLElement
const map = createMap(mapEl)

async function load() {
  const mapInfos = await getMaps()
  const mapInfo = mapInfos[25]
  await loadMap(map, mapInfo)
  const posControl = new PosControl({
    position: 'topright',
    scaleFactor: 100
  })
  posControl.addTo(map)
}

load().catch(e => console.error(e))
