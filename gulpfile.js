var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');

var pathScss = 'assets/scss/';
var pathCss = 'assets/css/';

gulp.task('scss', function() {
    return gulp.src(pathScss + '**/*.scss', {basedir: pathCss})
        .pipe(sass())
        .pipe(postcss([cssnext()]))
        .pipe(gulp.dest(pathCss));
});


gulp.task('watch', function() {
    gulp.watch(pathScss + '**/*.scss', ['scss']);
});

gulp.task('default', ['scss']);
