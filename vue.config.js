const MiniCssExtractPlugin = require("mini-css-extract-plugin");

var config = process.env.NODE_ENV === 'production' ? {
  outputDir: __dirname + "/dist/lib",
  assetsDir: "static",
  configureWebpack: {
    externals: { vue: 'Vue' },
    entry: "./src/index.ts",
    output: {
      filename: "./static/[name].min.js"
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "./static/[name].min.css",
      }),
    ],
    optimization: {
      splitChunks: false,
      minimize: true
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader",
          ],
          sideEffects: true
        }
      ],
    },
  },
} : {};

module.exports = config;
