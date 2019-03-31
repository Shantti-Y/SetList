const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
require('dotenv').config();

const frontendDir = '../frontend';
const entryDir = '../frontend/entrypoints';

module.exports = {
  entry: {
    index: ['@babel/polyfill', path.resolve(__dirname, `${entryDir}/index.js`)],
    callback: ['@babel/polyfill', path.resolve(__dirname, `${entryDir}/callback.js`)]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              'rsuite'
            ]
          }
        }
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'ts-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.less$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "less-loader",
          options: {
            javascriptEnabled: true
          }
        }]
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader!file-loader'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=semantic/dist/themes/default/assets/fonts/[name].[ext]'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.jpg', '.scss'],
    alias: {
      '@apis': path.resolve(__dirname, `${frontendDir}/apis`),
      '@assets': path.resolve(__dirname, `${frontendDir}/assets`),
      '@components': path.resolve(__dirname, `${frontendDir}/components`),
      '@layouts': path.resolve(__dirname, `${frontendDir}/layouts`),
      '@routes': path.resolve(__dirname, `${frontendDir}/routes`)
    }
  },
  plugins: [
    new ManifestPlugin(),
    new webpack.EnvironmentPlugin(['SPOTIFY_API_CLIENT_ID', 'NODE_ENV'])
    //new CleanWebpackPlugin(['dist/dev'], { watch: true })
  ]
};