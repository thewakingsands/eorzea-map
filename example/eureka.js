const el = document.querySelector('.map')
const { L, xy, crel } = window.YZWF.eorzeaMap

const islandMap = {
  Anemos: 414,
  Hydatos: 515,
  Pagos: 467,
  Pyros: 484
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

const circles = []
const circleLayer = new L.LayerGroup()

const EurekaControl = L.Control.extend({
  initialize: function(options) {
    L.Util.setOptions(this, options)
  },
  onAdd: function(map) {
    this._container = use(
      crel('form', { class: 'eorzea-map-control-eureka' }, [
        crel('div', [
          crel('span', { class: 'filter-label' }, '类型'),
          createCheckboxLeft('type', 'mob', '怪物', true),
          createCheckboxLeft('type', 'nm', '恶名精英', true),
          createCheckboxLeft('type', 'elm', '元灵', true)
        ]),
        crel('div', [
          crel('span', { class: 'filter-label' }, ''),
          createCheckboxLeft('type', 'treasure', '幸福兔的财宝', true),
          createCheckboxLeft('type', 'portal', '传送门', true)
        ]),
        crel('div', [
          crel('span', { class: 'filter-label' }, '等级'),
          ' ',
          crel('input', {
            type: 'number',
            name: 'level',
            value: '1',
            min: '1',
            max: '65'
          }),
          ' ~ ',
          crel('input', {
            type: 'number',
            name: 'level',
            value: '65',
            min: '1',
            max: '65'
          })
        ]),
        crel('div', [
          crel('span', { class: 'filter-label' }, '属性'),
          createCheckboxLeft('elemental', 'fire', '火', true),
          createCheckboxLeft('elemental', 'ice', '冰', true),
          createCheckboxLeft('elemental', 'wind', '风', true)
        ]),
        crel('div', [
          crel('span', { class: 'filter-label' }, ''),
          createCheckboxLeft('elemental', 'earth', '土', true),
          createCheckboxLeft('elemental', 'lightning', '雷', true),
          createCheckboxLeft('elemental', 'water', '水', true)
        ]),
        crel('div', [
          crel('span', { class: 'filter-label' }, '分类'),
          createCheckboxLeft('category', 'ashin', '不死系', true),
          createCheckboxLeft('category', 'elemental', '元精系', true),
          createCheckboxLeft('category', 'other', '其它', true)
        ]),
        crel('div', [
          crel('span', { class: 'filter-label' }, '触发'),
          createCheckboxLeft('trigger', 'yes', '用于触发恶名精英', true),
          createCheckboxLeft('trigger', 'no', '其它', true)
        ]),
        crel('div', [
          crel('span', { class: 'filter-label' }, '变异'),
          createCheckboxLeft('mutation', 'yes', '突变', true),
          createCheckboxLeft('mutation', 'yes', '适应', true),
          createCheckboxLeft('mutation', 'no', '其它', true)
        ])
      ]),
      form => {
        form.addEventListener('change', () => {
          const formData = new FormData(form)
          const data = {}
          for (const [key, value] of formData.entries()) {
            data[key] = data[key] || []
            data[key].push(value)
          }
          console.log(data)
          // circleLayer.clearLayers()
        })
      }
    )

    for (const eventName of 'mousedown pointerdown mouseup pointerup click mousemove pointermove dblclick wheel'.split(
      ' '
    )) {
      this._container.addEventListener(eventName, e => e.stopPropagation())
    }

    return this._container
  }
})
const eurekaControl = new EurekaControl({ position: 'topright' })

async function getMap() {
  if (window.map) {
    return window.map
  }
  const map = await window.YZWF.eorzeaMap.create(el)
  window.map = map
  eurekaControl.addTo(map)
  return map
}

let colors = null

async function getColors() {
  if (colors) return
  colors = await (await fetch('colors.json')).json()
}

function createCheckboxLeft(name, value, label, checked) {
  return crel('label', [
    crel('input', { type: 'checkbox', checked, name, value }),
    crel('i', { class: 'input-after' }),
    crel('span', ' ' + label)
  ])
}

function use(el, ...handlers) {
  for (const h of handlers) {
    h(el)
  }
  return el
}

async function main(islandName) {
  await getColors()
  const map = await getMap()
  circleLayer.remove()
  circleLayer.clearLayers()

  await map.loadMapKey(islandMap[islandName])
  const pos = await (await fetch(`output/${islandName}/pos.json`)).json()
  const meta = await (await fetch(`output/${islandName}/meta.json`)).json()
  for (const [index, item] of pos.entries()) {
    const { x, y, r, id } = item

    const color = c(meta[id].elemental, meta[id].level, islandName)
    const circle = L.circle(xy(map.fromMapXY2D(x, y)), Math.max(r, 6), {
      fillColor: color,
      fillOpacity: 0.7,
      stroke: false,
      color,
      weight: 2,
      opacity: 0.7
    }).bindTooltip(formatText(meta[id], index, id, meta))
    circle.meta = meta[id]

    circle.addTo(circleLayer)
    circles.push(circle)
  }
  circleLayer.addTo(map)
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
  return colors[colorNames[type]][indexStr]
}
