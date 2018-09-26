import { initEvents } from './events'
import { initMap } from './map'

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

  const hot = (module as any).hot
  if (hot) {
    hot.accept(() => {
      map.loadMapInfo(map.mapInfo)
    })
  }
}

const untypedWindow = window as any

untypedWindow.YZWF = untypedWindow.YZWF || {}
untypedWindow.YZWF.eorzeaMap = { create }

if (untypedWindow.standaloneEorzeaMap) {
  init().catch(e => console.error(e))
}
