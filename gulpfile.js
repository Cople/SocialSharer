var gulp = require('gulp');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var umd = require('gulp-umd');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var rename = require('gulp-rename');

var pkg = require('./package.json');
var banner = ['/*!',
  ' * <%= pkg.name %> v<%= pkg.version %>',
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
      exports: function(file) {
          return 'SocialSharer';
        },
        namespace: function(file) {
          return 'SocialSharer';
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
 
gulp.task('watch', function () {
  gulp.watch('./src/*.scss', ['sass']);
  gulp.watch('./src/*.js', ['js']);
});
 
gulp.task('build', ['sass', 'js']);