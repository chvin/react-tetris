import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { version } from './package.json';

// production环境配置
module.exports = {
  devtool: 'source-map', // 生成source-map追踪js错误

  entry: [
    path.join(process.cwd(), './src/index.js'), // 程序入口
  ],

  output: {
    path: path.resolve(__dirname, './build'),
    filename: `app-${version}.js`,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|build|server)/,
        include: path.resolve(process.cwd(), 'src'),
        loaders: ['babel-loader'],
      },
      {
        test: /\.(?:png|jpg|gif)$/,
        loader: ['url?limit=8192'], //小于8k,内嵌;大于8k生成文件
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            // activate source maps via loader query
            {
              loader: 'css-loader',
              options: { sourceMap: true, importLoaders: 1, modules: true, localIdentName: 'hash:base64:4' },
            },
            {
              loader: 'less-loader',
              options: { sourceMap: true },
            },
          ],
        },
        ),
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './src/resource/music/music.mp3' },
      { from: './src/resource/css/loader.css' },
    ]),
    new HtmlWebpackPlugin({
      template: `${__dirname}/server/index.tmpl.html`,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),
    new ExtractTextPlugin(`css-${version}.css`),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
  ],
};
