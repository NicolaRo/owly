const { merge } = require("webpack-merge");
const Dotenv = require("dotenv-webpack");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  output: {
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/i,
        use: [
          "style-loader",
          { loader: "css-loader", options: { sourceMap: true } },
          { loader: "sass-loader", options: { sourceMap: true } },
        ],
      },
    ],
  },
  devServer: {
    static: "./dist",
    port: 8800,
    open: true,
  },
  plugins: [
    new Dotenv({
      path: "./.env",
      systemvars: true,
    }),
  ],
});