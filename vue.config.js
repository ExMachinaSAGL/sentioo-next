// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  outputDir: __dirname + "/dist/lib",
  assetsDir: "static",
  configureWebpack: {
    entry: "./src/index.ts",
    output: {
      filename: "lib/static/[name].min.js",
      library: "[name]",
      libraryTarget: "umd",
    },
    plugins: [
        /*
      new MiniCssExtractPlugin({
        filename: "lib/[name].min.css",
      }),
      */
    ],
  },
};
