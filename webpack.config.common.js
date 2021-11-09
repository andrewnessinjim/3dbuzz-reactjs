const path = require("path"),
	ESLintPlugin = require('eslint-webpack-plugin'),
	{ CleanWebpackPlugin } = require("clean-webpack-plugin");

const vendor = [
	"lodash",
	"react",
	"react-dom",
	"react-router",
	"socket.io-client",
	"rxjs"
];

module.exports = {
	entry: {
		app: ["./src/client/client.tsx"],
		vendor
	},
	output: {
		path: path.join(__dirname, "public", "build")
	},
	resolve: {
		extensions: ["", ".js", ".jsx", ".ts", ".tsx"]
	},
	module: {
		rules: [
			{test: /\.(j|t)sx?$/, use: "babel-loader", exclude: /node_modules/},
			{test: /\.json$/, use: "json-loader"},
			{test: /\.(png|jpg|jpeg|gif|woff|ttf|eot|svg|woff2)/, use: [{
				loader: "url-loader",
				options: {
					"limit": 5000
				}
			}]}
		]
	},

	plugins: [
		new CleanWebpackPlugin(),
		new ESLintPlugin()
	]
};