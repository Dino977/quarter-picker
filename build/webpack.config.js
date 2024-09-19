const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const TerserPlugin = require("terser-webpack-plugin");

const config = require("./config");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(process.cwd(), "./lib"),
    filename: "bundle.js",
    library: {
      type: "umd",
      name: "OPERATION",
      umdNamedDefine: true,
    },
  },
  resolve: {
    alias: config.alias,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false, // 移除注释
      }),
    ],
  },
};
