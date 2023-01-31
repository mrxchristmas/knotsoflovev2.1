const { src, dest, watch, series } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const purgecss = require('gulp-purgecss')

function buildStyles() {
  return src('src/sass/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(purgecss({ content: ['src/**/*.js', 'src/*.js'] }))
    .pipe(dest('src/'))
}

function watchTask() {
  watch(['./src/sass/**/*.scss', '*.jsx'], buildStyles)
}

exports.default = series(buildStyles, watchTask)