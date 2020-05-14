const { smart } = require("webpack-merge");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const common = require("./webpack.common.js");

module.exports = smart(common, {
    mode: "development",
    devtool: "eval-source-map",

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
            },
        ],
    },

    plugins: [new ForkTsCheckerWebpackPlugin()],
});
