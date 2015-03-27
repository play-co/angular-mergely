var gulp = require('gulp');
var stylus = require('gulp-stylus');
var nib = require('nib');
var ngAnnotate = require('gulp-ng-annotate');

var paths = {
  stylus: { src: 'src/*.styl', dist: 'dist' },
  js: { src: 'src/*.js', dist: 'dist' }
};

gulp.task('stylus', [], function() {
  return gulp.src(paths.stylus.src)
    .pipe(stylus({ use: nib(), compress: true }))
    .pipe(gulp.dest(paths.stylus.dist));
});

gulp.task('js', [], function() {
  return gulp.src(paths.js.src)
    .pipe(ngAnnotate())
    .pipe(gulp.dest(paths.js.dist));
});

gulp.task('dist', ['js', 'stylus']);
gulp.task('default', ['dist']);

gulp.task('watch', ['dist'], function() {
  gulp.watch(paths.js.src, ['js']);
  gulp.watch(paths.stylus.src, ['stylus']);
});

