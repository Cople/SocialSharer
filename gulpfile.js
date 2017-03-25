var gulp = require('gulp');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var umd = require('gulp-umd');
var patterns = require('umd-templates');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var pkg = require('./package.json');
var banner = ['/*!',
  ' * <%= fileName %> v<%= pkg.version %>',
  ' * <%= pkg.homepage %>',
  ' * Licensed under <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('js', function() {
  return gulp.src('./src/social-sharer.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .pipe(umd({
      exports: function() {
        return 'SocialSharer';
      },
      namespace: function() {
        return 'SocialSharer';
      }
    }))
    .pipe(uglify())
    .pipe(header(banner, { pkg: pkg, fileName: 'social-sharer.js' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('jquery', function() {
  return gulp.src('./src/*.js')
    .pipe(concat('jquery.social-sharer.js'))
    .pipe(umd({
      exports: function() {
        return 'plugin';
      },
      namespace: function() {
        return 'socialSharer';
      },
      template: patterns.jqueryPluginCommonjs.path
    }))
    .pipe(uglify())
    .pipe(header(banner, { pkg: pkg, fileName: 'jquery.social-sharer.js' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass', function () {
  return gulp.src('./src/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist'));
});
 
gulp.task('dev', function () {
  gulp.watch('./src/*.scss', ['sass']);
  gulp.watch('./src/*.js', ['js', 'jquery']);
});
 
gulp.task('build', ['sass', 'js', 'jquery']);