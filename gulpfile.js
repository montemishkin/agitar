// third party imports
var gulp = require('gulp')
var del = require('del')
var karma = require('karma')
var webpack = require('webpack-stream')
var named = require('vinyl-named')
var minifyCSS = require('gulp-minify-css')
var concat = require('gulp-concat')
var autoprefixer = require('autoprefixer')
var postcss = require('gulp-postcss')
// local imports
var projectPaths = require('./config/projectPaths')


var buildDir = projectPaths.buildDir
var entry = projectPaths.entry
var cssGlob = projectPaths.cssGlob
var webpackConfigPath = projectPaths.webpackConfig
var karmaConfigPath = projectPaths.karmaConfig


/**
 * Default to watching scripts and styles. Rebuild on change.
 */
gulp.task('default', [
    'watch-scripts',
    'watch-styles'
])


/**
 * Watch js entry point. Rebuild on change.
 */
gulp.task('watch-scripts', function () {
    const config = require(webpackConfigPath)
    config.watch = true

    return gulp.src(entry)
        .pipe(named())
        .pipe(webpack(config))
        .pipe(gulp.dest(buildDir))
})


/**
 * Watch styles only. Rebuild on change.
 */
gulp.task('watch-styles', ['build-styles'], function () {
    gulp.watch(cssGlob, ['build-styles'])
})


/**
 * Build styles only.
 */
gulp.task('build-styles', function () {
    return gulp.src(cssGlob)
        .pipe(postcss([
            autoprefixer({
                browsers: ['last 2 versions'],
            }),
        ]))
        .pipe(concat('styles.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest(buildDir))
})


/**
 * Run test suite once.
 */
gulp.task('test', function (cb) {
    const server = new karma.Server({
        configFile: karmaConfigPath,
        singleRun: true
    }, function () { cb() })

    server.start()
})


/**
 * Watch tests for changes, run tests on change.
 */
gulp.task('tdd', function () {
    const server = new karma.Server({
        configFile: karmaConfigPath,
    })

    server.start()
})


/**
 * Build everything needed for production.
 */
gulp.task('build-production', [
    'clean-build',
    'build-styles',
    'build-scripts-production'
])


/**
 * Build js entry point for production.
 */
gulp.task('build-scripts-production', function () {
    process.env.NODE_ENV = 'production'

    // build client
    return gulp.src(entry)
        .pipe(named())
        .pipe(webpack(require(webpackConfigPath)))
        .pipe(gulp.dest(buildDir))
})


/**
 * Remove ALL previously built files.
 */
gulp.task('clean-build', function () {
    del.sync(buildDir)
})
