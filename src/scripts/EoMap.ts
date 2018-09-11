import { Control, imageOverlay, Map, map } from 'leaflet'
import { PosControl } from './controls/PosControl'
import { getMap, getMapKeyById, getMapMarkers } from './fetchData'
import { getMapUrl, IMapInfo } from './loader'
import { MAP_BOUNDS } from './map'
import { createMarker } from './marker'

export class EoMap extends Map {
  private posControl: PosControl

  public init() {
    const attribution = new Control.Attribution({
      prefix: false
    })
    this.addControl(attribution)

    this.setMaxBounds([[-1024, -1024], [3072, 3072]])
    this.fitBounds(MAP_BOUNDS)
    this.setZoom(0)
  }

  private loadMapOverlay(mapInfo: IMapInfo) {
    const overlay = createMapOverlay(mapInfo)
    overlay.addTo(this)
    return this
  }

  public async loadMapInfo(mapInfo: IMapInfo) {
    this.loadMapOverlay(mapInfo)
    const markers = await getMapMarkers(mapInfo)
    for (const marker of markers) {
      const mapMarker = createMarker(marker)
      if (mapMarker) {
        mapMarker.addTo(this)
      }
    }
    this.posControl = new PosControl({
      position: 'topright',
      scaleFactor: mapInfo.sizeFactor
    })
    this.posControl.addTo(this)
    return this
  }

  public async loadMapKey(mapKey: number) {
    const mapInfo = await getMap(mapKey)
    return this.loadMapInfo(mapInfo)
  }

  public async loadMapId(mapId: string) {
    const mapKey = await getMapKeyById(mapId)
    return this.loadMapKey(mapKey)
  }
}

function createMapOverlay(mapInfo: IMapInfo) {
  const url = getMapUrl(mapInfo.id)
  const mapImage = imageOverlay(url, MAP_BOUNDS, {
    attribution:
      'FINAL FANTASY XIV © 2010 - 2018 SQUARE ENIX CO., LTD. All Rights Reserved.'
  })
  return mapImage
}
