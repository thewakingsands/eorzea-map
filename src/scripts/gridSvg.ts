import { MAP_SIZE } from './map'

const urlMap = new Map<number, string>()

export function genSvgCode(gridSize: number) {
  return `
<svg width="${MAP_SIZE}px" height="${MAP_SIZE}px" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid" width="${gridSize}px" height="${gridSize}px" patternUnits="userSpaceOnUse">
    <path d="M ${gridSize} 0 L 0 0 0 ${gridSize}" fill="none" stroke="rgb(128, 128, 128)" stroke-width="0.5"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid)" />
</svg>
  `
}

export function createSvgUrl(scaleFactor: number) {
  if (urlMap.has(scaleFactor)) {
    return urlMap.get(scaleFactor)
  }
  const code = genSvgCode(scaleFactor / 4)
    .trim()
    .replace(/\n\s+/, '')
  const url = 'data:image/svg+xml,' + code
  urlMap.set(scaleFactor, url)
  return url
}
