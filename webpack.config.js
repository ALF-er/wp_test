var webpack = require("webpack");
var yargs   = require("yargs");
var path    = require("path");

var argv = yargs
	.boolean("p").alias("p", "optimize-minimize")
	.boolean("h").alias("h", "hot")
	.argv;

module.exports = {
	entry: (function() {
		var entry = [];

		// if (argv.h) {
		// 	entry.push("webpack-dev-server/client?/");
		// 	entry.push("webpack/hot/dev-server");
		// }

		entry.push(path.join(__dirname, "src", "app", "entrypoints", "main.jsx"));

		return {
			main: entry
		};
	})(),

	output: {
		path:       path.join(__dirname, "dist", "app"),
		filename:   "[name].js",
		publicPath: "/app/"
	},

	module: {
		loaders: [
			{
				test:    /fetch.js$/,
				loaders: [
					"exports?fetch=window.fetch.bind(window),Headers=window.Headers,Request=window.Request,Response=window.Response",
					"babel"
				]
			},

			{
				test:    /\.jsx$/,
				exclude: [/node_modules/],
				loaders: ["babel"]
			}
		]
	},

	resolve: {
		extensions:         ["", ".js", ".jsx", ],
		root:               path.join(__dirname, "src", "app"),
		modulesDirectories: ["web_modules", "node_modules", "src"]
	},

	cache:   !argv.p,
	debug:   !argv.p,
	devtool: !argv.p ? "eval-cheap-module-source-map" : false,

	stats: {
		colors:  true,
		reasons: !argv.p
	},

	plugins: (function() {
		var plugins = [];

		plugins.push(
			new webpack.DefinePlugin({
				"process.env.NODE_ENV": JSON.stringify(argv.p ? "production" : "development"),
				"__DEV__":              !argv.p
			})
		);

		if (argv.p) {
			plugins.push(new webpack.optimize.DedupePlugin());
			plugins.push(new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false
				}
			}));
			plugins.push(new webpack.optimize.OccurenceOrderPlugin());
			plugins.push(new webpack.optimize.AggressiveMergingPlugin());
		}

		if (argv.h) {
			plugins.push(new webpack.NoErrorsPlugin());
		}

		return plugins;
	})()
};
