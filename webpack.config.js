var CopyWebpackPlugin = require('copy-webpack-plugin');

var webpack = require('webpack');

// dev环境配置
module.exports = {
  devtool: 'eval-source-map', // 生成source-map追踪js错误
  entry: __dirname + '/src/index.js', // 程序入口
  output: {
    path: __dirname + '/server',
    filename: 'app.js',
  },
  eslint: {
    configFile: __dirname + '/.eslintrc.js',
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
        loader: 'url',
      },
      {
        test: /\.css/,
        loader: 'style!css?localIdentName=[local]-[hash:base64:5]',
      },
      {
        test: /\.less/,
        loader: 'style!css?modules&localIdentName=[local]-[hash:base64:5]!less',
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './src/resource/music/music.mp3' },
      { from: './src/resource/css/loader.css' },
    ]),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: './server',
    colors: true,
    historyApiFallback: false,
    port: 8080, // defaults to "8080"
    hot: true, // Hot Module Replacement
    inline: true, // Livereload
    host: '0.0.0.0',
  },
};
