export const CDN_SERVER = process.env.CDN_SERVER || '/files'
export const MAP_ICON_GROUP = '060000'
export const MINI_MAP_GROUP = '063000'
export const NULL_ICON_GROUP = '000000'

const urlFunc = {} as any

export function setUrlFunction(key: string, func: any) {
  urlFunc[key] = func
}

export function getMapUrl(id: string) {
  if (urlFunc.getMapUrl) {
    return urlFunc.getMapUrl(id)
  }
  return `${CDN_SERVER}/maps/${id.replace(/\//g, '_')}.png`
}

export function getBgUrl() {
  if (urlFunc.getBgUrl) {
    return urlFunc.getBgUrl()
  }
  return `${CDN_SERVER}/files/bg.jpg`
}

export function getTileUrl(id: string) {
  if (urlFunc.getTileUrl) {
    return urlFunc.getTileUrl()
  }
  return `${CDN_SERVER}/tiles/${id.replace(/\//g, '_')}`
}

export function getIconUrl(icon: string) {
  const { id, group } = parseIcon(icon)
  if (urlFunc.getIconUrl) {
    return urlFunc.getIconUrl(icon, id, group)
  }
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
  ['#']: string
  id: string
  sizeFactor: number
  ['placeName{Region}']: string
  ['placeName{Sub}']: string
  ['offset{X}']: number
  ['offset{Y}']: number
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
