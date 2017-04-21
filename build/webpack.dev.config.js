const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const webpackBase = require('./webpack.base.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

for (const name of Object.keys(webpackBase.entry)) {
  webpackBase.entry[name] = ['./build/dev-client']
    .concat(webpackBase.entry[name]);
}

module.exports = merge(webpackBase, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap
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
