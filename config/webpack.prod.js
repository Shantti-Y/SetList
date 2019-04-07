const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.config.js');
const MinifyPlugin = require("babel-minify-webpack-plugin");

const entryDir = '..'

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, `${entryDir}/dist/prod`),
    filename: '[name].js',
    libraryTarget: "umd"
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.rootUrl': JSON.stringify('https://setlify-236901.appspot.com/'),
      'process.env.apiUrl': JSON.stringify('https://setlify-236901.appspot.com/')
    })
  ]
});