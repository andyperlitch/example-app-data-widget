'use strict';

var gulp = require('gulp'),
    less = require('gulp-less'),
    path = require('path'),
    usemin = require('gulp-usemin'),
    angularFilesort = require('gulp-angular-filesort'),
    bowerFiles = require('main-bower-files'),
    http = require('http'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat'),
    merge = require('merge-stream'),
    sort = require('sort-stream'),
    inject = require('gulp-inject');

gulp.task('less', function() {
  gulp.src('./app/**/*.less')
    .pipe(less({
      paths: [
        'bower_components',
        './app',
        './components'
      ]
    }))
    .pipe(gulp.dest('./dist/styles'))
    .pipe(connect.reload());
});

gulp.task('watch', ['server'], function() {
  gulp.watch('app/**/*.less', ['less']);
  gulp.watch(['app/**/*.js', 'app/*.js', 'app/index.html'], ['usemin']);
});

gulp.task('inject', function () {

  var bowerOrder = ['jquery.js', 'jquery-ui.js', 'angular.js'];

  var target = gulp.src('./app/index.html');
  var sources = gulp.src(['./app/**/*.js', './dist/**/*.css'], {read: false}).pipe(angularFilesort());
  var bower = gulp.src(bowerFiles(), {read: false})
    .pipe(sort(function(a, b) {
      a = bowerOrder.indexOf(path.basename(a.path));
      b = bowerOrder.indexOf(path.basename(b.path));
      if (a === -1 && b === -1) {
        return 0;
      }
      if (a === -1) {
        return 1;
      }
      if (b === -1) {
        return -1;
      }
      return a - b;
    }));

  return target
    .pipe(inject(bower, {name: 'bower'}))
    .pipe(inject(sources, { ignorePath: 'dist' }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('usemin', ['inject'], function() {

  return gulp.src('./dist/index.html')
    .pipe(usemin({
      vendor: ['concat'],
      js: ['concat']
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

gulp.task('server', ['usemin'], function() {
  connect.server({
    livereload: true,
    root: ['dist','bower_components/datatorrent-console-package/dist', '.'],
    port: 8080
  });
});

gulp.task('build', function() {
  var jsFile = gulp.src('app/src/**/*.js')
    .pipe(angularFilesort())
    .pipe(concat('widget.js'))
    .pipe(gulp.dest('build'));

  var cssFile = gulp.src('app/src/widget.less')
    .pipe(less())
    .pipe(gulp.dest('build'));

  return merge(jsFile, cssFile);

});