// webpack.common.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/js/index.js", // il tuo entry
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js", // in prod lo sovrascriveremo con contenthash
    assetModuleFilename: "assets/[name][ext]",
    clean: true, // pulisce dist a ogni build
  },
  module: {
    rules: [
      // immagini (png/jpg/svg/ico…)
      {
        test: /\.(png|jpe?g|svg|ico)$/i,
        type: "asset/resource",
      },
      // font opzionali
      {
        test: /\.(woff2?|ttf|otf|eot)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // userà il tuo file come base
      // Inject automatico di <script> e <link>
    }),
  ],
};
