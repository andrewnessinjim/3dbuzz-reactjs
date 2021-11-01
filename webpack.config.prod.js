const {merge} = require("webpack-merge"),
	common = require("./webpack.config.common"),
	MiniCssExtractPlugin = require('mini-css-extract-plugin'),
	webpack = require("webpack");

const webpackProdConfig = merge(common, {
	mode: "production",
	devtool: "source-map",
	module: {
		rules: [
			{ test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] },
			{ test: /\.scss$/, use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"] }
		]
	},
	output: {
		publicPath: "/build/"
	},
	plugins: [
		new MiniCssExtractPlugin(),
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify("production"),
			IS_PRODUCTION: true,
			IS_DEVELOPMENT: false
		})
	]
});

module.exports = webpackProdConfig;