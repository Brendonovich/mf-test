const rspack = require("@rspack/core");
const refreshPlugin = require("@rspack/plugin-react-refresh");
const { withZephyr } = require("zephyr-webpack-plugin");
const isDev = process.env.NODE_ENV === "development";
/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = withZephyr()({
	context: __dirname,
	entry: {
		main: "./src/index.ts",
	},
	devServer: {
		historyApiFallback: true,
		port: 8080,
	},
	resolve: {
		extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
	},
	module: {
		rules: [
			{
				test: /\.svg$/,
				type: "asset",
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: {
									tailwindcss: {},
									autoprefixer: {},
								},
							},
						},
					},
				],
				type: "css",
			},
			{
				test: /\.jsx|\.tsx$/,
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: [["solid"]],
							plugins: ["solid-refresh/babel"],
						},
					},
				],
			},
		],
	},
	plugins: [
		new rspack.container.ModuleFederationPlugin({
			name: "mf_test",
			filename: "remoteEntry.js",
			exposes: {},
			shared: {},
		}),
		new rspack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
		}),
		new rspack.ProgressPlugin({}),
		new rspack.HtmlRspackPlugin({
			template: "./src/index.html",
		}),
		isDev ? new refreshPlugin() : null,
	].filter(Boolean),
});
