const path = require('path');
const config = require('../config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.assetsPath = (_path) => {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory;
  return path.posix.join(assetsSubDirectory, _path);
};

exports.resolve = dir => path.join(__dirname, '..', dir);

exports.cssLoaders = (options = { sourceMap: false }) => {
  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap,
    },
  };

  const generateLoaders = (loader, loaderOptions) => {
    const loaders = [cssLoader];

    if (loader) {
      loaders.push({
        loader: `${loader}-loader`,
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap,
        }),
      });
    }

    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
      });
    }

    return loaders;
  };

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentSyntax: true }),
    scss: generateLoaders('scss'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus'),
  };
};

exports.styleLoaders = (options) => {
  const output = [];
  const loaders = exports.cssLoaders(options);
  for (const extension of Object.keys(loaders)) {
    const loader = loaders[extension];
    output.push({
      test: new RegExp(`\\.${extension}$`),
      use: loader,
    });
  }
  return output;
};
