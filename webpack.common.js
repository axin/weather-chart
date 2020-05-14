const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    name: "app",
    entry: "./src/widget.ts",

    output: {
        library: "WeatherChart",
        filename: "chart.js",
        path: path.resolve(__dirname, "dist"),
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [{ loader: "ts-loader" }],
            },
        ],
    },

    resolve: {
        extensions: [".ts", ".js"],
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/index-template.html",
        }),
        new CopyPlugin([
            { from: "./data", to: "data" },
            { from: "./src/styles.css", to: "." },
            { from: "./src/data-store/data-fetcher-worker.js", to: "." },
        ]),
    ],
};
