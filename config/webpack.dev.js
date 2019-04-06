const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.config.js');

const entryDir = '..'

module.exports = merge(common, {
  watch: true,
  mode: 'development',
  output: {
    path: path.resolve(__dirname, `${entryDir}/dist/dev`),
    filename: "[name].js",
    libraryTarget: "umd"
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.rootUrl': JSON.stringify('http://localhost:8080'),
      'process.env.apiUrl': JSON.stringify('http://localhost:8080/api')
    })
  ]
});