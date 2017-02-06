var config = require('./w.config');

// dev环境配置
module.exports = {
  devtool: config.devtool,
  entry: config.entry,
  output: {
    path: __dirname + '/server',
    filename: 'app.js',
  },
  eslint: config.eslint,
  module: {
    loaders: config.loaders
  },
  plugins: config.devPlugins,
  devServer: config.devServer,
  postcss: config.postcss
};
