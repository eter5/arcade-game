var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

// Default
gulp.task('default', function() {
  // code for default task
});

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});
