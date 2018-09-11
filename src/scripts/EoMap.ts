import { Control, imageOverlay, ImageOverlay, Map, map, Marker } from 'leaflet'
import { PosControl } from './controls/PosControl'
import { getMap, getMapKeyById, getMapMarkers } from './fetchData'
import { getMapUrl, IMapInfo } from './loader'
import { MAP_BOUNDS } from './map'
import { createMarker } from './marker'
import { xy } from './XYPoint'

export class EoMap extends Map {
  private posControl: PosControl
  private markers: Marker[]
  private overlay: ImageOverlay
  private previousMapInfo: IMapInfo

  public init() {
    this.markers = []

    const attribution = new Control.Attribution({
      prefix: false
    })
    this.addControl(attribution)

    this.setMaxBounds([[-1024, -1024], [3072, 3072]])
    this.fitBounds(MAP_BOUNDS)
    this.setZoom(0)

    this.posControl = new PosControl({
      position: 'topright',
      scaleFactor: 100
    })
    this.posControl.addTo(this)
  }

  private loadMapOverlay(mapInfo: IMapInfo) {
    this.overlay = createMapOverlay(mapInfo)
    this.overlay.addTo(this)
    return this
  }

  public async loadMapInfo(mapInfo: IMapInfo) {
    if (this.markers.length > 0) {
      this.markers.map(m => m.remove())
      this.markers = []
    }
    if (this.overlay) {
      this.overlay.remove()
      this.overlay = null
    }
    this.loadMapOverlay(mapInfo)
    const markers = await getMapMarkers(mapInfo)
    const previousId = this.previousMapInfo && this.previousMapInfo.id
    for (const marker of markers) {
      const mapMarker = createMarker(marker)
      if (mapMarker) {
        mapMarker.addTo(this)
        this.markers.push(mapMarker)
        if (marker['data{Type}'] === 1 && marker['data{Key}'] === previousId) {
          this.panTo(xy(marker.x, marker.y))
          mapMarker.getElement().classList.add('eorzeamap-label-current')
        }
      }
    }
    this.posControl.setScaleFactor(mapInfo.sizeFactor)
    this.previousMapInfo = mapInfo
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
