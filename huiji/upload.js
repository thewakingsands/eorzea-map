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
  await updateGadget(bot, 'huiji/loader.js', 'EorzeaMapLoader.js')
  await updateGadget(bot, 'huiji/loader.css', 'EorzeaMapLoader.css')
  await updateGadget(bot, 'dist/map.css', 'EorzeaMap.css')
  await updateGadget(bot, 'dist/map.js', 'EorzeaMap.js')
  await updateData(bot, 'generated/webroot/data/map.json', 'map.json', true)
  await updateData(
    bot,
    'generated/webroot/data/mapMarker.json',
    'mapMarker.json',
    true
  )
  await updateData(
    bot,
    'generated/webroot/data/region.json',
    'region.json',
    true
  )
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

async function updateData(bot, src, dest, wrap = false) {
  console.log(`Updating ${dest} ...`)
  let content = fs.readFileSync(src).toString()
  if (wrap) {
    content = JSON.stringify({ data: JSON.parse(content) })
  }
  await bot.request({
    action: 'edit',
    title: `Data:EorzeaMap/${dest}`,
    text: content,
    summary: '自动化脚本更新数据，有问题请联系 [[用户:云泽宛风]]',
    bot: true,
    token: bot.editToken
  })
}

upload()
