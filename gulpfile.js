var gulp = require('gulp');
var gulpSass = require('gulp-sass');
var gulpAutoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var babel = require('gulp-babel');

gulp.task('scss', function () {
  return gulp.src('./src/scss/index.scss')
    .pipe(gulpSass().on('error', gulpSass.logError))
    .pipe(gulpAutoprefixer({
      browsers: ['Android >= 4', 'iOS >= 7.1'],
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(gulp.dest('./lib/css/'));
});

gulp.task('js', function () {
  return gulp.src('src/react/index.jsx')
    .pipe(babel({
      presets: ['env', 'react']
    }))
    .pipe(gulp.dest('./lib/react/'));
});


gulp.task('default', ['js', 'scss']);