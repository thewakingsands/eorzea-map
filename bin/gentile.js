const sharp = require('sharp')
const mkdirp = require('mkdirp')
const glob = require('glob')
const path = require('path')
const Promise = require('bluebird')
const fs = require('fs')

const minZoom = -3
const maxZoom = 0
const MAP_SIZE = 2048
const TILE_SIZE = 256

function calcZoomedSize(zoom) {
  const factor = Math.pow(2, 3 + zoom)
  return MAP_SIZE / factor
}

function calcTilesRowAmount(zoom) {
  return Math.pow(2, 3 + zoom)
}

function calcTopLeft(size, row, col) {
  return {
    left: row * size,
    top: col * size
  }
}

function getFilename(zoom, amount, row, col) {
  return `${zoom}_${row}_${col - amount}.jpg`
}

function getTileArgs() {
  const tileArgs = []
  for (let zoom = minZoom; zoom <= maxZoom; zoom++) {
    const size = calcZoomedSize(zoom)
    const amount = calcTilesRowAmount(zoom)
    for (let row = 0; row < amount; row++) {
      for (let col = 0; col < amount; col++) {
        const {top, left} = calcTopLeft(size, row, col)
        const fileName = getFilename(zoom, amount, row, col)
        tileArgs.push({
          top, left, fileName, zoom, size, amount, col, row
        })
      }
    }
  }
  return tileArgs
}

function tileFile(originalFile, outDir) {
  mkdirp.sync(outDir)
  const tileArgs = getTileArgs()
  return Promise.map(tileArgs, ({col, row, zoom, top, left, fileName, size}) => {
    const destFile = path.join(outDir, fileName)
    if (fs.existsSync(destFile)){
      return
    }
    console.log(`  + ${originalFile} (${row}, ${col}) @ ${zoom}; topLeft = (${top}, ${left})`)
    return sharp(originalFile)
    .extract({
      top: top,
      left: left,
      width: size,
      height: size
    })
    .resize(TILE_SIZE, TILE_SIZE)
    .jpeg({quality: 90, progressive: true})
    .toFile(destFile)
  }, { concurrency: 4 })
}

async function generateAll() {
  await generateBackground()
  const files = glob.sync('generated/webroot/maps/*.png')
  for (const file of files) {
    const basename = path.basename(file).replace(/\.png$/, '')
    console.log(`- ${basename}`)
    await tileFile(file, `generated/webroot/tiles/${basename}/`)
  }
}

async function generateBackground() {
  return sharp('generated/webroot/maps/region_99.png')
  .jpeg({quality: 90, progressive: true})
  .toFile('generated/webroot/files/bg.jpg')
}

generateAll()
.catch(e => {
  console.error(e)
  process.exit(1)
})
