const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const entryDir = '../frontend';

module.exports = {
  entry: ['@babel/polyfill', path.resolve(__dirname, `${entryDir}/entry.js`)],
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
        }
      },
      {
        test: /\.(ts|tsx)?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'ts-loader'
      },
      {
        test: /\.scss$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'style-loader!css-loader!sass-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader!file-loader',
            options: {
              name: '/assets/[path][name].[ext]'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.jpg', '.scss'],
    alias: {
      '@apis': path.resolve(__dirname, `${entryDir}/apis`),
      '@layouts': path.resolve(__dirname, `${entryDir}/layouts`),
      '@components': path.resolve(__dirname, `${entryDir}/components`),
      '@routes': path.resolve(__dirname, `${entryDir}/routes`)
    }
  },
  plugins: [
    new ManifestPlugin(),
    //new CleanWebpackPlugin(['dist/dev'], { watch: true })
  ]
};