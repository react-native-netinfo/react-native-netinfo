/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

const path = require('path');
const webpack = require('webpack');
const babelConfig = require('./../babel.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'index.tsx'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'js/[name].bundle.js',
  },
  target: 'web',
  mode: 'development',
  devtool: 'source-map',
  resolve: {
    modules: [
      path.resolve(__dirname),
      path.resolve(__dirname, '..', 'node_modules'),
    ],
    extensions: ['.web.tsx', '.tsx', '.web.ts', '.ts', '.web.js', '.js'],
    alias: {
      react: path.resolve(__dirname, '..', 'node_modules', 'react'),
      'react-native': path.resolve(
        __dirname,
        '..',
        'node_modules',
        'react-native-web',
      ),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
      },
      {
        test: /\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: babelConfig,
        },
      },
      {enforce: 'pre', test: /\.js$/, loader: 'source-map-loader'},
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({template: path.resolve(__dirname, 'index.html')}),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
/*
module.exports = {
  context: __dirname,
  entry: {
    index: [
      'react-native-webpack/clients/polyfills.js',
      `./index.tsx`,
    ],
  },
  devServer: {
    port: 8081,
    quiet: false,
    noInfo: true,
    lazy: true,
    filename: `[name].bundle`,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
    publicPath: '/',
    stats: { colors: true },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    extensions: ['.web.tsx', ".tsx", '.web.ts', ".ts", '.web.js', ".js"]
  },
};
*/
