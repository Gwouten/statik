const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
let reload = browserSync.reload;
const autoprefix = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const imagemin = require("gulp-imagemin");
const imageminGuetzli = require("imagemin-guetzli");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");

gulp.task("sass", function() {
  return gulp
    .src("scss/**/*.scss")
    .pipe(sass())
    .on("error", function(error) {
      console.log(error.toString());
      this.emit("end");
    })
    .pipe(autoprefix())
    .pipe(cleanCSS())
    .pipe(gulp.dest("css"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

gulp.task("babel", function() {
  console.log("babelling");
  return gulp
    .src("src/js/*.js")
    .pipe(
      babel({
        presets: ["env"]
      })
    )
    .on("error", function(error) {
      console.log(error.toString());
      this.emit("end");
    })
    .pipe(gulp.dest("js"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

gulp.task("watch", ["browserSync", "sass", "babel"], function() {
  gulp.watch("scss/**/*.scss", ["sass"]);
  gulp.watch("src/js/*.js", ["babel"]);
  gulp.watch("*.html", reload);
  gulp.watch("*.php", reload);
});

gulp.task("browserSync", function() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: "./"
    }
  });
});

gulp.task("imagemin", ["guetzli"], function() {
  gulp
    .src("assets/img/**/*.{gif,svg,mp4}")
    .pipe(imagemin())
    .pipe(gulp.dest("img"));
});

gulp.task("guetzli", function() {
  gulp
    .src("assets/img/**/*.{jpg, png}")
    .pipe(imagemin([imageminGuetzli()]))
    .pipe(gulp.dest("img"));
});

gulp.task("package", ["sass", "babel", "imagemin"], function() {
  gulp.src("css/*.css").pipe(gulp.dest("dist/css"));
  gulp.src("js/*.js").pipe(gulp.dest("dist/js"));
  gulp.src("font").pipe(gulp.dest("dist/font"));
  gulp.src("**/*.{html,php,ico}").pipe(gulp.dest("dist"));
});
