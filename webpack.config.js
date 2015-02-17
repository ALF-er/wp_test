var webpack = require("webpack");
var yargs   = require("yargs");
var path    = require("path");

var argv = yargs
.boolean("p").alias("p", "optimize-minimize")
.argv;

module.exports = {
	entry: {
		main: [path.join(__dirname, "src", "app", "main.js")]
	},

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
			},

			{
				test:    /\.css$/,
				loaders: [
					"style",
					"css"
				]
			},

			{
				test:    /\.(png|jpg|gif)$/,
				loaders: (function() {
					var loaders = [];

					loaders.push("url?limit=50000");

					if (argv.p) {
						loaders.push("image");
					}

					return loaders;
				})()
			}
		]
	},

	resolve: {
		extensions: ["", ".js", ".jsx"],
		root:       path.join(__dirname, "src")
	},

	cache:   !argv.p,
	debug:   !argv.p,
	devtool: false,

	stats: {
		colors:  true,
		reasons: !argv.p
	},

	plugins: [new webpack.DefinePlugin({
		"process.env.NODE_ENV": JSON.stringify(argv.p ? "production" : "development"),
		"__DEV__":              !argv.p
	})]
};
