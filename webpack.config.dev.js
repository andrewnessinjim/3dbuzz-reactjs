const {merge} = require("webpack-merge"),
	common = require("./webpack.config.common"),
	webpack = require("webpack");

const webpackDevConfig = merge(common, {
	mode: "development",
	devtool: "eval-cheap-module-source-map",
	entry: {
		app: { 
			import:
			[
				"./src/client/client.tsx",
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