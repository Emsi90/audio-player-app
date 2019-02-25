var gulp = require('gulp'),
    
//Dodatek pobiera wszystkie pluginu z przedrostkiem gulp-
// i zamiast tego przedrostka mozemy wstawic zmienna i kropke np $.
//    $ = require('gulp-load-plugins')({
//        lazy: true
//    }),
    
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    del = require('del'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    gulpif = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    runSequence = require('run-sequence'),
    ftp = require('vinyl-ftp'),
    argv = require('yargs').argv,
    gutil = require('gulp-util');

// przykładowe zadanie w gulp
gulp.task('hello', function() {
    
    console.log('Hello World');
    
});
//-------------------------------------------------------

// Kompilacja SASS wraz z minifikacja, autoprefixerem i sourcmap
gulp.task('sass', function() {
   
    gutil.log( gutil.colors.yellow('Compile Sass to Css...'));
    
    return gulp.src('src/sass/style.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['last 2 versions', 'IE 10']}))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest('src/css/'))
        .pipe(browserSync.stream());
    
});
// -------------------------------------------------------

// LivePreview BrowserSync
gulp.task('server', function() {
    
    browserSync.init({
       server: 'src/'
    });
    
});
//------------------------------------------------------------

// Automatyczna kompilacja SASS do CSS oraz reload browsersync
gulp.task('watch', function () {
    
    gulp.watch('src/sass/**/*.scss', ['sass'])
    gulp.watch(['src/*.html', 'src/**/*js'], browserSync.reload);
    
});
// -----------------------------------------------------------

// Usuwanie folderu dist
gulp.task('clean', function() {
    
    return del('dist/');
    
});
// --------------------------------------------------------------

// Minifikacja JS i konkatenacja
gulp.task('jsmini', function() {
    
    return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.html', htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('dist/'));
    
});
// -----------------------------------------------------------------

// Kompresja Obrazków
gulp.task('images', function() {
    
     return gulp.src('dist/img/*', {
        base: 'dist'
    })
        .pipe(imagemin())
        .pipe(gulp.dest('dist/'));
    
});
// ------------------------------------------------------------------

// Kopiowanie plików do folderu dist
gulp.task('copy', function() {
    
   return gulp.src(['src/css/**/*', 'src/img/*', 'src/uploads/*'], {
       base: 'src'
   })
   .pipe(gulp.dest('dist/')); 
});
// -------------------------------------------------------------------

// Upload plikow na serwer ftp
gulp.task('upload', function() {
    
    var conn = ftp.create({
        host:     'mywebsite.tld',
        user:     'me',
        password: 'mypass'
    });
    
    // conn.dest -  tutaj podac do jakiego katalpogu na ftp to wysłac
    return gulp.src('dist/**/*')
        .pipe(gulpif(argv.upload, conn.dest('/public_html/')));
    
});
// ----------------------------------------------------------------------

// Tworzenie folderu dist
gulp.task('build', function(cb) {
   
    runSequence('clean', 'jsmini', 'copy', 'images', 'upload', cb);
    
});
// -----------------------------------------------------------------------

// Livepreview folderu dist (distrubution)
gulp.task('build:server', ['build'], function() {
    
    browserSync.init({
       server: 'dist/'
    });
    
});
// ----------------------------------------------------------------------

// domyslna funkcja odpalajaca kompilacje serwer
gulp.task('default', ['sass', 'server', 'watch']);













