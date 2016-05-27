
var babel = require('gulp-babel');
var gulp = require('gulp');
var print = require('gulp-print');
var webserver = require('gulp-webserver');  


gulp.task('js', function() {
  return gulp.src('app/js/*.js')               
        .pipe(print())                         
      .pipe(babel({ presets: ['es2015'] }))    
      .pipe(gulp.dest('build/js'));             
});

gulp.task('scss', function () {
    return gulp.src('app/scss/*.scss')
})

gulp.task('libs', function(){
    return gulp.src([
        'node_modules/systemjs/dist/system.js',
        'node_modules/babel-polyfill/dist/polyfill.js'])
        .pipe(print())
        .pipe(gulp.dest('build/libs'));
});

gulp.task('build', function(){
    return gulp.src('app/**/*.*')
            .pipe(print())
            .pipe(gulp.dest('build'));
});

gulp.task('build', ['js', 'libs'], function(){
    return gulp.src(['app/**/*.html', 'app/**/*.css'])
            .pipe(print())
            .pipe(gulp.dest('build'));
});

gulp.task('serve', ['build'], function() {
    
    gulp.watch(['app/**/*.*'], ['build']);
    
    gulp.src('build')
        .pipe(webserver({open: true}));
});