import { Coords, DoneCallback, GridLayer, TileLayerOptions } from 'leaflet'

export class AxiesGridLayer extends GridLayer {
  constructor(options: TileLayerOptions) {
    super(options)
  }

  public createTile(coords: Coords): HTMLElement {
    const tile = document.createElement('div')
    tile.style.border = '1px solid green'
    tile.style.boxSizing = 'border-box'
    return tile
  }
}
