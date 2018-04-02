var config = require('./w.config');

// production环境配置
module.exports = {
  devtool: config.devtool,
  entry: config.entry,
  output: {
    path: __dirname + '/docs',
    filename: 'app-' + config.version+'.js',
  },
  eslint: config.eslint,
  module: {
    loaders: config.loaders
  },
  plugins: config.productionPlugins,
  postcss: config.postcss
};
