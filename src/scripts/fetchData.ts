import memoize from 'lodash-es/memoize'
import { CDN_SERVER, IMapInfo, IMapMarker } from './loader'

let API_URL = CDN_SERVER + '/data/'

export function setApiUrl(url: string) {
  API_URL = url
}

const fetchOptions: RequestInit = {
  mode: 'cors',
  credentials: 'omit'
}

async function realGetAllMaps(): Promise<IMapInfo[]> {
  const json = await fetchDataFile('map.json')
  return json
}

const getAllMaps = memoize(realGetAllMaps)

async function realGetAllMapMarkers(): Promise<IMapMarker[]> {
  const json = await fetchDataFile('mapMarker.json')
  return json
}

const getAllMapMarkers = memoize(realGetAllMapMarkers)

export async function getMapMarkers(map: IMapInfo): Promise<IMapMarker[]> {
  const markers = await getAllMapMarkers()
  return markers
    .filter(x => x['#'].startsWith(`${map.mapMarkerRange}.`))
    .reverse()
}

export async function getMap(mapKey: number): Promise<IMapInfo> {
  const maps = await getAllMaps()
  return maps[mapKey]
}

export async function getMapKeyById(mapId: string): Promise<number> {
  const maps = await getAllMaps()
  const map = maps.find(x => x.id === mapId)
  if (!map) {
    return null
  }
  return parseInt(map['#'])
}

// tslint:disable-next-line:only-arrow-functions
export const getRegion = memoize(async function(): Promise<IRegion[]> {
  const json = await fetchDataFile('region.json')
  return json
})

async function fetchDataFile(filename: string) {
  let requestUrl = API_URL + filename
  if (API_URL.indexOf('%s') > -1) {
    requestUrl = API_URL.replace(/%s/g, filename)
  }
  const res = await fetch(requestUrl, fetchOptions)
  const json = await res.json()
  if (json.data) {
    return json.data
  }
  return json
}

export interface IRegion {
  regionName: string
  maps: Array<{
    id: string
    key: number
    hierarchy: number
    name: string
    subName: string
  }>
}
