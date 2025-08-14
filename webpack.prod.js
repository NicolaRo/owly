// webpack.prod.js
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require("dotenv-webpack");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  devtool: false, // oppure "source-map" se vuoi sourcemap in prod
  output: {
    filename: "bundle.[contenthash].js",
  },
  module: {
    rules: [
      // SCSS in PROD: estraiamo in file fisico
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
      path: "./.env.production", // file prod (opzionale, vedi Step 6)
      systemvars: true,          // se la variabile è su Netlify UI, la prende da lì
    }),
  ],
  optimization: {
    splitChunks: { chunks: "all" }, // opzionale ma utile
  },
});
