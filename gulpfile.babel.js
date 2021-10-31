import gulp from "gulp";
import path from "path";
import rimraf from "rimraf";

const $ = require("gulp-load-plugins")();

gulp.task("server:clean", done => {
	rimraf("./build", done);
});

gulp.task("server:build",
	gulp.series(
		"server:clean",
		serverBuild
	));

gulp.task(
	"server:watch",
	gulp.series(
		"server:build",
		serverWatch
	));

gulp.task(
	"server:dev",
	gulp.series(
		"server:build",
		gulp.parallel(
			serverWatch,
			function nodemon() {
				return $.nodemon({
					script: "./server.js",
					watch: "build"
				});
			}
		)
	)
);

function serverBuild() {
	return gulp.src("./src/server/**/*.js")
		.pipe($.changed("./build"))
		.pipe($.sourcemaps.init())
		.pipe($.babel())
		.pipe($.sourcemaps.write(".", { sourceRoot: path.join(__dirname, "src", "server") }))
		.pipe(gulp.dest("./build"));
}

function serverWatch() {
	return gulp.watch("./src/server/**/*.js", gulp.series(serverBuild));
}