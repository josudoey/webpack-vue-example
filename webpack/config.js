const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const projectPath = path.resolve(__dirname, '..')
const contentPath = path.resolve(projectPath, 'webpack')
const staticPath = path.resolve(projectPath, 'static')
const contentBase = path.resolve(projectPath, 'public')
const webpackPublicPath = '/bundle/'
const webpackOutputPath = path.join(contentBase, webpackPublicPath)

const isDev = process.env.NODE_ENV !== 'production'

const config = module.exports = {
  projectPath: projectPath,
  contentBase: contentBase,
  static: {
    path: staticPath
  }
}

config.webpack = {
  entry: {
    demo: [path.join(contentPath, 'entry/demo.js')]
  },
  output: {
    path: webpackOutputPath,
    publicPath: webpackPublicPath,
    filename: '[name].js',
    chunkFilename: '[id].js'
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [{
      test: /\.html$/,
      loaders: 'raw-loader!html-minify-loader'
    }, {
      test: /.pug$/,
      loader: 'pug-loader'
    }, {
      test: /\.css$/,
      use: [{
        loader: 'style-loader/useable',
        options: {
          sourceMap: true
        }
      }, {
        loader: 'css-loader'
      }]
    }, {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      include: [
        path.resolve(__dirname, '../webpack')
      ],
      loader: 'babel-loader'
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      query: {
        name: 'img/[name].[hash:8].[ext]'
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      query: {
        name: 'fonts/[name].[hash:8].[ext]'
      }
    }]
  },
  plugins: [
    new CleanWebpackPlugin([contentBase]),
    new webpack.ProvidePlugin({
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: path.join(contentPath, 'html/index/index.pug'),
      filename: '../index.html',
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackHarddiskPlugin()
  ],
  devtool: (isDev) ? 'source-map' : false
}

config['webpack-dev-server'] = {
  contentBase: contentBase,
  hot: false,
  inline: false,
  quiet: false,
  noInfo: false,
  publicPath: webpackPublicPath,
  stats: {
    colors: true
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  }
}

if (!isDev) {
  config.webpack.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  )
  config.webpack.plugins.push(
    new UglifyJSPlugin()
  )
}
