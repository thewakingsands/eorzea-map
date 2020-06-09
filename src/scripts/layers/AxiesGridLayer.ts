import { Coords, GridLayer } from 'leaflet'

export class AxiesGridLayer extends GridLayer {
  public createTile(coords: Coords): HTMLElement {
    const tile = document.createElement('div')
    tile.style.border = '1px solid green'
    tile.style.boxSizing = 'border-box'
    return tile
  }
}
