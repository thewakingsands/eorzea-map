import { Coords, DoneCallback, GridLayer } from 'leaflet'

export class DebugLayer extends GridLayer {
  public createTile(coords: Coords, done: DoneCallback): HTMLElement {
    const tile = document.createElement('div')
    tile.textContent = `(${coords.x}, ${coords.y}) @ ${coords.z}`
    tile.style.border = '1px solid rgba(255, 0, 0, 0.4)'
    tile.style.boxSizing = 'border-box'
    tile.style.textShadow =
      '0 0 8px black, 0 0 6px black, 0 0 4px black, 0 0 2px black'
    tile.style.fontSize = '14px'
    tile.style.fontFamily = 'monospace'
    setTimeout(() => {
      done(null, tile)
    }, 200)
    return tile
  }
}
