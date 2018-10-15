import { Icon, Marker, Point } from 'leaflet'
import '../stylesheets/index.stylus'
import { fromMapXY2D, toMapXY2D } from './coordinate'
import { EoMap } from './EoMap'
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
  test(map)
}

function test(map: EoMap) {
  const data = `402.029	191.536	561.425
  627.301	78.429	225.945
  451.54	171.227	-535.67
  -100.457	88.0928	-682.24
  -334.013	133.99	-10.1207
  -660.144	135.546	-376.63
  -311.472	96.2154	-191.631
  328.529	168.645	183.18
  375.354	161.639	-159.341
  -85.6793	111.14	-61.8676`
  const a = data
    .split('\n')
    .map(s => s.trim())
    .map(s => {
      const [x, , z] = s.split('	').map(i => parseInt(i))
      return map.toMapXY3D(x, z)
    })
    .map(s => s.map(i => i.toFixed(1)))
    .map(
      s =>
        `<span class="eorzea-map-trigger show-as-link show-with-icon" data-map-open="true" data-map-name="库尔札斯西部高地" data-map-x="${
          s[0]
        }" data-map-y="${s[1]}">库尔札斯西部高地 (X: ${s[0]}, Y: ${
          s[1]
        })</span>`
    )
    .join('\n')
  console.log(a)
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
    icon,
    zIndexOffset: 1000,
    pane: 'popupPane'
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
