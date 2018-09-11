import 'babel-polyfill'
import 'dom4'

import { PosControl } from './controls/PosControl'
import { getMaps } from './fetchData'
import { createMap, loadMap } from './map'

const mapEl = document.querySelector('section.map') as HTMLElement
const map = createMap(mapEl)

async function load() {
  const mapInfos = await getMaps()
  const mapInfo = mapInfos[12]
  await loadMap(map, mapInfo)
  const posControl = new PosControl({
    position: 'topright',
    scaleFactor: 200
  })
  posControl.addTo(map)
}

load().catch(e => console.error(e))
