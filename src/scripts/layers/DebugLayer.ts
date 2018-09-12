import { Coords, DoneCallback, GridLayer } from 'leaflet'

export class DebugLayer extends GridLayer {
  public createTile(coords: Coords, done: DoneCallback): HTMLElement {
    const tile = document.createElement('div')
    tile.textContent = `(${coords.x}, ${coords.y}) @ ${coords.z}`
    tile.style.border = '1px solid red'
    tile.style.boxSizing = 'border-box'
    setTimeout(() => {
      done(null, tile)
    }, 200)
    return tile
  }
}
