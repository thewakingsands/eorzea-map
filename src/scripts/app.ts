import { initEvents } from './events'
import { initMap } from './map'

async function init() {
  const mapEl = document.querySelector('section.map') as HTMLElement
  mapEl.innerHTML = ''
  const map = await initMap(mapEl)
  initEvents(mapEl, map)

  await map.loadMapKey(92)

  const hot = (module as any).hot
  if (hot) {
    hot.accept(() => {
      map.loadMapInfo(map.mapInfo)
    })
  }
}

init().catch(e => console.error(e))
