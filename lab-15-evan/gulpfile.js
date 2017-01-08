'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');

// RUN TEST
gulp.task('test', function() {
  gulp.src('./test/**/*.js', { read: false })
  .pipe(mocha({ reporter: 'spec' }));
});

// RUN LINTER
gulp.task('lint', function() {
  gulp.src(['**/*.js', '!node_modules/**'])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

// RUN DEV
gulp.task('dev', function() {
  gulp.watch(['**/*.js', '!node_modules/**', ['test', 'lint']]);
});

gulp.task('default', ['dev']);
