export const CDN_SERVER = process.env.CDN_SERVER || '/files'
export const NULL_ICON_GROUP = '000000'

const urlFunc = {} as any
let baseUrl = CDN_SERVER

export function setUrlFunction(key: string, func: any) {
  urlFunc[key] = func
}

export function getMapUrl(id: string) {
  if (urlFunc.getMapUrl) {
    return urlFunc.getMapUrl(id)
  }
  return `${baseUrl}/maps/${id.replace(/\//g, '_')}.png`
}

export function getBgUrl() {
  if (urlFunc.getBgUrl) {
    return urlFunc.getBgUrl()
  }
  return `${baseUrl}/files/bg.jpg`
}

export function getTileUrl(id: string) {
  if (urlFunc.getTileUrl) {
    return urlFunc.getTileUrl()
  }
  return `${baseUrl}/tiles/${id.replace(/\//g, '_')}`
}

export function getIconUrl(icon: string) {
  const { id, group } = parseIcon(icon)
  if (urlFunc.getIconUrl) {
    return urlFunc.getIconUrl(icon, id, group)
  }
  if (id === NULL_ICON_GROUP) {
    return null
  }
  return `https://cafemaker.wakingsands.com/i/${group}/${id}.png`
}

export function parseIcon(icon: string): IIconParseResult {
  if (!icon) {
    return {
      group: NULL_ICON_GROUP,
      id: NULL_ICON_GROUP
    }
  }
  const matches = `${icon}`.match(/^ui\/icon\/(\d{6})\/(\d{6})\.tex/)
  if (!matches) {
    console.warn('invalid icon url: ', icon)
    return {
      group: NULL_ICON_GROUP,
      id: NULL_ICON_GROUP
    }
  }
  const group = matches[1]
  const id = matches[2]
  return {
    group,
    id
  }
}

export function setBaseUrl(url: string) {
  baseUrl = url
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
