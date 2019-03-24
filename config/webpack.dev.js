const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.config.js');

const apiUrl = 'localhost:8080';

const entryDir = '..'

module.exports = merge(common, {
  watch: true,
  mode: 'development',
  output: {
    path: path.resolve(__dirname, `${entryDir}/dist/dev`),
    filename: "[name].js",
    libraryTarget: "umd"
  },
  devtool: 'source-map'
});