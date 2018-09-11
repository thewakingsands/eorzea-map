const Bundler = require('parcel-bundler')
const Path = require('path')
const express = require('express')

const app = express()
const port = process.env.PORT || 8234

const file = Path.join(__dirname, 'src/index.html')

const options = {
  outDir: './dist',
  outFile: 'index.html',
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

console.log(`Starting server at http://localhost:${port}`)
app.listen(port)

bundler.bundle()
