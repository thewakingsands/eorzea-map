import { memoize } from 'lodash'
import { CDN_SERVER, IMapInfo, IMapMarker } from './loader'

export const API_URL = CDN_SERVER

async function realGetAllMaps(): Promise<IMapInfo[]> {
  const res = await fetch(`${API_URL}/data/map.json`)
  const json = await res.json()
  return json
}

const getAllMaps = memoize(realGetAllMaps)

async function realGetAllMapMarkers(): Promise<IMapMarker[]> {
  const res = await fetch(`${API_URL}/data/mapMarker.json`)
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
