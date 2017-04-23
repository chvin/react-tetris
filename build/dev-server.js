require('./check-versions')();

const config = require('../config');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

const opn = require('opn');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const proxyMiddleware = require('http-proxy-middleware');
const webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.config')
  : require('./webpack.dev.config');

const port = process.env.PORT || config.dev.port;
const autoOpenBrowser = config.dev.autoOpenBrowser;
const proxyTable = config.dev.proxyTable;

const app = express();
const compiler = webpack(webpackConfig);

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true,
});

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {},
});
// Force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', (compilation) => {
  compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
    hotMiddleware.publish({ action: 'reload' });
    cb();
  });
});

// Proxy api requests
/* eslint-disable array-callback-return */
Object.keys(proxyTable).map((context) => {
  let options = proxyTable[context];
  if (typeof options === 'string') {
    options = { target: options };
  }
  app.use(proxyMiddleware(options.filter || context, options));
});

// Handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// Serve webpack bundle output
app.use(devMiddleware);

// Enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// Serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath,
  config.dev.assetsSubDirectory);
app.use(staticPath, express.static('./static'));

const uri = `http://localhost:${port}`;

devMiddleware.waitUntilValid(() => {
  console.log(`> Listing at ${uri}\n`);
});

module.exports = app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri);
  }
});

