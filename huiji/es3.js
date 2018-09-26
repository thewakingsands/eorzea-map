const glob = require('glob').sync
const es3ify = require('es3ify').transform
const fs = require('fs')

const appJs = glob('dist/production/app.*.js')[0]
const appContent = fs.readFileSync(appJs).toString()

const transformedContent = es3ify(appContent)
fs.writeFileSync('dist/production/app.es3.js', transformedContent)