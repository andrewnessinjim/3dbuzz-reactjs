import gulp from "gulp";
import path from "path";
import rimraf from "rimraf";
import child_process from "child_process";

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
			serverRun
		)
	)
);

gulp.task(
	"server:test",
	gulp.series(
		"server:build",
		serverTests
	)
);

gulp.task(
	"server:test:dev",
	gulp.series(
		"server:build",
		gulp.parallel(
			serverWatch,
			serverTestsWatch
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

function serverRun() {
	return $.nodemon({
		script: "./server.js",
		watch: "build",
		ignore: ["**/tests"]
	});
}

function serverTests(done) {
	child_process.exec("node ./tests.js", (err, stdout, stderr) => {
		console.log(stdout);
		console.error(stderr);

		if(err) {
			done(new $.util.PluginError("serverTests", "Test failed"));
		} else {
			done();
		}
	});
}

function serverTestsWatch() {
	return $.nodemon({
		script: "./tests.js",
		watch: "build"
	});
}