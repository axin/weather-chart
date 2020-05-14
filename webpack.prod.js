const { smart } = require("webpack-merge");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const common = require("./webpack.common.js");

module.exports = smart(common, {
    mode: "production",
    devtool: "hidden-source-map",

    plugins: [
        new CleanWebpackPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
    ],
});
