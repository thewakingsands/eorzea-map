import { Icon, Marker, Point } from 'leaflet'
import '../stylesheets/index.stylus'
import { fromMapXY2D, toMapXY2D } from './coordinate'
import { initEvents } from './events'
import { getRegion, setApiUrl } from './fetchData'
import { AdvancedTileLayer } from './layers/AdvancedTileLayer'
import * as loader from './loader'
import { initMap } from './map'
import { xy } from './XYPoint'

async function create(mapEl: HTMLElement) {
  mapEl.innerHTML = ''
  const map = await initMap(mapEl)
  initEvents(mapEl, map)
  return map
}

async function init() {
  const mapEl = document.querySelector('section.map') as HTMLElement
  const map = await create(mapEl)

  await map.loadMapKey(92)
}

function simpleMarker(
  x: number,
  y: number,
  iconUrl: string,
  mapInfo: loader.IMapInfo
) {
  const icon = new Icon({
    iconSize: new Point(32, 32),
    iconUrl
  })
  const marker = new Marker(xy(fromMapXY2D(mapInfo, x, y)), {
    icon
  })
  return marker
}

const untypedWindow = window as any

untypedWindow.YZWF = untypedWindow.YZWF || {}
untypedWindow.YZWF.eorzeaMap = {
  create,
  xy,
  simpleMarker,
  setApiUrl,
  AdvancedTileLayer,
  loader,
  getRegion
}

if (untypedWindow.standaloneEorzeaMap) {
  init().catch(e => console.error(e))
}
