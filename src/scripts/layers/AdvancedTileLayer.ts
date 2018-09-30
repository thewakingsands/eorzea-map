import { TileLayer } from 'leaflet'

export class AdvancedTileLayer extends TileLayer {
  public getTileUrl(o) {
    const url = (this as any)._url
    return url
      .replace(/{x}/, o.x)
      .replace(/{y}/, o.y)
      .replace(/{z}/, o.z)
  }
}
