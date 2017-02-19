// 'use strict';

// const bun = require("bun");
// const crisper = require('gulp-crisper');
// const es = require('event-stream');
// const glob = require('glob');
// const gulp = require('gulp');
// const gulpif = require('gulp-if');
// const rename = require('gulp-rename');
// const ts = require('gulp-typescript');
// const uglify = require('gulp-uglify');
// const watch = require('gulp-watch');

// const Transform = require('stream').Transform;

// var tsProject = ts.createProject('tsconfig.json');

// class Logger extends Transform {

//   constructor() {
//     super({objectMode: true});
//   }

//   /**
//    * @param {Buffer|string} file
//    * @param {string=} encoding - ignored if file contains a Buffer
//    * @param {function(Error, object)} callback - Call this function (optionally with an
//    *          error argument and data) when you are done processing the supplied chunk.
//    */
//   _transform(file, encoding, callback) {
//     console.log(file.path);
//     callback(null, file);
//   };

// };

// const logger = new Logger();

// gulp.task('default', ['vendor', 'lib', 'demo']);

// gulp.task('lib', () => {
//   let result = tsProject.src().pipe(ts(tsProject));
//   return es.merge(result.js, result.dts)
//       .pipe(gulp.dest(''));
// });

// gulp.task('demo', function() {
//   return es.merge(
//       gulp.src([
//           'build/kaon/kaon.d.ts',
//           'custom_typings/custom_elements.d.ts',
//           'demo/{misc,hello-world}/*.ts',
//         ])
//         .pipe(ts({
//           target: "es6",
//           module: "amd",
//           moduleResolution: "node",
//           isolatedModules: false,
//           experimentalDecorators: true,
//           emitDecoratorMetadata: true,
//           noImplicitAny: false,
//           noLib: false,
//           suppressImplicitAnyIndexErrors: true,
//         })),
//       gulp.src(['demo/{misc,hello-world}/*', '!demo/{misc,hello-world}/*.ts'])
//     )
//     .pipe(gulp.dest('build/demo/'));
// });

// gulp.task('todomvc', ['vendor', 'lib', 'todo-src', 'todo-deps'])

// gulp.task('todo-src', function() {
//   return gulp.src(['demo/todomvc/**', '!**/bower_components/**'])
//       .pipe(gulpif(/\.html$/, crisper()))
//       .pipe(gulpif(/\.js$/, ts(tsProject)))
//       .pipe(gulp.dest('build/demo/todomvc'));
// });

// gulp.task('todo-deps', function() {
//   return gulp.src(['demo/todomvc/bower_components/**'])
//       .pipe(gulp.dest('build/demo/todomvc/bower_components'));
// });

// gulp.task('todomvc-deps', ['vendor', 'lib'], function() {
//   return es.merge(
//       gulp.src('demo/todomvc/**/bower_components/**'),
//       gulp.src(['build/**', '!build/demo', '!build/demo/**', '!build/test', '!build/test/**'])
//     )
//     .pipe(gulp.dest('build/demo/todomvc'));
// });

// gulp.task('vendor', [
//     'imd',
//     'incremental-dom',
//     'polymer-expressions',
//     'stampino',
//     'webcomponents',
//   ]);

// gulp.task('imd', function() {
//   return gulp.src('bower_components/imd/imd.*')
//     .pipe(gulp.dest('build/imd/'));
// });

// gulp.task('webcomponents', function() {
//   return gulp.src([
//       'bower_components/webcomponentsjs/**/*',
//     ])
//     .pipe(gulp.dest('build/webcomponentsjs/'));
// });

// gulp.task('stampino', function() {
//   return gulp.src('node_modules/stampino/stampino.js')
//     .pipe(gulp.dest('build/stampino/'));
// });

// gulp.task('incremental-dom', function() {
//   return gulp.src([
//       'node_modules/incremental-dom/dist/incremental-dom-min.js',
//       'node_modules/incremental-dom/dist/incremental-dom-min.js.map',
//     ])
//     .pipe(gulp.dest('build/incremental-dom/'));
// });

// gulp.task('polymer-expressions', function() {
//   gulp.src('node_modules/polymer-expressions/polymer-expressions.js')
//     .pipe(gulp.dest('build/polymer-expressions/'))
// });
