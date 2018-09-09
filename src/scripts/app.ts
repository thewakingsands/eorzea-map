import 'babel-polyfill'

import { getMaps } from './fetchData'
import { createMap, loadMap } from './map'

const mapEl = document.querySelector('section.map') as HTMLElement
const map = createMap(mapEl)

async function load() {
  const mapInfos = await getMaps()
  const mapInfo = mapInfos[4]
  await loadMap(map, mapInfo)
}

load().catch(e => console.error(e))
