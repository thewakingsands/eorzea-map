export const CDN_SERVER = '/files'
export const MAP_ICON_GROUP = '060000'
export const MINI_MAP_GROUP = '063000'
export const NULL_ICON_GROUP = '000000'

export function getMapUrl(id: string) {
  return `${CDN_SERVER}/maps/${id.replace(/\//g, '_')}.png`
}

export function getIconUrl(icon: string) {
  const { id, group } = parseIcon(icon)
  if (id === NULL_ICON_GROUP) {
    return null
  }
  if (group === MAP_ICON_GROUP) {
    return `${CDN_SERVER}/icons/${id}.png`
  }
  if (group === MINI_MAP_GROUP) {
    return `${CDN_SERVER}/minimap/${id}.png`
  }
  throw new Error(`Invalid icon url, no ${group} group: ${icon}`)
}

export function parseIcon(icon: string): IIconParseResult {
  const matches = icon.match(/^ui\/icon\/(\d{6})\/(\d{6})\.tex/)
  if (!matches) {
    throw new Error(`Invalid icon url: ${icon}`)
  }
  const group = matches[1]
  const id = matches[2]
  return {
    group,
    id
  }
}

export interface IIconParseResult {
  group: string
  id: string
}

export interface IMapInfo {
  id: string
  sizeFactor: number
  ['placeName{Region}']: string
  ['placeName{Sub}']: string
  territoryType: string
  placeName: string
  mapMarkerRange: number
}

export interface IMapMarker {
  ['#']: string
  x: number
  y: number
  icon: string
  ['placeName{Subtext}']: string
  subtextOrientation: number
  mapMarkerRegion: string
  type: number
  ['data{Type}']: number
  ['data{Key}']: string
}
