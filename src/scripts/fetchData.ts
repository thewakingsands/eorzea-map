import { CDN_SERVER, IMapInfo, IMapMarker } from './loader'

export const API_URL = CDN_SERVER

export async function getMaps(): Promise<IMapInfo[]> {
  const res = await fetch(`${API_URL}/data/map.json`)
  const json = await res.json()
  return json
}

async function realGetAllMapMarkers(): Promise<IMapMarker[]> {
  const res = await fetch(`${API_URL}/data/mapMarker.json`)
  const json = await res.json()
  return json
}

let allMapMarkerPromise: Promise<IMapMarker[]> = null
function getAllMapMarkers() {
  if (allMapMarkerPromise === null) {
    allMapMarkerPromise = realGetAllMapMarkers()
  }
  return allMapMarkerPromise
}

export async function getMapMarkers(map: IMapInfo): Promise<IMapMarker[]> {
  const markers = await getAllMapMarkers()
  return markers
    .filter(x => x['#'].startsWith(`${map.mapMarkerRange}.`))
    .reverse()
}
