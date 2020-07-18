const el = document.querySelector('.map')
const { L, xy } = window.YZWF.eorzeaMap

const islandMap = {
  Anemos: 414,
  Hydatos: 515,
  Pagos: 467,
  Pyros: 484
}

async function getMap() {
  if (window.map) {
    return window.map
  }
  const map = await window.YZWF.eorzeaMap.create(el)
  window.map = map
  return map
}

let colors = null

async function getColors() {
  if (colors) return
  colors = await (await fetch('colors.json')).json()
}

const circles = []

async function main(islandName) {
  await getColors()
  const map = await getMap()
  for (const c of circles) {
    c.remove()
  }

  await map.loadMapKey(islandMap[islandName])
  const pos = await (await fetch(`output/${islandName}/pos.json`)).json()
  const meta = await (await fetch(`output/${islandName}/meta.json`)).json()
  for (const [index, item] of pos.entries()) {
    const { x, y, r, id } = item

    const color = c(meta[id].elemental, meta[id].level, islandName)
    const circle = L.circle(xy(map.fromMapXY2D(x, y)), Math.max(r, 2), {
      color
    }).bindTooltip(formatText(meta[id], index, id, meta))

    circle.addTo(map)
    circles.push(circle)
  }
}

const typeMap = {
  mob: '怪物',
  nm: '恶名精英',
  elm: '元灵'
}
const elementalMap = {
  fire: '火',
  ice: '冰',
  wind: '风',
  earth: '土',
  lightning: '雷',
  water: '水',
  none: '无'
}
const conditionMap = {
  all: '无特殊条件'
}
const conditionValidate = /^((强风|晴朗|暴雨|小雪|暴雪|打雷|热浪|薄雾|灵风|妖雾|雷雨|有风|有雨|有雪|有雾|乱灵流)?(白天|夜晚)?\/?)+$/
function formatText(meta, index, id, metaMap) {
  const {
    type,
    name,
    elemental,
    level,
    condition,
    isElements,
    isAshkin,
    mutation,
    adaptation,
    triggers,
    triggerBy
  } = meta
  const typeName = typeMap[type] || type
  const elmName = elementalMap[elemental] || elemental
  const conditionName = conditionMap[condition] || condition

  const list = []
  list.push(`[${typeName}] ${elmName} Lv.${level} <b>${name}</b>`)
  list.push(`元精：${isElements} 不死：${isAshkin}`)
  if (condition !== 'all') {
    if (!condition.match(conditionValidate))
      console.error(`${name} 的刷新条件 ${condition} 不符合规则`)
    list.push(`<b>${conditionName}</b> 时才会出现`)
  }
  if (mutation) {
    if (!mutation.match(conditionValidate))
      console.error(`${name} 的变异条件 ${mutation} 不符合规则`)
    list.push(`<b>${mutation}</b> 可能突然变异`)
  }
  if (adaptation) {
    if (!adaptation.match(conditionValidate))
      console.error(`${name} 的适应条件 ${adaptation} 不符合规则`)
    list.push(`<b>${adaptation}</b> 可能适应环境`)
  }
  if (triggers) {
    list.push(`击杀一定数量可触发 <b>${metaMap[triggers].name}</b>`)
  }
  if (triggerBy) {
    list.push(`通过击杀一定数量 <b>${metaMap[triggerBy].name}</b> 触发`)
  }
  list.push(`<span class="debug">pos.json:${index + 2} meta#${id}</span>`)

  return list.join('<br>')
}

function onHashUpdate() {
  const islandName = location.hash.slice(1)
  islandName && main(islandName)
}

window.onhashchange = onHashUpdate
onHashUpdate()

const islandLevels = {
  Anemos: [0, 20],
  Pagos: [20, 35],
  Pyros: [35, 50],
  Hydatos: [50, 60]
}
const colorNames = {
  fire: 'red',
  ice: 'blue',
  wind: 'green',
  earth: 'amber',
  lightning: 'purple',
  water: 'cyan',
  none: 'grey'
}

function c(type, level, islandName) {
  const levels = islandLevels[islandName]
  const levelRate = Math.max(level - levels[0], 0) / levels[1]
  const index = levelRate > 0.9 ? '9' : levelRate.toFixed(1)[2]
  const indexStr = index === '0' ? '50' : `${index}00`
  if (!colors[colorNames[type]]) {
    console.log(type)
  }
  return colors[colorNames[type]][indexStr]
}
