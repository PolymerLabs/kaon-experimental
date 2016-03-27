'use strict';

const crisper = require('gulp-crisper');
const es = require('event-stream');
const glob = require('glob');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const ts = require('gulp-typescript');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');

const Transform = require('stream').Transform;

var tsProject = ts.createProject('tsconfig.json');

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

gulp.task('default', ['vendor', 'lib', 'demo']);

gulp.task('lib', function() {
  return tsProject.src()
      .pipe(ts(tsProject))
      .pipe(gulp.dest('build/kaon'));
});

gulp.task('demo', ['hello-world', 'todomvc']);

gulp.task('hello-world', function() {
  return gulp.src('demo/hello-world/*.html')
    .pipe(crisper({
        scriptInHead: false,
        onlySplit: false,
    }))
    .pipe(gulpif(/\.js$/, logger))
    .pipe(gulpif(/\.js$/, ts(tsProject)))
    .pipe(gulp.dest('build/demo/hello-world'));
});

gulp.task('misc', function() {
  return gulp.src('demo/misc/*.html')
    .pipe(crisper({
        scriptInHead: false,
        onlySplit: false,
    }))
    .pipe(gulpif(/\.js$/, ts(tsProject)))
    .pipe(gulp.dest('build/demo/misc'));
});

gulp.task('todomvc', ['vendor', 'lib', 'todo-src', 'todo-deps'])

gulp.task('todo-src', function() {
  return gulp.src(['demo/todomvc/**', '!**/bower_components/**'])
      .pipe(gulpif(/\.html$/, crisper({
          scriptInHead: false,
          onlySplit: false,
      })))
      .pipe(gulpif(/\.js$/, ts(tsProject)))
      .pipe(gulp.dest('build/demo/todomvc'));
});

gulp.task('todo-deps', function() {
  return gulp.src(['demo/todomvc/bower_components/**'])
      .pipe(gulp.dest('build/demo/todomvc/bower_components'));
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
    // .pipe(gulpif(/\.js$/, uglify()))
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
