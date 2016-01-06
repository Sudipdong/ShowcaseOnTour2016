"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); 
var open = require('gulp-open'); 
var browserify = require('browserify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var glob = require('glob');
var uglify = require('gulp-uglify');

var util = require('gulp-util');

var config = {
	port: 9025,
	devBaseUrl: 'http://localhost',
	path: {
		html: './src/*.html',
		// js: './src/**/*.js',
		js: './src/js/*.js',
		image: './src/images/*',
		sass: './src/sass/*.scss',
		css: [
			'node_modules/bootstrap/dist/css/bootstrap.min.css',
			'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
			'node_modules/font-awesome/css/font-awesome.min.css',
			'bower_components/prettyphoto/css/prettyPhoto.css',
			'bower_components/animate.css/animate.min.css',
			'bower_components/FlexSlider/flexslider.css',
			'./src/css/*.css'
		],
		font: [
  		'node_modules/font-awesome/fonts/*.*',
  	],
  	jslib: [
			'node_modules/jquery/dist/jquery.min.js',
			'node_modules/bootstrap/dist/js/bootstrap.min.js',
			'bower_components/jquery.appear/jquery.appear.js',
			'bower_components/flexslider/jquery.flexslider-min.js',
			'bower_components/prettyphoto/js/jquery.prettyPhoto.js',
			'bower_components/waypoints/lib/jquery.waypoints.min.js',
			'bower_components/jquery.easing/js/jquery.easing.min.js',
			'bower_components/slabText/js/jquery.slabtext.min.js',  // produce a super large text
			'bower_components/superslides/dist/jquery.superslides.min.js',
			'bower_components/jquery-parallax/scripts/jquery.parallax-1.1.3.js',
			'bower_components/smoothscroll/SmoothScroll.js',
			'bower_components/isotope/dist/isotope.pkgd.min.js',
			'./src/js/vendor/modernizr-latest.js',
  	],
		src: './src',
		dist: './dist'
	}
};

gulp.task('connect', function() {
	connect.server({
		root: ['dist'],
		port: config.port,
		base: config.devBaseUrl,
		livereload: true
	});
});

gulp.task('open', ['connect'], function() {
	gulp.src('dist/index.html')
		.pipe(open({ 
			app: 'Google Chrome',
			uri: config.devBaseUrl + ':' + config.port + '/' 
		}));
});

gulp.task('html', function() {	
	log('html task starts');

	gulp.src(config.path.html)
		.pipe(gulp.dest(config.path.dist))
		.pipe(connect.reload());

	gulp.src('./src/favicon.png')
		.pipe(gulp.dest(config.path.dist));	
});

gulp.task('font', function() {
	gulp.src(config.path.font)
		.pipe(gulp.dest(config.path.dist + '/fonts'));
});

gulp.task('image', function() {
	gulp.src(config.path.image)
		.pipe(gulp.dest(config.path.dist + '/images'))
		.pipe(connect.reload());	
});

gulp.task('css', function() {
	gulp.src(config.path.css)
	//	.pipe(concat('lib.css'))
		.pipe(gulp.dest(config.path.dist + '/css'));
});

gulp.task('sass', function () {
	log('sass task starts');

  gulp.src(config.path.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config.path.dist + '/css'))
    .pipe(connect.reload());
});

// gulp.task('css', ['sass'], function() {
// 	gulp.src(config.path.css)
// 		.pipe(concat('app-all.css'))
// 		.pipe(gulp.dest(config.path.dist + '/css'))
// 		.pipe(connect.reload());
// });

gulp.task('jslib', function() {
	gulp.src(config.path.jslib)
		.pipe(gulp.dest(config.path.dist + '/scripts'));
});

gulp.task('js', function () {
  gulp.src(config.path.js)
  	.on('error', console.error.bind(console))
    .pipe(gulp.dest(config.path.dist + '/scripts'))
		.pipe(connect.reload());
});
// gulp.task('js', function (cb) {
//   glob(config.path.js, {}, function (err, files) {
//     var b = browserify();
//     files.forEach(function (file) {
//       b.add(file);
//     });
//     b.bundle()
//      .pipe(source('app-all.js'))
//      .pipe(buffer())
//      .pipe(uglify())
// 		 .pipe(gulp.dest(config.path.dist + '/scripts'))
// 		 .pipe(connect.reload());
//    cb();
//  }); 
// });

gulp.task('watch', function() {
	gulp.watch(config.path.sass, ['sass']);
	gulp.watch(config.path.js, ['js']);
	// gulp.watch(config.path.js, ['js', 'eslint']);
	gulp.watch(config.path.src + '/**/*.html', ['html']);
});

gulp.task('default', ['html', 'font', 'image', 'jslib', 'css', 'sass', 'js', 'open', 'watch']);


///////////
function log(msg) {
	if (typeof(msg) === 'object') {
		for (var item in msg) {
			if (msg.hasOwnProperty(item)) {
				util.log(util.colors.blue(msg[item]));
			}
		}
	}
	else {
		util.log(util.colors.blue(msg));
	}
}

