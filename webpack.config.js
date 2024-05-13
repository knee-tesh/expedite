const path = require("path");
const { EsbuildPlugin } = require("esbuild-loader");

const SRC_DIR = path.resolve(__dirname, "src");
const OUT_DIR = path.resolve(__dirname, "build");

module.exports = {
  entry: {
    products: path.resolve(SRC_DIR, "functions/products.js"),
  },
  output: {
    path: `${OUT_DIR}`,
    filename: "[name]/[name].js",
    library: "[name]",
    libraryTarget: "umd",
  },
  externals: [
    "_http_common",
    "_http_incoming",
    "_http_server",
    /^@aws-sdk\/.*/i,
  ],
  target: "node",
  mode: "production",
  module: {
    rules: [
      {
        // Match `.js`, `.jsx`, `.ts` or `.tsx` files
        test: /\.[jt]sx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: "esbuild-loader",
        options: {
          // JavaScript version to compile to
          target: "es2015",
        },
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      new EsbuildPlugin({
        target: "es2015", // Syntax to transpile to (see options below for possible values)
      }),
    ],
  },
};
