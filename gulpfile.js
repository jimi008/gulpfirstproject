var gulp = require('gulp');
	gutil = require('gulp-util');
	coffee = require('gulp-coffee');
	compass = require('gulp-compass');
	concat = require('gulp-concat');
	sass = require('gulp-ruby-sass');
	minifyCSS = require('gulp-minify-css');
	connect = require('gulp-connect');

var env,
	jsSources,
	sassSources,
	htmlSources,
	sassStyle,
	outputDir;

env = process.env.NODE_ENV || 'production';

if (env === 'development') {
	outputDir = 'builds/development/';
	sassStyle = 'expanded';

} else {
	outputDir = 'builds/production/';
	sassStyle = 'compressed';
}


jsSources = [
	'components/scripts/pixgrid.js',
	'components/scripts/rclick.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js',
];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];

gulp.task('coffee', function()	{
	gulp.src('components/coffee/tagline.coffee')
	.pipe(coffee({ bare: true })
		.on('error', gutil.log))
	.pipe(gulp.dest('components/scripts'))
});


gulp.task('js', function() {
	gulp.src(jsSources)
		.pipe(concat('scripts.js'))
		.pipe(gulp.dest(outputDir + 'js/'))
		.pipe(connect.reload())
});

gulp.task('compass', function() {
	gulp.src(sassSources)
		.pipe(compass({
			sass: 'components/sass/',
			image: outputDir + 'images',
			style: sassStyle,
		}))
		.pipe(minifyCSS())
		// return sass(sassSources, {
		// 	compass: true,
		// 	lineNumbers: true
		// })
		// .pipe(minifyCSS())
		.on('error', gutil.log)
		.pipe(gulp.dest(outputDir + 'css'))
		.pipe(connect.reload())
});

gulp.task('watch', function() {
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch(jsSources, ['js']);
	gulp.watch(htmlSources, ['html']);
});

gulp.task('html', function() {
	gulp.src(htmlSources)
		.pipe(connect.reload())

});

gulp.task('default', ['html', 'compass', 'js', 'coffee', 'connect', 'watch']);

gulp.task('connect', function() {
	connect.server({
		root: outputDir,
		livereload: true
	});
});

