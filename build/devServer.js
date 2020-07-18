const express = require('express')
const path = require('path')
const rollup = require('rollup')
const readline = require('readline')
const chalk = require('chalk')
const ms = require('ms')

const app = express()
const port = process.env.PORT || 8234

app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname, '../example/index.html'))
})

app.use(express.static('./'))
app.use('/files', express.static('./generated/webroot'))
app.use('/huiji', express.static('./huiji'))
app.use('/vendor', express.static('./node_modules'))

console.log(`Starting server at http://localhost:${port}`)
app.listen(port)

const watcher = rollup.watch(require('./rollup.config.js'))
watcher.on('event', function(event) {
  const filename = chalk.cyan.bold(event.input)
  switch (event.code) {
    case 'START':
      readline.cursorTo(process.stdout, 0, 0)
      readline.clearScreenDown(process.stdout)
      console.log(chalk.yellow.bold('Building ...'))
      break
    case 'BUNDLE_START':
      console.log(chalk.yellow.bold(`Building ${filename} ...`))
      break
    case 'BUNDLE_END':
      console.log(chalk.green(`* Built ${filename} in ${ms(event.duration)}.`))
      break
    case 'END':
      console.log(
        chalk.green.bold(`Build finished at http://localhost:${port}`)
      )
      break
    case 'ERROR':
      console.error('error', event)
      break
    case 'FATAL':
      console.error('fatal', event)
  }
})
