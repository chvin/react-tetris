import path from 'path';
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';


// dev环境配置
module.exports = {
  devtool: 'eval-source-map', // 生成source-map追踪js错误
  entry: [
    path.join(process.cwd(), './src/index.js'), // 程序入口
  ],
  output: {
    path: path.resolve(__dirname, './server'),
    filename: 'app.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(?:png|jpg|gif)$/,
        loader: [
          'url-loader',
        ],
      },
      {
        test: /\.css/,
        loaders: [
          'style-loader',
          'css-loader?localIdentName=[local]-[hash:base64:5]',
        ],
      },
      {
        test: /\.less/,
        loaders: [
          'style-loader',
          'css-loader?modules&localIdentName=[local]-[hash:base64:5]',
          'less-loader',
        ],
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
    historyApiFallback: false,
    port: 8080, // defaults to "8080"
    hot: true, // Hot Module Replacement
    inline: true, // Livereload
    host: '0.0.0.0',
  },
};
