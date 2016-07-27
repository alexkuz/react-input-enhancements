var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExportFilesWebpackPlugin = require('export-files-webpack-plugin');
var NyanProgressWebpackPlugin = require('nyan-progress-webpack-plugin');

require('babel-core/polyfill');

var pkg = require('./package.json');
var config = {
  devServerPort: 3000
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
    path: __dirname,
    filename: 'demo/dist/js/bundle.js',
    hash: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: 'demo/src/index.html',
      filename: 'index.html',
      package: pkg
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      },
    }),
    new webpack.NoErrorsPlugin(),
    new NyanProgressWebpackPlugin()
  ].concat(isProduction ? [
    new CleanWebpackPlugin(['index.html', 'demo/dist', 'lib'])
  ] : [
    new ExportFilesWebpackPlugin('index.html'),
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
    quiet: false,
    port: config.devServerPort,
    hot: true,
    stats: {
      chunkModules: false,
      colors: true
    },
    historyApiFallback: true
  }
};
