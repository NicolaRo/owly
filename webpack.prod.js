const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require("dotenv-webpack");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  devtool: false,
  output: {
    filename: "bundle.[contenthash].js",
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.[contenthash].css",
    }),
    new Dotenv({
      systemvars: true, // Per Netlify: prende le variabili dalle Environment Variables
      silent: true, // Non crasha se non trova .env in production
    }),
  ],
  optimization: {
    splitChunks: { chunks: "all" },
  },
});