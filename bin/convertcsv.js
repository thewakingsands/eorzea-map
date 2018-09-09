const fs = require('fs')

function go(name) {
  console.log(name)
  const buf = fs.readFileSync(`generated/${name}.csv`)
  const lines = buf.toString().split('\r\n')
  if (lines.length < 3) {
    return
  }
  const idrow = lines[0].split(',')
  const namerow = lines[1].split(',')
  const datarows = lines.slice(3)
  for (let i = 0; i < idrow.length; i++) {
    namerow[i] = camelCase(namerow[i] || idrow[i])
  }
  const results = []
  for (let i = 0; i < datarows.length; i++) {
    const row = datarows[i];
    if (!row) {
      continue
    }
    const result = {}
    let cols = row.split(',')
    while (cols.length < idrow.length) {
      i++
      const nextCols = datarows[i].split(',')
      cols[cols.length - 1] += `\\n${nextCols[0]}`
      cols = cols.concat(nextCols.splice(1))
    }
    for (let i = 0; i < namerow.length; i++) {
      if (namerow[i] === '#') {
        result[namerow[i]] = cols[i]
      }
      else {
        result[namerow[i]] = convert(cols[i])
      }
    }
    results.push(result)
  }
  const resultName = camelCase(name)
  const resultJson = results.map(x => JSON.stringify(x));
  fs.writeFileSync(`generated/webroot/data/${resultName}.json`, `[
  ${resultJson.join(',\n  ')}
]`)
}

function convert(data) {
  if (data === 'True') {
    return true
  }
  if (data === 'False') {
    return false
  }
  try {
    return JSON.parse(data)
  } catch (e) {
    return data
  }
}

function camelCase(pascalCase) {
  return pascalCase[0].toLowerCase() + pascalCase.slice(1)
}

go('Map')
go('MapMarker')
go('MapMarkerRegion')
go('MapSymbol')
