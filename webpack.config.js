var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var NyanProgressWebpackPlugin = require('nyan-progress-webpack-plugin');

var config = {
  port: 3000
};

try {
  var localConfig = require('./local.config.json');
  config = Object.assign(config, localConfig);
} catch(e) {}

var isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  devtool: 'eval',
  entry: isProduction ?
    [ './demo/src/js/index' ] :
    [
      'webpack-dev-server/client?http://localhost:' + config.devServerPort,
      'webpack/hot/only-dev-server',
      './demo/src/js/index'
    ],
  output: {
    path: path.resolve(__dirname, 'demo/dist'),
    filename: 'js/bundle.js',
    hash: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: 'demo/src/index.html',
      env: process.env
    }),
    new webpack.DefinePlugin({
      'process.env': [
        'NODE_ENV',
        'npm_package_version',
        'npm_package_name',
        'npm_package_description',
        'npm_package_homepage'
      ].reduce(function (env, key) {
        env[key] = JSON.stringify(process.env[key]);
        return env;
      }, {})
    }),
    new webpack.NoErrorsPlugin(),
    new NyanProgressWebpackPlugin()
  ].concat(isProduction ? [
    new CleanWebpackPlugin(['demo/dist', 'lib'])
  ] : [
    new webpack.HotModuleReplacementPlugin()
  ]),
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: [
      'node_modules',
      'src'
    ]
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel'],
      include: [
        path.join(__dirname, 'src'),
        path.join(__dirname, 'demo/src/js')
      ]
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.css$/,
      loaders: ['style', 'css?-minimize', 'postcss']
    }]
  },
  devServer: isProduction ? null : {
    contentBase: 'demo/dist',
    quiet: false,
    port: config.devServerPort,
    hot: true,
    stats: {
      chunkModules: false,
      colors: true
    },
    historyApiFallback: true
  },
  node: {
    fs: 'empty'
  }
};
