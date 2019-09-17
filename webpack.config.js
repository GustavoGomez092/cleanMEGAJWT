const path = require('path')
const nodeExternals = require('webpack-node-externals')
require('dotenv').config()
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')

const { NODE_ENV } = process.env

module.exports = {
  entry: {
    server: './src/server.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'server.bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: path.resolve(__dirname, 'node_modules/'),
      loader: 'babel-loader',
      query: {
        presets: ['@babel/preset-env']
      }
    }]
  },
  plugins: [
    new CaseSensitivePathsPlugin()
  ],
  mode: NODE_ENV,
  target: 'node',
  watch: NODE_ENV === 'development',
  externals: [nodeExternals()]
}
