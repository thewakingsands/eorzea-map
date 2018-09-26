const Bundler = require('parcel-bundler')
const path = require('path')
const config = require('./config')

const file = path.join(__dirname, 'src/index.html')
process.env.CDN_SERVER = process.env.CDN_SERVER || config.cdnServer

const options = {
  outDir: './dist/production',
  outFile: 'index.html',
  publicUrl: '/',
  watch: false,
  cache: false,
  cacheDir: '.cache',
  minify: true,
  target: 'browser',
  https: false,
  logLevel: 3,
  hmrPort: 0,
  sourceMaps: true,
  hmrHostname: '',
  detailedReport: false
}

const bundler = new Bundler(file, options)

bundler.bundle()
