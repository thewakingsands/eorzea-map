import * as L from 'leaflet'
import '../stylesheets/index.stylus'
import { fromMapXY2D } from './coordinate'
import { EoMap } from './EoMap'
import { initEvents } from './events'
import { getRegion, setApiUrl } from './fetchData'
import { AdvancedTileLayer } from './layers/AdvancedTileLayer'
import * as loader from './loader'
import { initMap } from './map'
import { xy } from './XYPoint'

const { Icon, Marker, Point } = L

async function create(mapEl: HTMLElement) {
  mapEl.innerHTML = ''
  const map = await initMap(mapEl)
  initEvents(mapEl, map)
  return map
}

async function init() {
  if (window !== top) {
    console.error('本地图现在不允许在 iframe 中使用。CDN 成本高昂，请理解！')
    console.error('如果需要在 iframe 中使用，请联系微博 @云泽宛风')
  }

  const mapEl = document.querySelector('section.map') as HTMLElement
  const map = await create(mapEl)

  if (!(await loadHash(map))) {
    await map.loadMapKey(92)
  }

  window.addEventListener('hashchange', e => {
    loadHash(map)
  })
}

async function loadHash(map: EoMap) {
  const hash = location.hash.slice(1)
  const args: any = hash
    .split('&')
    .map(item => item.split('='))
    .map(kvpair => kvpair.map(decodeURIComponent))
    .reduce((arg, kvpair) => {
      arg[kvpair[0]] = kvpair[1]
      return arg
    }, {})
  if (args.f === 'mark' && args.id && args.x && args.y) {
    await map.loadMapKey(parseInt(args.id))
    const marker = simpleMarker(
      args.x,
      args.y,
      loader.getIconUrl('ui/icon/060000/060561.tex'),
      map.mapInfo
    )
    map.addMarker(marker)
    setTimeout(() => {
      map.setView(map.mapToLatLng2D(args.x, args.y), 0)
    }, 100)
    return true
  }
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

function setCdnUrl(url: string) {
  setApiUrl(`${url}/data/`)
  loader.setBaseUrl(url)
}

const untypedWindow = window as any

untypedWindow.YZWF = untypedWindow.YZWF || {}

export {
  create,
  xy,
  L,
  simpleMarker,
  setApiUrl,
  AdvancedTileLayer,
  loader,
  getRegion,
  setCdnUrl
}

if (untypedWindow.standaloneEorzeaMap) {
  init().catch(e => console.error(e))
}
