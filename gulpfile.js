/**
 * Set Gulp requirements
 */
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

/**
 * Define tasks
 */
gulp.task('styles', function() {
	// App style files
	return gulp.src('./css/**/*.css')
		.pipe($.concat('app.css'))
		.pipe($.autoprefixer("last 2 versions"))
		.pipe($.csso())
		.pipe(gulp.dest('./public/css/'));
});

gulp.task('scripts', function() {
	// Vendor scripts
	gulp.src('./js/vendor/**/*.js')
		.pipe($.concat('vendor.js'))
		.pipe(gulp.dest('./public/js/'));
	
	// App scripts
	return gulp.src('./js/*.js')
		.pipe($.jshint())
        .pipe($.jshint.reporter($.jshintStylish))
        .pipe($.concat('app.js'))
		.pipe($.uglify())
		.pipe(gulp.dest('./public/js/'));
});

gulp.task('files', ['styles', 'scripts'], function() {
	// App page	
	gulp.src('./index.html')
		.pipe($.inject(
			gulp.src('./public/css/app.css', {read: false}), {addRootSlash: false, ignorePath: 'public', starttag: '<!-- inject:style:css -->'}
      	))
		.pipe($.inject(
			gulp.src('./public/js/vendor.js', {read: false}), {addRootSlash: false, ignorePath: 'public', starttag: '<!-- inject:vendor:js -->'}
		))
        .pipe($.inject(
			gulp.src('./public/js/app.js', {read: false}), {addRootSlash: false, ignorePath: 'public', starttag: '<!-- inject:app:js -->'}
		))
		.pipe($.htmlmin({
        	removeComments: true
        }))
		.pipe(gulp.dest('./public/'));
	
	// App files
	return gulp.src('./presets.json')
		.pipe(gulp.dest('./public/'));
});

gulp.task('images', function() {
	//image files
	gulp.src('./img/**/*')
		.pipe(gulp.dest('./public/img/'));
	
	// favicon files
	return gulp.src(['./*.png', './*.ico'])
		.pipe(gulp.dest('./public/'));
});

/**
 * Set build tasks
 */
gulp.task('clean', function() {
    return gulp.src(['./public/'], { read: false })
    	.pipe($.clean());
});

gulp.task('build', ['styles', 'images', 'scripts', 'files']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

/**
 * Set local development server
 */
gulp.task('connect', function() {
	var connect = require('connect');

    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(require('serve-static')('./public'))
        .use(require('serve-index')('./public'));
	
    require('http').createServer(app)
        .listen(4567)
        .on('listening', function() {
            console.log('Started connect web server on http://localhost:4567');
        });
});

gulp.task('serve', ['connect'], function() {
    require('opn')('http://localhost:4567');
});

gulp.task('watch', ['connect', 'serve'], function() {
	var server = $.livereload;

    gulp.watch([
        './public/*.html',
        './public/*.json',
        './public/css/**/*.css',
        './public/js/**/*.js',
        './public/img/**/*',
        './public/*.ico',
        './public/*.png'
    ]).on('change', function (file) {
        server.changed(file.path);
    });
	
    gulp.watch('./css/**/*.css', ['styles']);
    gulp.watch('./js/**/*.js', ['scripts']);
    gulp.watch('./img/**/*', ['images']);
    gulp.watch('./*.ico', ['images']);
    gulp.watch('./*.png', ['images']);
    gulp.watch('./*.html', ['files']);
    gulp.watch('./*.json', ['files']);
});
