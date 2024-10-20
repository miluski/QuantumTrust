const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');

const paths = {
  css: {
    src: 'dist/frontend/browser/styles.css', 
    dest: 'dist/frontend/browser' 
  }
};

async function optimizeCSS() {
  const autoprefixer = (await import('gulp-autoprefixer')).default;

  return gulp.src(paths.css.src)
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.css.dest));
}

function watchFiles() {
  gulp.watch(paths.css.src, optimizeCSS);
}

const build = gulp.series(optimizeCSS);
const watch = gulp.series(build, watchFiles);

exports.optimizeCSS = optimizeCSS;
exports.watch = watch;
exports.default = build;