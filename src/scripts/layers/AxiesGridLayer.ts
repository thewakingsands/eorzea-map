import { Coords, DoneCallback, GridLayer } from 'leaflet'

export class AxiesGridLayer extends GridLayer {
  public createTile(coords: Coords): HTMLElement {
    const tile = document.createElement('div')
    if (coords.x % coords.z !== 0 || coords.y % coords.z !== 0) {
      return tile
    }
    tile.style.border = '1px solid green'
    tile.style.boxSizing = 'border-box'
    return tile
  }
}
