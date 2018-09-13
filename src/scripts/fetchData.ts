import { memoize } from 'lodash'
import { CDN_SERVER, IMapInfo, IMapMarker } from './loader'

export const API_URL = CDN_SERVER
const fetchOptions: RequestInit = {
  mode: 'cors',
  credentials: 'omit'
}

async function realGetAllMaps(): Promise<IMapInfo[]> {
  const res = await fetch(`${API_URL}/data/map.json`, fetchOptions)
  const json = await res.json()
  return json
}

const getAllMaps = memoize(realGetAllMaps)

async function realGetAllMapMarkers(): Promise<IMapMarker[]> {
  const res = await fetch(`${API_URL}/data/mapMarker.json`, fetchOptions)
  const json = await res.json()
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

export const getRegion = memoize(
  async (): Promise<IRegion[]> => {
    const res = await fetch(`${API_URL}/data/region.json`, fetchOptions)
    const json = await res.json()
    return json
  }
)

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
