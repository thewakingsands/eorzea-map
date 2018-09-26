const Bundler = require('parcel-bundler')
const Path = require('path')
const express = require('express')
const config = require('./config')

const app = express()
const port = process.env.PORT || 8234
process.env.CDN_SERVER = process.env.CDN_SERVER || config.cdnServer

const file = Path.join(__dirname, 'src/index.html')

const options = {
  outDir: './dist',
  outFile: 'index.html',
  contentHash: false,
  publicUrl: '/',
  watch: process.env.NODE_ENV !== 'production',
  cache: true,
  cacheDir: '.cache',
  minify: process.env.NODE_ENV === 'production',
  target: 'browser',
  https: false,
  logLevel: 3,
  hmrPort: 0,
  sourceMaps: true,
  hmrHostname: '',
  detailedReport: false
}

const bundler = new Bundler(file, options)

app.use(express.static('./dist'))
app.use('/files', express.static('./generated/webroot'))
app.use('/huiji', express.static('./huiji'))

console.log(`Starting server at http://localhost:${port}`)
app.listen(port)

bundler.bundle()
