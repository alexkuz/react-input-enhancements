var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var SimpleProgressPlugin = require('webpack-simple-progress-plugin');

var config = {
  devServerPort: 3000
};

var isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  devtool: 'eval',
  entry: isProduction
    ? ['./demo/src/js/index']
    : [
        'webpack-dev-server/client?http://localhost:' + config.devServerPort,
        'webpack/hot/only-dev-server',
        './demo/src/js/index'
      ],
  output: {
    path: path.resolve(__dirname, 'demo/dist'),
    filename: 'js/bundle.js'
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
      ].reduce(function(env, key) {
        env[key] = JSON.stringify(process.env[key]);
        return env;
      }, {})
    }),
    new webpack.NoErrorsPlugin(),
    new SimpleProgressPlugin()
  ].concat(isProduction ? [] : [new webpack.HotModuleReplacementPlugin()]),
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules', path.join(__dirname, 'src')]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'demo/src/js')
        ]
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader?-minimize', 'postcss-loader']
      }
    ]
  },
  devServer: isProduction
    ? undefined
    : {
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
