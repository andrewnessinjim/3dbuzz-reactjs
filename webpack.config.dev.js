const {merge} = require("webpack-merge"),
	common = require("./webpack.config.common"),
	webpack = require("webpack");

const webpackDevConfig = merge(common, {
	mode: "development",
	module: {
		rules: [
			{ test: /\.css$/, use: ["style-loader", "css-loader"] },
			{ test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"] }
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify("development"),
			IS_PRODUCTION: false,
			IS_DEVELOPMENT: true
		})
	]
});

module.exports = webpackDevConfig;