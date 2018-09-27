const MWBot = require('mwbot')
const config = require('../config')
const fs = require('fs')

async function upload() {
  const bot = new MWBot()
  await bot.login({
    apiUrl: 'https://ff14.huijiwiki.com/w/api.php',
    username: config.huiji.username,
    password: config.huiji.password
  })
  await bot.getEditToken()
  await uploadFile(bot, 'huiji/loader.js', 'EorzeaMapLoader.js')
  await uploadFile(bot, 'huiji/loader.css', 'EorzeaMapLoader.css')
  await uploadFile(bot, 'dist/production/stylesheets.fa3c98b8.css', 'EorzeaMap.css')
  await uploadFile(bot, 'dist/production/app.es3.js', 'EorzeaMap.js')
}

async function uploadFile(bot, src, dest) {
  console.log(`Uploading ${dest} ...`)
  const content = fs.readFileSync(src).toString()
  const resp = await bot.update('Gadget:' + dest, content, 'bot 自动施工，有问题请联系 [[用户:云泽宛风]]')
  return resp
}

upload()
