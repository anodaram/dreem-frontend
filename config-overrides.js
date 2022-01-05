const rewireReactHotLoader = require('react-app-rewire-hot-loader')
const Dotenv = require('dotenv-webpack');
const WebpackBar = require('webpackbar');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = function override(webpackConfig, env) {

  // enable Hot Module Replacement
  webpackConfig = rewireReactHotLoader(webpackConfig, env);

  // set aliases
  webpackConfig.resolve.alias = {
    ...webpackConfig.resolve.alias,
    //'react-dom$': '@hot-loader/react-dom'
  };

  // disable source maps
  //webpackConfig.devtool = 'none';

  // disable linter
  webpackConfig.module.rules[1] = {};

  // load mjs modules
  webpackConfig.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules/,
    type: "javascript/auto"
  });

  // plugins
  webpackConfig.plugins.push(
    // new BundleAnalyzerPlugin(),
    new Dotenv(),
    new WebpackBar({
      name: '📦  PRIVI Bundler',
      color: "green",
      minimal: false,
      profile: true,
      fancy: true
    })
  );

  return webpackConfig;
}