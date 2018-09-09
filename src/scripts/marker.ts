import { DivIcon, Icon, Marker, Point } from 'leaflet'
import {
  getIconUrl,
  IMapMarker,
  MINI_MAP_GROUP,
  NULL_ICON_GROUP,
  parseIcon
} from './loader'
import { xy } from './XYPoint'

const ICON_STORAGE = new Map<string, Icon>()

export function getIcon(icon: string): Icon {
  if (ICON_STORAGE.has(icon)) {
    return ICON_STORAGE.get(icon)
  }
  const { id, group } = parseIcon(icon)
  if (group === NULL_ICON_GROUP) {
    ICON_STORAGE.set(icon, null)
    return null
  }
  const iconSize =
    group === MINI_MAP_GROUP ? new Point(1024, 1024) : new Point(32, 32)
  const iconUrl = getIconUrl(icon)
  const mapIcon = new Icon({
    iconSize,
    iconUrl
  })
  ICON_STORAGE.set(icon, mapIcon)
  return mapIcon
}

const orientationMap = {
  1: 'left',
  2: 'right',
  3: 'bottom',
  4: 'top'
}

const typeMap = {
  0: 'normal',
  1: 'travel',
  3: 'aetheryte',
  4: 'tooltip'
}

const emptyIcon = new DivIcon({
  iconSize: new Point(0, 0)
})

export function createMarker(markerInfo: IMapMarker): Marker {
  let icon: Icon | DivIcon = getIcon(markerInfo.icon)

  let type = typeMap[markerInfo['data{Type}']] || 'unkown'
  if (markerInfo.type === 1) {
    type = 'area'
  }
  const text =
    type === 'tooltip'
      ? markerInfo['data{Key}']
      : markerInfo['placeName{Subtext}']

  if (!icon && !text) {
    return null
  }

  if (!icon) {
    icon = emptyIcon
  }

  const html = text.replace(/\n/g, '<br>')
  const direction = orientationMap[markerInfo.subtextOrientation] || 'auto'

  const marker = new Marker(xy(markerInfo.x, markerInfo.y), {
    icon
  })

  if (!html) {
    return null
  }

  marker.bindTooltip(html, {
    permanent: type !== 'tooltip',
    className: `eorzea-map-label eorzea-map-label-${type} eorzea-map-label-${direction}`,
    direction,
    interactive: type === 'aetheryte' || type === 'travel'
  })

  if (type !== 'tooltip') {
    marker.openTooltip()
  }
  return marker
}
