const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const webpackBase = require('./webpack.base.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

/* eslint-disable array-callback-return */
Object.keys(webpackBase.entry).map((name) => {
  webpackBase.entry[name] = ['./build/dev-client'].concat(webpackBase.entry[name]);
});

module.exports = merge(webpackBase, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
    }),
  },
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
    }),
    new FriendlyErrorsPlugin(),
  ],
});
