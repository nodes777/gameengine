/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var gulp = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('default', function () {
    // place code for your default task here
});

gulp.task('browser-sync', function() {
	browserSync.init({
   	 server: {
            baseDir: "./"
        },
    open: false,
    files: [ '*.css', '*.html', 'css/*.css'],
    });
});