var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var reload = browserSync.reload;
var exec = require('child_process').exec;
var clean = require('gulp-clean');


gulp.task('ng-build', function (cb) {
  exec('ng build --prod', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
})

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync({
    proxy: { 
      target: "localhost:3000",  // local node app address
      ws: true
    },  
    port: 5000,  // use *different* port than above
    notify: false
  });
});

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({
    script: 'index.js',
    ignore: [
      'gulpfile.js',
      'node_modules/',
      'production/'
    ]
  })
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({ stream: false });
    }, 1000);
  });
});

gulp.task('watch', ['browser-sync'], function () {
  gulp.watch(['client/**/*.*'], reload);
});


gulp.task('build', ['ng-build', 'clean-prod'], function(){
  return gulp.src([
    './client/**/*', 
    './server/**/*', 
    './conf/**/*', 
    './index.js', 
    './package.json',
    './package-lock.json',
    './LICENSE.md',
    '!./client/3rdpartylicenses.txt'
  ], { "base" : "." })
  .pipe(gulp.dest("./production"))
});


gulp.task('clean-prod', function(){
  return gulp.src('./production/', {read: false})
  .pipe(clean());
});