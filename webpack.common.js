const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/js/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    assetModuleFilename: "assets/[name][ext]",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|svg|ico)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff2?|ttf|otf|eot)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "src/img/favicon",
          to: "favicon", // Le favicon saranno servite da /favicon/
        },
      ],
    }),
  ],
};