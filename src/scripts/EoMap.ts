import {
  Control,
  imageOverlay,
  ImageOverlay,
  Layer,
  map,
  Map as LFMap,
  Marker,
  tileLayer,
  TileLayerOptions
} from 'leaflet'
import { NavigateControl } from './controls/NavigateControl'
import { PosControl } from './controls/PosControl'
import { getMap, getMapKeyById, getMapMarkers, IRegion } from './fetchData'
import { AxiesGridLayer } from './layers/AxiesGridLayer'
import { DebugLayer } from './layers/DebugLayer'
import { getBgUrl, getMapUrl, getTileUrl, IMapInfo } from './loader'
import { MAP_BOUNDS, MAP_SIZE } from './map'
import { createMarker } from './marker'
import { xy } from './XYPoint'

export class EoMap extends LFMap {
  public mapInfo: IMapInfo

  private markers: Marker[]

  private tileLayer: Layer
  private debugLayer: Layer
  private backgroundLayer: ImageOverlay

  private previousMapInfo: IMapInfo
  private updateInfoHandlers: Map<any, any>

  public init(regions: IRegion[]) {
    this.markers = []
    this.updateInfoHandlers = new Map()

    const attribution = new Control.Attribution({
      prefix: false
    })
    this.addControl(attribution)

    this.setMaxBounds([[-1024, -1024], [3072, 3072]])
    this.fitBounds(MAP_BOUNDS)
    this.setZoom(-1)

    new PosControl({
      position: 'topright',
      scaleFactor: 100
    }).addTo(this)

    new NavigateControl({
      position: 'topleft',
      regions
    }).addTo(this)

    this.backgroundLayer = imageOverlay(getBgUrl(), MAP_BOUNDS, {
      attribution:
        'FINAL FANTASY XIV © 2010 - 2018 SQUARE ENIX CO., LTD. All Rights Reserved.',
      opacity: 0.5,
      pane: 'tilePane'
    }).addTo(this)
  }

  private loadMapLayer(mapInfo: IMapInfo) {
    // const url = getMapUrl(mapInfo.id)
    const tileOptions: TileLayerOptions = {
      bounds: MAP_BOUNDS,
      minZoom: -3,
      maxNativeZoom: 0
    }
    const tileUrl = getTileUrl(mapInfo.id)
    this.tileLayer = tileLayer(`${tileUrl}/{z}_{x}_{y}.jpg`, tileOptions)
    this.tileLayer.addTo(this)

    this.debugLayer = new DebugLayer(tileOptions)
    this.debugLayer.addTo(this)
    return this
  }

  public async loadMapInfo(mapInfo: IMapInfo) {
    this.mapInfo = mapInfo
    if (this.markers.length > 0) {
      this.markers.map(m => m.remove())
      this.markers = []
    }
    if (this.tileLayer) {
      this.tileLayer.remove()
      this.tileLayer = null
    }
    if (this.debugLayer) {
      this.debugLayer.remove()
      this.debugLayer = null
    }
    this.loadMapLayer(mapInfo)
    const markers = await getMapMarkers(mapInfo)
    const previousId = this.previousMapInfo && this.previousMapInfo.id
    let panPoint: [number, number] = xy(MAP_SIZE / 2, MAP_SIZE / 2)
    for (const marker of markers) {
      const mapMarker = createMarker(marker)
      if (mapMarker) {
        mapMarker.addTo(this)
        this.markers.push(mapMarker)
        if (marker['data{Type}'] === 1 && marker['data{Key}'] === previousId) {
          panPoint = xy(marker.x, marker.y)
          mapMarker.getElement().classList.add('eorzeamap-label-current')
        }
      }
    }
    this.panTo(panPoint)
    // this.posControl.setScaleFactor(mapInfo.sizeFactor)
    this.previousMapInfo = mapInfo
    this.fire('updateInfo', { mapInfo })
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

  public onUpdateInfo(handler: (info: IMapInfo) => void) {
    this.offUpdateInfo(handler)

    const realHandler = (e: any) => {
      handler(e.mapInfo)
    }
    this.on('updateInfo', realHandler)

    this.updateInfoHandlers.set(handler, realHandler)
  }

  public offUpdateInfo(handler: (info: IMapInfo) => void) {
    if (this.updateInfoHandlers.has(handler)) {
      this.off('updateInfo', this.updateInfoHandlers.get(handler))
    }
  }
}
