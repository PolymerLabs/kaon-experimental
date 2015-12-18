'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const es = require('event-stream');
const watch = require('gulp-watch');
const glob = require('glob');
const crisper = require('gulp-crisper');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');

const Transform = require('stream').Transform;

class Logger extends Transform {

  constructor() {
    super({objectMode: true});
  }

  /**
   * @param {Buffer|string} file
   * @param {string=} encoding - ignored if file contains a Buffer
   * @param {function(Error, object)} callback - Call this function (optionally with an
   *          error argument and data) when you are done processing the supplied chunk.
   */
  _transform(file, encoding, callback) {
    console.log(file.path);
    callback(null, file);
  };

};

const logger = new Logger();

gulp.task('default', ['vendor', 'lib', 'test']);

gulp.task('lib', function() {
  return gulp.src('lib/*.js')
      .pipe(babel())
      .pipe(gulp.dest('build/kaon'));
});

gulp.task('test', function() {
  return es.merge(
    gulp.src('test/*.js')
        .pipe(babel())
        .pipe(gulp.dest('build/test')),
    gulp.src('test/*.html')
        .pipe(crisper({
            scriptInHead: false,
            onlySplit: false,
        }))
        .pipe(gulpif(/\.js$/, babel()))
        .pipe(gulp.dest('build/test'))
  );
});

gulp.task('todomvc', ['vendor', 'lib'], function() {
  return gulp.src(['demo/todomvc/**', '!**/bower_components/**'])
      .pipe(gulpif(/\.html$/, crisper({
          scriptInHead: false,
          onlySplit: false,
      })))
      .pipe(gulpif(/\.js$/, babel()))
      .pipe(gulp.dest('build/demo/todomvc'));
});

gulp.task('todomvc-deps', ['vendor', 'lib'], function() {
  return es.merge(
      gulp.src('demo/todomvc/**/bower_components/**'),
      gulp.src(['build/**', '!build/demo', '!build/demo/**', '!build/test', '!build/test/**'])
    )
    .pipe(gulp.dest('build/demo/todomvc'));
});

gulp.task('vendor', [
    'imd',
    'incremental-dom',
    'mixwith',
    'polymer-expressions',
    'stampino',
    'webcomponents',
  ]);

gulp.task('imd', function() {
  return gulp.src('bower_components/imd/imd.*')
    .pipe(gulpif(/\.js$/, uglify()))
    .pipe(gulp.dest('build/imd/'));
});

gulp.task('webcomponents', function() {
  return gulp.src('bower_components/webcomponentsjs/webcomponentsjs-lite.min.js')
    .pipe(gulp.dest('build/webcomponentsjs/'));
});

gulp.task('stampino', function() {
  return gulp.src('node_modules/stampino/stampino.js')
    .pipe(gulp.dest('build/stampino/'));
});

gulp.task('mixwith', function() {
  return gulp.src('node_modules/mixwith/mixwith.js')
    .pipe(gulp.dest('build/mixwith/'));
});

gulp.task('incremental-dom', function() {
  return gulp.src('node_modules/incremental-dom/dist/incremental-dom-min.js')
    .pipe(gulp.dest('build/incremental-dom/'));
});

gulp.task('polymer-expressions', function() {
  gulp.src('node_modules/polymer-expressions/polymer-expressions.js')
    .pipe(gulp.dest('build/polymer-expressions/'))
});
