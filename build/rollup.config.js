const typescript = require('rollup-plugin-typescript')
const nodeResolve = require('rollup-plugin-node-resolve')
const alias = require('rollup-plugin-alias')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const postcss = require('rollup-plugin-postcss')
const replace = require('rollup-plugin-replace')
const { uglify } = require('rollup-plugin-uglify')
const es3ify = require('rollup-plugin-es3ify')
const postcssUrl = require('postcss-url')

const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'
const libVersion = require('../package.json').version

module.exports = {
  input: 'src/scripts/app.ts',
  output: {
    file: 'dist/map.js',
    format: 'iife',
    name: 'EorzeaMap',
    banner: `/*
 * EorzeaMap v${libVersion} | FFXIV 中文交互式地图
 * Made with love by 肥肥咖啡 FFCAFE.ORG
 * FINAL FANTASY XIV © 2010 - 2018 SQUARE ENIX CO., LTD. All Rights Reserved.
 */`,
    freeze: false,
    sourcemap: !isProduction
  },
  plugins: [
    typescript({
      target: 'es5'
    }),
    commonjs({
      include: 'node_modules/**',
      exclude: ['node_modules/leaflet/**']
    }),
    alias({
      leaflet: 'node_modules/leaflet/dist/leaflet-src.esm.js'
    }),
    nodeResolve(),
    babel(),
    postcss({
      extract: true,
      extensions: ['.css', '.styl', '.stylus'],
      minimize: isProduction,
      sourceMap: false,
      plugins: [postcssUrl({
        url: 'inline'
      })]
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        isProduction ? 'production' : 'development'
      ),
      'process.env.CDN_SERVER': JSON.stringify(
        config.cdnServer || process.env.CDN_SERVER || false
      )
    }),
    isProduction && uglify(),
    isProduction && es3ify()
  ]
}
