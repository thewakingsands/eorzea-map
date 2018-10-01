const { MWBot } = require('mediawiki2')
const config = require('../config')
const glob = require('glob')
const fs = require('fs')
const path = require('path')

async function upload() {
  const bot = new MWBot('https://ff14.huijiwiki.com/w/api.php')
  await bot.login(config.huiji.username, config.huiji.password)

  if (process.env.UPLOAD_ICON) {
    // 上传 icon
    const files = glob.sync('generated/webroot/icons/*.png')
    for (const file of files) {
      try {
        await uploadFile(bot, file, path.basename(file))
      } catch (e) {
        console.log(e.message)
      }
    }
  }

  if (process.env.UPLOAD_TILE) {
    // 上传图片
    const tiles = glob.sync('generated/webroot/tiles/w1t2_02/*.jpg')
    for (const tile of tiles) {
      try {
        const filename =
          'EorzeaMapTile_' + tile.match(/tiles\/(.*)$/)[1].replace(/\//g, '_')
        await uploadFile(bot, tile, filename)
      } catch (e) {
        console.log(e.message)
      }
    }
  }

  if (process.env.UPLOAD_DATA) {
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

  // await uploadFile(
  //   bot,
  //   'generated/webroot/files/bg.jpg',
  //   'EorzeaMapAssets_bg.jpg'
  // )

  await updateGadget(bot, 'huiji/loader.js', 'EorzeaMapLoader.js')
  await updateGadget(bot, 'huiji/loader.css', 'EorzeaMapLoader.css')
  await updateGadget(bot, 'dist/map.css', 'EorzeaMap.css')
  await updateGadget(bot, 'dist/map.js', 'EorzeaMap.js')
}

async function uploadFile(bot, src, dest) {
  console.log(`Uploading ${dest} ...`)
  return bot.simpleUpload({
    file: src,
    filename: dest,
    ignorewarnings: true,
    comment: '上传游戏解包图标/地图数据，有问题请找 [[用户:云泽宛风]]'
  })
}

async function updateGadget(bot, src, dest) {
  console.log(`Updating ${dest} ...`)
  const content = fs.readFileSync(src).toString()
  await bot.edit({
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
  await bot.edit({
    title: `Data:EorzeaMap/${dest}`,
    text: content,
    summary: '自动化脚本更新数据，有问题请联系 [[用户:云泽宛风]]',
    bot: true,
    token: bot.editToken
  })
}

upload()
