// ref https://webpack.github.io/docs/usage-with-gulp.html#without-webpack-stream
const gulp = require('gulp')
const cssmin = require('gulp-cssmin')
const htmlmin = require('gulp-htmlmin')
const uglify = require('gulp-uglify')
const config = require('./webpack/config')
const argv = require('minimist')(process.argv.slice(2))
const buildPath = './public'
const log = require('fancy-log')
const PluginError = require('plugin-error')
const webpack = require('webpack')
const notProduction = process.env.NODE_ENV !== 'production'
const del = require('del')
const imagemin = require('gulp-imagemin')

const staticPath = './static'
const cloneGlob = staticPath + '/**/*.+(ttf|svg|eot|woff|woff2|ico|otf)'
const imageGlob = staticPath + '/**/*.+(jpeg|jpg|png)'
const jsGlob = staticPath + '/**/*.js'
const htmlGlob = staticPath + '/**/*.+(html|htm)'
const cssGlob = staticPath + '/**/*.css'

gulp.task('clean', function () {
  return del.sync([buildPath])
})

gulp.task('clone', function () {
  return gulp.src(cloneGlob)
    .pipe(gulp.dest(buildPath))
})

gulp.task('webpack', function (callback) {
  webpack(config.webpack, function (err, stats) {
    if (err) {
      throw new PluginError('webpack', err)
    }
    log('[webpack]', stats.toString({}))
    callback()
  })
})

gulp.task('min:image', function () {
  const task = gulp.src(imageGlob)
  if (notProduction) {
    return task.pipe(gulp.dest(buildPath))
  }

  return gulp.src(imageGlob)
    .pipe(imagemin({
      interlaced: true,
      progressive: true,
      optimizationLevel: 5
    }))
    .pipe(gulp.dest(buildPath))
})

gulp.task('min:js', function () {
  const task = gulp.src(jsGlob)
  if (notProduction) {
    return task.pipe(gulp.dest(buildPath))
  }
  return task
    .pipe(uglify())
    .pipe(gulp.dest(buildPath))
})

gulp.task('min:css', function () {
  const task = gulp.src(cssGlob)
  if (notProduction) {
    return task.pipe(gulp.dest(buildPath))
  }
  return task.pipe(cssmin())
    .pipe(gulp.dest(buildPath))
})

gulp.task('min:html', function () {
  const task = gulp.src(htmlGlob)
  if (notProduction) {
    return task.pipe(gulp.dest(buildPath))
  }

  return task.pipe(htmlmin({
    collapseWhitespace: true
  }))
    .pipe(gulp.dest(buildPath))
})

gulp.task('static', ['clone', 'min:image', 'min:js', 'min:css', 'min:html'])

gulp.task('build', ['clean', 'static', 'webpack'])

gulp.task('watch', function () {
  gulp.start('static')
  gulp.watch(cloneGlob, ['clone'])
  gulp.watch(imageGlob, ['min:image'])
  gulp.watch(cssGlob, ['min:css'])
  gulp.watch(jsGlob, ['min:js'])
  gulp.watch(htmlGlob, ['min:html'])
})

gulp.task('webpack:dev', function () {
  const host = argv.host || '0.0.0.0'
  const port = argv.port || 3000
  const configWebpack = config.webpack
  for (const name of Object.keys(configWebpack.entry)) {
    configWebpack.entry[name].unshift(`webpack-dev-server/client?http://localhost:${port}/`)
    configWebpack.entry[name].unshift(`webpack/hot/dev-server`)
  }

  configWebpack.plugins.push(new webpack.HotModuleReplacementPlugin())

  const compiler = webpack(configWebpack)
  compiler.devtool = 'source-map'

  const WebpackDevServer = require('webpack-dev-server')
  const configWebpackDevServer = config['webpack-dev-server']

  // configWebpackDevServer.before = function (app) {
  //   app.get('/*', function (req, res, next) {
  //     log(req.url)
  //     next()
  //   })
  // }

  // configWebpackDevServer['proxy'] = [{
  //   context: ['**', '!*.+(js|html|css)', '!*/'],
  //   target: 'http://localhost:3000'
  // }]

  const server = new WebpackDevServer(compiler, configWebpackDevServer)
  server.listen(port, host, function () {
    // const app = server.listeningApp
    const httpListen = host + ':' + port
    log('[webpack-dev-server]', 'Http Listen in ' + httpListen)
  })
})

gulp.task('dev', ['webpack:dev', 'watch'])
