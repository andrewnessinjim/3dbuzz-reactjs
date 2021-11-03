const {merge} = require("webpack-merge"),
	common = require("./webpack.config.common"),
	webpack = require("webpack"),
	ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const webpackDevConfig = merge(common, {
	mode: "development",
	entry: {
		app: { 
			import:
			[
				"./src/client/client.js",
				"react-hot-loader/patch"
			],
			dependOn: "vendor" 
		}
	},
	module: {
		rules: [
			{ test: /\.css$/, use: ["style-loader", "css-loader"] },
			{ test: /\.scss$/, use: [
				"style-loader",
				{loader: "css-loader", options: {sourceMap: true}},
				{loader: "sass-loader", options: {sourceMap: true}}] 
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify("development"),
			IS_PRODUCTION: false,
			IS_DEVELOPMENT: true
		})
	]
});

module.exports = webpackDevConfig;