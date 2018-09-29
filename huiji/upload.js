const MWBot = require('mwbot')
const config = require('../config')
const fs = require('fs')
const glob = require('glob').sync

async function upload() {
  const bot = new MWBot()
  await bot.login({
    apiUrl: 'https://ff14.huijiwiki.com/w/api.php',
    username: config.huiji.username,
    password: config.huiji.password
  })
  await bot.getEditToken()
  await updateGadget(bot, 'huiji/loader.js', 'EorzeaMapLoader.js')
  await updateGadget(bot, 'huiji/loader.css', 'EorzeaMapLoader.css')
  await updateGadget(
    bot,
    glob('dist/production/stylesheets.*.css')[0],
    'EorzeaMap.css'
  )
  await updateGadget(bot, 'dist/production/app.es3.js', 'EorzeaMap.js')
}

async function updateGadget(bot, src, dest) {
  console.log(`Updating ${dest} ...`)
  const content = fs.readFileSync(src).toString()
  await bot.request({
    action: 'edit',
    title: `Gadget:${dest}`,
    text: content,
    summary: '自动化脚本更新代码，有问题请联系 [[用户:云泽宛风]]',
    nocreate: true,
    bot: true,
    token: bot.editToken
  })
}

upload()
