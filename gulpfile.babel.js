// third party imports
import gulp from 'gulp'
import del from 'del'
import webpack from 'webpack-stream'
import named from 'vinyl-named'
import env from 'gulp-env'
import minifyCSS from 'gulp-minify-css'
import concat from 'gulp-concat'
import karma from 'karma'
// local imports
import {
    buildDir,
    buildGlob,
    entry,
    cssGlob,
    webpackConfig as webpackConfigPath,
    karmaConfig as karmaConfigPath,
} from './config/projectPaths'
const webpackConfig = require(webpackConfigPath)


/**
 * Default to watching source for changes.
 */
gulp.task('default', ['watch'])


/**
 * Build entry point.
 */
gulp.task('build', ['clean', 'build-css'], () => {
    return gulp.src(entry)
        .pipe(named())
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(buildDir))
})


/**
 * Watch entry point.
 */
gulp.task('watch', ['clean', 'build-css'], () => {
    const config = {
        ...webpackConfig,
        watch: true,
    }

    return gulp.src(entry)
        .pipe(named())
        .pipe(webpack(config))
        .pipe(gulp.dest(buildDir))
})


/**
 * Build entry point for production.
 */
gulp.task('build-production', ['clean'], () => {
    // set environment variable
    env({
        vars: {
            NODE_ENV: 'production',
        },
    })
    // build
    return gulp.src(entry)
        .pipe(named())
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(buildDir))
})


/**
 * Build CSS assets.
 */
gulp.task('build-css', () => {
    return gulp.src(cssGlob)
        .pipe(concat('styles.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest(buildDir))
})


/**
 * Remove all ouptut files from previous builds.
 */
gulp.task('clean', () => {
    del.sync(buildGlob)
})


/**
 * Run the test suite once.
 */
gulp.task('test', (cb) => {
    const server = new karma.Server({
        configFile: karmaConfigPath,
        singleRun: true
    }, () => cb())

    server.start()
})


/**
 * Watch source and tests for changes, run tests on change.
 */
gulp.task('tdd', () => {
    const server = new karma.Server({
        configFile: karmaConfigPath,
    })

    server.start()
})
