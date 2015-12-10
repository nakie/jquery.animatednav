// plugins
var gulp = require( 'gulp' ), 
	uglify = require( 'gulp-uglify' ),
	rename = require( 'gulp-rename' )
	jshint = require( 'gulp-jshint' );
 
// Task to minify Javascript
gulp.task( 'minify-js', function () {
    gulp.src( './src/*.js' ) // path to your files
    .pipe( uglify() )
    .pipe( rename({
      extname: '.min.js'
    }))
    .pipe( gulp.dest( 'dist' ) );
});

 
// task to Lint Javascript
gulp.task( 'jsLint', function () {
    gulp.src( './src/*.js') // path to your files
    .pipe( jshint() )
    .pipe( jshint.reporter() ); // Dump results
});

 gulp.task('default', ['jsLint', 'minify-js']);