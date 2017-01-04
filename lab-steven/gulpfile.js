'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');

gulp.task('test', function() {
  gulp.src('./test/*-test.js', {read: false}).pipe(mocha({reporter: 'spec'}));
});

gulp.task('dev', function() {
  gulp.watch(['**/*.js', '!node_modules/**'], ['test']);
});

gulp.task('default', ['dev']);
