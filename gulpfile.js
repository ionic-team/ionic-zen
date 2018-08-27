
const gulp       = require('gulp');
const cleanCSS   = require('gulp-clean-css');
const concat     = require('gulp-concat');
const cp         = require('child_process');
const header     = require('gulp-header');
const footer     = require('gulp-footer');
const prefix     = require('gulp-autoprefixer');
const sass       = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify     = require('gulp-uglify');

const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ff >= 45',
  'chrome >= 54',
  'safari >= 9',
  'opera >= 23',
  'ios >= 9',
  'android >= 4.4'
];

const copyright =
`/*
 * Ionic
 * Copyright 2018-present Drifty Co.
 */
`;

const closureStart = copyright + '\n(function() {\n';
const closureEnd = '\n})();\n';

function styles() {
  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src('scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      precision: 10,
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe(prefix({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe(sourcemaps.write())
    // Concatenate and minify styles
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(header(copyright))
    .pipe(gulp.dest('./'));
}

function js(){
  return gulp.src(['js/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('script.js', {newLine: ';'}))
    .pipe(sourcemaps.write())
    .pipe(uglify())
    .pipe(header(closureStart))
    .pipe(footer(closureEnd))
    .pipe(gulp.dest('./'));
}

function server(done) {
  // done this way so IO is still passed through, but the watch can begin
  done();
  cp.spawn('zat', ['theme', 'preview'], {stdio: 'inherit'})
    .on('error', function(err) {throw err; });
}

function watch() {
  gulp.watch(['scss/*.scss', 'scss/**/*.scss'], styles);
  gulp.watch(['js/*.js', 'js/**/*.js'], js);
}


gulp.task('styles', styles);
gulp.task('js', js);
gulp.task('server', gulp.series(gulp.parallel(['styles', 'js']), server));
gulp.task('watch', gulp.series(['server'], watch));