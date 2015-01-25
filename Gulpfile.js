var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserify = require('browserify');
var nodemon = require('gulp-nodemon');

gulp.task('watchBackend', function(){
  var filePath;
  nodemon({ script: 'app.js', ext: 'html js', ignore: ['node_modules/**', 'public/css/master*']  })
    .on('restart', function (file) {
      filePath = file[0]
      console.log('Restarting nodemon because you changed'.blue, filePath.green)
    });
});

gulp.task('watch', function() {
  var bundler = watchify(browserify('public/js/site.js', watchify.args));

  // Optionally, you can apply transforms
  // and other configuration options on the
  // bundler just as you would with browserify
  bundler.transform('brfs');

  bundler.on('update', rebundle);

  function rebundle() {
    return bundler.bundle()
      // log errors if they happen
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./public/js'));
  }

  return rebundle();
});

gulp.task('default', ['watch', 'watchBackend']);
