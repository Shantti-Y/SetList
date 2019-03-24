const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.config.js');
const MinifyPlugin = require("babel-minify-webpack-plugin");

const apiUrl = '192.168.99.100:3000';

const entryDir = '../../public'

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, `${entryDir}/packs`),
    filename: '[name].[contenthash].js',
    libraryTarget: "umd"
  },
  devtool: 'source-map'
});