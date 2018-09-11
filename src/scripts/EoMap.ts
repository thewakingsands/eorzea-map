import { Control, Map } from 'leaflet'
import { PosControl } from './controls/PosControl'
import { MAP_BOUNDS } from './map'

export class EoMap extends Map {
  public posControl: PosControl
  public init() {
    const attribution = new Control.Attribution({
      prefix: false
    })
    this.addControl(attribution)

    this.setMaxBounds([[-1024, -1024], [3072, 3072]])
    this.fitBounds(MAP_BOUNDS)
    this.setZoom(0)
  }
}
