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
import { fromMapXY2D, toMapXY2D, toMapXY3D } from './coordinate'
import { getMap, getMapKeyById, getMapMarkers, IRegion } from './fetchData'
import { createSvgUrl } from './gridSvg'
import { AdvancedTileLayer } from './layers/AdvancedTileLayer'
import { DebugLayer } from './layers/DebugLayer'
import {
  getBgUrl,
  getIconUrl,
  getTileUrl,
  IMapInfo,
  MINI_MAP_GROUP,
  parseIcon
} from './loader'
import { MAP_BOUNDS, MAP_SIZE } from './map'
import { createMarker } from './marker'
import { xy } from './XYPoint'

export class EoMap extends LFMap {
  public mapInfo: IMapInfo

  private markers: Marker[]
  private overlays: ImageOverlay[]

  private tileLayer: Layer
  private debugLayer: Layer
  private backgroundLayer: ImageOverlay
  private gridOverlay: ImageOverlay

  private previousMapInfo: IMapInfo
  private updateInfoHandlers: Map<any, any>

  public init(regions: IRegion[]) {
    this.markers = []
    this.overlays = []
    this.updateInfoHandlers = new Map()

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
      opacity: 0.5,
      pane: 'tilePane'
    }).addTo(this)

    this.gridOverlay = imageOverlay(createSvgUrl(100), MAP_BOUNDS, {
      opacity: 0.3
    }).addTo(this)
  }

  private loadMapLayer(mapInfo: IMapInfo) {
    const tileOptions: TileLayerOptions = {
      bounds: MAP_BOUNDS,
      minZoom: -3,
      maxNativeZoom: 0
    }
    const tileUrl = getTileUrl(mapInfo.id)
    this.tileLayer = new AdvancedTileLayer(
      `${tileUrl}/{z}_{x}_{y}.jpg`,
      tileOptions
    )
    this.tileLayer.addTo(this)

    this.debugLayer = new DebugLayer(tileOptions)
    // this.debugLayer.addTo(this)

    this.gridOverlay.setUrl(createSvgUrl(mapInfo.sizeFactor))

    return this
  }

  public async loadMapInfo(mapInfo: IMapInfo) {
    this.mapInfo = mapInfo
    if (this.markers.length > 0) {
      this.markers.map(m => m.remove())
      this.markers = []
    }
    if (this.overlays.length > 0) {
      this.overlays.map(m => m.remove())
      this.overlays = []
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
      const { group } = parseIcon(marker.icon)
      if (group === MINI_MAP_GROUP) {
        const url = getIconUrl(marker.icon)
        const overlay = imageOverlay(
          url,
          [
            xy(marker.x - 512, marker.y - 512),
            xy(marker.x + 512, marker.y + 512)
          ],
          {
            interactive: true,
            opacity: 0.5
          }
        )
        this.overlays.push(overlay)
        overlay.addTo(this)
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

  public addMaker(marker: Marker) {
    console.warn('[Deprecated] map.addMaker is a misspell, you should use map.addMarker instead.')
    return this.addMarker(marker)
  }

  public addMarker(marker: Marker) {
    marker.addTo(this)
    this.markers.push(marker)
    return marker
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

  /**
   * 从解包数据的 2D 坐标点数据换算成 UI 用的地图坐标 XY 数据
   * @param x X 坐标
   * @param y Y 坐标
   */
  public toMapXY2D(x: number, y: number) {
    return toMapXY2D(this.mapInfo, x, y)
  }

  /**
   * 从解包数据的 2D 坐标换算成经纬度
   * @param x X 坐标
   * @param y Y 坐标
   */
  public mapToLatLng2D(x: number, y: number) {
    return xy(this.fromMapXY2D(x, y))
  }

  /**
   * 从解包数据的 3D 坐标点换算成 UI 用的地图坐标 XY 数据
   * @param x X 坐标
   * @param z Y 坐标
   */
  public toMapXY3D(x: number, z: number) {
    return toMapXY3D(this.mapInfo, x, z)
  }

  /**
   * 从 UI 上的坐标 XY 数据换算成解包数据的 2D 坐标点
   * @param x X 坐标
   * @param y Y 坐标
   */
  public fromMapXY2D(x: number, y: number) {
    return fromMapXY2D(this.mapInfo, x, y)
  }

  /**
   * 从解包的 3D 数据换算为解包数据的 2D 坐标点
   * @param x X 坐标
   * @param z Z 坐标
   */
  public from3D(x: number, z: number) {
    return this.fromMapXY2D(...this.toMapXY3D(x, z))
  }
}
