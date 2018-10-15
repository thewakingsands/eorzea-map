const fs = require('fs')
const maps = require('../generated/webroot/data/map.json')

const regions = {}

for (const map of maps) {
  const regionName = map['placeName{Region}']
  if (!regionName) {
    continue
  }
  const region = (regions[regionName] = regions[regionName] || {
    regionName,
    maps: []
  })
  const subName = map['placeName{Sub}']
  const name = map['placeName']
  if (!name) {
    continue
  }
  if (map['#'] === '487') {
    // 一个假的沙都
    continue
  }
  region.maps.push({
    id: map.id,
    key: parseInt(map['#']),
    hierarchy: map.hierarchy,
    name,
    subName,
    regionName
  })
}

const regionArr = Object.values(regions)
const topNames = ['艾欧泽亚', '东方地域']
const bottomNames = ['？？？？']

const tops = []
for (const name of topNames) {
  tops.push(regionArr.splice(regionArr.indexOf(regions[name]), 1)[0])
}

const bottoms = []
for (const name of bottomNames) {
  bottoms.push(regionArr.splice(regionArr.indexOf(regions[name]), 1)[0])
}

const result = tops.concat(regionArr).concat(bottoms)

fs.writeFileSync(
  'generated/webroot/data/region.json',
  JSON.stringify(result, null, 2)
)
