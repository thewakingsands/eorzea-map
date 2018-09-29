import typescript from 'rollup-plugin-typescript'
import nodeResolve from 'rollup-plugin-node-resolve'
import alias from 'rollup-plugin-alias'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import replace from 'rollup-plugin-replace'
import { uglify } from 'rollup-plugin-uglify'
import es3ify from 'rollup-plugin-es3ify'

const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'

export default {
  input: 'src/scripts/app.ts',
  output: {
    file: 'dist/example.js',
    format: 'iife',
    name: 'EorzeaMap'
  },
  plugins: [
    typescript(),
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
      extensions: ['.css', '.styl']
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
      'process.env.CDN_SERVER': JSON.stringify(config.cdnServer || process.env.CDN_SERVER || false)
    }),
    uglify(),
    es3ify()
  ]
}
