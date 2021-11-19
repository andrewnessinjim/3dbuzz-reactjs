import gulp from "gulp";
import path from "path";
import rimraf from "rimraf";
import child_process from "child_process";
import chalk from "chalk";

import webpackProdConfig from "./webpack.config.prod";
import webpackDevConfig from "./webpack.config.dev";
import { webpack } from "webpack";

const $ = require("gulp-load-plugins")();

gulp.task("server:clean", done => {
	rimraf("./build", done);
});

gulp.task("server:build",
	gulp.series(
		"server:clean",
		buildServer
	));

gulp.task(
	"server:dev",
	gulp.series(
		"server:build",
		gulp.parallel(
			watchServer,
			runServer
		)
	)
);

gulp.task(
	"server:test",
	gulp.series(
		"server:build",
		testServer
	)
);

gulp.task(
	"server:test:dev",
	gulp.series(
		"server:build",
		gulp.parallel(
			watchServer,
			watchServerTests
		)
	)
);

function buildServer() {
	return gulp.src(["./src/server/**/*.js","./src/server/**/*.ts"])
		.pipe($.changed("./build"))
		.pipe($.sourcemaps.init())
		.pipe($.babel())
		.pipe($.sourcemaps.write(".", { sourceRoot: path.join(__dirname, "src", "server") }))
		.pipe(gulp.dest("./build"));
}

function watchServer() {
	return gulp.watch(["./src/server/**/*.js","./src/server/**/*.ts"], gulp.series(buildServer));
}

function runServer() {
	return $.nodemon({
		script: "./server.js",
		watch: "build",
		ignore: ["**/tests"],
		nodeArgs: ["--inspect=0.0.0.0:9229"]
	});
}

function testServer(done) {
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

function watchServerTests() {
	return $.nodemon({
		script: "./tests.js",
		watch: "build"
	});
}

// -------------------------------------
// Client
const consoleStats = {
	colors: true,
	exclude: ["node_modules"],
	chunks:false,
	assets: false,
	timings: true,
	modules: false,
	hash: false,
	version: false
};

gulp.task("client:build", buildClient);
gulp.task("client:dev", watchClient);

function buildClient(done) {
	let webpackConfig;
	if(process.env.NODE_ENV === "production") {
		console.log(chalk.bgRed.white("Using webpack PRODUCTION config"));
		webpackConfig = webpackProdConfig;
	} else {
		console.log(chalk.bgRed.white("Using webpack DEVELOPMENT config"));
		webpackConfig = webpackDevConfig;
	}

	webpack(webpackConfig, (err, stats) => {
		if(err) {
			done(err);
			return;
		}

		console.log(stats.toString(consoleStats));
		done();
	});
}

function watchClient() {
	const WebpackDevServer = require("webpack-dev-server");
	const compiler = webpack(webpackDevConfig);
	const server = new WebpackDevServer({
		hot: true,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
			"Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
		}
	}, compiler);

	server.start(8080, ()=>{});
}

// -------------------------------------
// Other Tasks
gulp.task("dev", gulp.parallel("server:dev", "client:dev"));
gulp.task("build", gulp.parallel("server:build", "client:build"));