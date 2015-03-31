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

		if (argv.h) {
			entry.push("webpack-dev-server/client?/");
			entry.push("webpack/hot/dev-server");
		}

		entry.push(path.join(__dirname, "src", "app", "main.js"));

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
				test:    /\.js$/,
				exclude: /\/node_modules\//,
				loaders: []
			}
		]
	},

	resolve: {
		extensions:         ["", ".js", ".jsx"],
		root:               path.join(__dirname, "src", "app"),
		modulesDirectories: ["web_modules", "node_modules", "src"]
	},

	cache:   !argv.p,
	debug:   !argv.p,
	devtool: !argv.p ? "sourcemap" : false,

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
			plugins.push(new webpack.HotModuleReplacementPlugin());
			plugins.push(new webpack.NoErrorsPlugin());
		}

		return plugins;
	})()
};
