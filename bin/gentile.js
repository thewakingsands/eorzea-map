const sharp = require('sharp')
const mkdirp = require('mkdirp')
const glob = require('glob')
const path = require('path')
const Promise = require('bluebird')
const fs = require('fs')
const _ = require('lodash')

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
        const { top, left } = calcTopLeft(size, row, col)
        const fileName = getFilename(zoom, amount, row, col)
        tileArgs.push({
          top,
          left,
          fileName,
          zoom,
          size,
          amount,
          col,
          row
        })
      }
    }
  }
  return tileArgs
}

function realGetScaledBuffer(filename, zoom) {
  const size = MAP_SIZE * Math.pow(2, zoom)
  return sharp(filename)
    .resize(size, size)
    .toBuffer()
}

const getScaledBuffer = _.memoize(realGetScaledBuffer, (a, b, c) =>
  [a, b, c].join('__')
)

function tileFile(originalFile, outDir) {
  mkdirp.sync(outDir)
  const tileArgs = getTileArgs()
  return Promise.map(
    tileArgs,
    async ({ col, row, zoom, amount, top, left, fileName, size }) => {
      const destFile = path.join(outDir, fileName)
      if (fs.existsSync(destFile)) {
        return
      }
      console.log(
        `  + ${originalFile} (${row}, ${col}) @ ${zoom} ${size}; topLeft = (${col *
          TILE_SIZE}, ${row * TILE_SIZE})`
      )
      return sharp(await getScaledBuffer(originalFile, zoom))
        .extract({
          top: col * TILE_SIZE,
          left: row * TILE_SIZE,
          width: TILE_SIZE,
          height: TILE_SIZE
        })
        .jpeg({ quality: 90, progressive: true })
        .toFile(destFile)
    },
    { concurrency: 4 }
  )
}

async function generateAll() {
  // return tileFile('generated/webroot/maps/w1t1_01.png', 'generated/webroot/tiles/w1t1_01')
  await generateBackground()
  let files = glob.sync('generated/webroot/maps/*.png')
  if (process.argv[2]) {
    files = process.argv.slice(2)
  }
  for (const file of files) {
    const basename = path.basename(file).replace(/\.png$/, '')
    console.log(`- ${basename}`)
    await tileFile(file, `generated/webroot/tiles/${basename}/`)
  }
}

async function generateBackground() {
  return sharp('generated/webroot/maps/region_99.png')
    .jpeg({ quality: 90, progressive: true })
    .toFile('generated/webroot/files/bg.jpg')
}

generateAll().catch(e => {
  console.error(e)
  process.exit(1)
})
