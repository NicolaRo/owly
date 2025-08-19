// webpack.prod.js
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
      // SCSS in PROD: estrae i CSS in un file separato
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
      path: "./.env.production", // file prod con le variabili d'ambiente
      systemvars: true,          // se la variabile è su Netlify UI, la prende da lì
    }),
  ],
  optimization: {
    splitChunks: { chunks: "all" }, // ottimizza il caricamento dei moduli
  },
});
