import { DivIcon, Icon, Marker, Point, Tooltip } from 'leaflet'
import {
  getIconUrl,
  IMapMarker,
  MAP_ICON_GROUP,
  NULL_ICON_GROUP,
  parseIcon
} from './loader'
import { xy } from './XYPoint'

const ICON_STORAGE = new Map<string, Icon>()

export function getIcon(icon: string): Icon {
  if (ICON_STORAGE.has(icon)) {
    return ICON_STORAGE.get(icon)
  }
  const { group } = parseIcon(icon)
  if (group === NULL_ICON_GROUP) {
    ICON_STORAGE.set(icon, null)
    return null
  }
  // minimap is not working now
  if (group !== MAP_ICON_GROUP) {
    return null
  }
  // const iconSize =group === MINI_MAP_GROUP ? new Point(1024, 1024) : new Point(32, 32)
  const iconSize = new Point(32, 32)
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
  if (markerInfo.subtextOrientation === 0) {
    return
  }

  let icon: Icon | DivIcon = getIcon(markerInfo.icon)
  const extraClass = []

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

  let direction = orientationMap[markerInfo.subtextOrientation] || 'auto'
  if (!icon) {
    icon = emptyIcon
    direction = 'center'
    extraClass.push('no-icon')
  }

  const html = text.replace(/\n/g, '<br>')

  const marker = new Marker(xy(markerInfo.x, markerInfo.y), {
    icon,
    interactive:
      type === 'aetheryte' || type === 'travel' || !!markerInfo['data{Key}']
  })

  marker.on('add', () => {
    const el = marker.getElement()
    el.dataset.dataKey = markerInfo['data{Key}']
    el.dataset.dataType = `${markerInfo['data{Type}']}`
  })
  ;(marker as any).on('tooltipopen', ({ tooltip }: { tooltip: Tooltip }) => {
    const el = tooltip.getElement()
    el.dataset.dataKey = markerInfo['data{Key}']
    el.dataset.dataType = `${markerInfo['data{Type}']}`
  })

  if (!html) {
    return marker
  }

  const className = [type, direction]
    .concat(extraClass)
    .map(x => `eorzea-map-label-${x}`)
    .concat(['eorzea-map-label'])
    .join(' ')

  marker.bindTooltip(html, {
    permanent: type !== 'tooltip',
    className,
    direction: type === 'tooltip' ? 'auto' : direction,
    interactive: type === 'aetheryte' || type === 'travel'
  })

  if (type !== 'tooltip') {
    marker.openTooltip()
  }
  return marker
}
