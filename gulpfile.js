var gulp = require('gulp'),
    watch = require('gulp-watch'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify');

var dgGeofieldModuleSrc = [
  './src/_dg_geofield.js',
  './src/forms/elements/element.*.js',
  './src/includes/include.*.js',
  './src/widgets/widget.*.js'
];

// Task to build the cw_app.min.js file.
gulp.task('minifyJS', function(){
  return gulp.src(dgGeofieldModuleSrc)
      .pipe(gp_concat('concat.js'))
      .pipe(gulp.dest(''))
      .pipe(gp_rename('dg_geofield.min.js'))
      .pipe(gp_uglify())
      .pipe(gulp.dest(''));
});

gulp.task('default', function () {
  watch(dgGeofieldModuleSrc, function(event) { gulp.start('minifyJS') });
  gulp.start('minifyJS');
});
