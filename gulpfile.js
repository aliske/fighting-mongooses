'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');




gulp.task('nodemon', function (cb) {

	var started = false;

	return nodemon({
		script: './src/server.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true;
		}
	});
});



gulp.task('browser-sync', gulp.series('nodemon', () => {
	browserSync.init(null, {
		proxy: "http://localhost:3000",
    files: ["src/**/*.*"],
    browser: "chrome",
    port: 8080,
    ghostMode: false,
    notify: false
	});
}));


gulp.task('default', gulp.series('browser-sync', () => {
}));

