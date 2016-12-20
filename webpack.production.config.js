var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var version = require('./package.json').version;

// production环境配置
module.exports = {
  devtool: 'source-map',// 生成source-map追踪js错误
  entry: __dirname + '/src/index.js',// 程序入口
  output: {
    path: __dirname + '/build',
    filename: 'app-'+version+'.js',
  },
  eslint: {
    configFile: __dirname + '/.eslintrc.js'
  },
  module: {
    loaders: [
      {
        test: /\.(json)$/,
        exclude: /node_modules/,
        loader: 'json',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel!eslint-loader',
      },
      {
        test: /\.(?:png|jpg|gif)$/,
        loader: 'url?limit=8192', //小于8k,内嵌;大于8k生成文件
      },
      {
        test: /\.less/,
        loader: ExtractTextPlugin.extract('style', 'css?modules&localIdentName=[hash:base64:4]!less'),
      },
    ],
  },
  plugins:[
    new CopyWebpackPlugin([
      { from: './src/resource/music/music.mp3' },
      { from: './src/resource/css/loader.css' },
    ]),
    new HtmlWebpackPlugin({
        template: __dirname + '/server/index.tmpl.html'
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin('css-' + version + '.css'),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"',
    }),
  ],
};
