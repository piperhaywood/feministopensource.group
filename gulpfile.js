var autoprefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync").create();
var concat = require("gulp-concat");
let cleanCSS = require("gulp-clean-css");
var gulp = require("gulp");
var nunjucks = require("gulp-nunjucks");
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");

gulp.task("browserSync", function() {
  browserSync.init({
    server: "./dist/"
  });
});

gulp.task("fonts", function() {
  return gulp
    .src(["./src/fonts/**/*", "!./src/fonts/.gitkeep"])
    .pipe(gulp.dest("./dist/fonts/"));
});

gulp.task("js", function() {
  return gulp
    .src("./src/js/scripts.js")
    .pipe(concat("scripts.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./dist/"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

gulp.task("nunjucks", function() {
  return gulp
    .src([
      "./src/html/**/*.html",
      "!./src/html/**/_*.html",
      "!./src/html/**/_*/**/*.html"
    ])
    .pipe(nunjucks.compile())
    .pipe(gulp.dest("./dist/"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

gulp.task("sass", function() {
  return gulp
    .src(["./src/css/**/main.scss"])
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(concat("main.css"))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./dist/"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

gulp.task("default", gulp.series(["fonts", "js", "nunjucks", "sass"]));

gulp.task(
  "watch",
  gulp.parallel(["default", "browserSync"], function() {
    gulp.watch("./src/js/**/*.js", gulp.parallel("js"));
    gulp.watch("./src/html/**/*.html", gulp.parallel("nunjucks"));
    gulp.watch("./src/css/**/*.scss", gulp.parallel("sass"));
  })
);
