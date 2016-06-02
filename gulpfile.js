var gulp = require('gulp');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var umd = require('gulp-umd');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var rename = require('gulp-rename');

var pluginName = 'SocialSharer';

var pkg = require('./package.json');
var banner = ['/*!',
  ' * ' + pluginName + ' v<%= pkg.version %>',
  ' * <%= pkg.homepage %>',
  ' * Licensed under <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('js', function() {
  return gulp.src('./src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .pipe(umd({
      exports: function() {
          return pluginName;
        },
        namespace: function() {
          return pluginName;
        }
    }))
    .pipe(uglify())
    .pipe(header(banner, {pkg: pkg}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass', function () {
  return gulp.src('./src/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist'));
});
 
gulp.task('dev', function () {
  gulp.watch('./src/*.scss', ['sass']);
  gulp.watch('./src/*.js', ['js']);
});
 
gulp.task('build', ['sass', 'js']);