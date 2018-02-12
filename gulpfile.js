var gulp = require('gulp'),
	sass = require('gulp-sass'),
  prefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  cssmin = require('gulp-clean-css'),
  imagemin = require('gulp-imagemin'),
	watch = require('gulp-watch'),	
	rimraf = require('rimraf'),
	browserSync  = require('browser-sync'),
  reload = browserSync.reload,
  es = require('event-stream'),
  babel = require('gulp-babel');

var path = {
    dist: { 
        css:   'dist/css/',
        js:    'dist/js/',
        html:  'dist/',
        img:   'dist/img/',
        fonts: 'dist/fonts/'
    },
    src: { 
        sass:  'app/style/style.scss',
        css:   'app/style/**/*.css',
        js:    'app/js/**/*.js',
        html:  'app/**/*.html',
        img:   'app/img/**/*',
        fonts: 'app/fonts/**/*'
    },
    watch: { 
        sass:  'app/style/**/*.scss',
        css:   'app/style/**/*.css',
        js:    'app/js/**/*.js',
        html:  'app/**/*.html',
        img:   'app/img/**/*',
        fonts: 'app/fonts/**/*'
    },
    clean: './dist'
};

gulp.task('browser-sync', function() {
		browserSync({    
				server: {
						baseDir: "./dist"
				},
        host: 'localhost',
        port: 3000,
		});
});

gulp.task('scripts', function() {
  return gulp.src(path.src.js)
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(gulp.dest(path.dist.js))
    .pipe(reload({stream: true}))
});

gulp.task('sass', function(){
  var cssStream  = gulp.src(path.src.css);
  var sassStream = gulp.src(path.src.sass)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(prefixer())
    .pipe(cssmin({debug: true}, function(details) {
      console.log(details.name + ': ' + details.stats.originalSize);
      console.log(details.name + ': ' + details.stats.minifiedSize);
    }))
    .pipe(sourcemaps.write()); 
  return es.merge(sassStream, cssStream)           
           .pipe(gulp.dest(path.dist.css))
           .pipe(reload({stream: true}))
});

gulp.task('images', function(){
  gulp.src('app/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img/'))
    .pipe(reload({stream: true}))    
});

gulp.task('htmldist', function() {
  return gulp.src(path.src.html)
    .pipe(gulp.dest(path.dist.html))
    .pipe(reload({stream: true}))
    
});

gulp.task('imgdist', function() {
  return gulp.src(path.src.img)   
    .pipe(gulp.dest(path.dist.img))
    .pipe(reload({stream: true}))
});

gulp.task('fontsdist', function() {
  return gulp.src(path.src.fonts)   
    .pipe(gulp.dest(path.dist.fonts))
    .pipe(reload({stream: true}))
});

gulp.task('build', ['sass', 'images', 'htmldist', 'scripts', 'imgdist', 'fontsdist']);

gulp.task('watch', function(){
  gulp.watch(path.watch.sass, ['sass']);
  gulp.watch(path.watch.сss, ['sass']);
  gulp.watch(path.watch.js, ['scripts']);
  gulp.watch(path.watch.html, ['htmldist']);
  gulp.watch(path.watch.img, ['imgdist']);
  gulp.watch(path.watch.fonts, ['fontsdist']);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'browser-sync', 'watch']);
