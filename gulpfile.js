const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const nodemon = require('gulp-nodemon')

gulp.task('default', ['browser-sync', 'nodemon'], function () {
})

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init({
    proxy: 'http://localhost:4000',
    files: ['public/**/*.*'],
    browser: 'google chrome',
    port: 7000,
        reloadDelay: 1000,
  })
})

gulp.task('nodemon', function (cb) {
  let started = false

  return nodemon({
    script: './bin/www',
    ignore: [
      'test/',
      'public/',
      'gulpfile.js',
      'node_modules/'
    ],
  }).on('start', function () {
    if (!started) {
            setTimeout(cb, 500)
      started = true
    }
  })
})
