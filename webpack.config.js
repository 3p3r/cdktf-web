const fs = require("fs");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

const ALL_PACKAGES = [
  "constructs",
  "cdktf",
  "@cdktf/provider-aws",
  "@cdktf/provider-google",
  "@cdktf/provider-azurerm",
];

const entryName = (package) => package.replace("@", "").replace("/", "-");

const createEntry = (package) =>
  fs.writeFileSync(
    `./index.${entryName(package)}.js`,
    `export * from "${package}";\n${
      package === "cdktf" ? "export * as fs from 'memfs';" : ""
    }`,
    "utf8"
  );

const createLibrary = (package) => ({
  commonjs: package,
  amd: package,
  root: entryName(package).replace(/-/g, "_").toUpperCase(),
});

const createConfig = (package) => (
  createEntry(package),
  (env) => {
    /** @type {webpack.Configuration} */
    const config = {
      mode: env.production ? "production" : "development",
      devtool: package.includes("provider")
        ? false
        : env.production
        ? "source-map"
        : "inline-source-map",
      entry: `./index.${entryName(package)}.js`,
      output: {
        path: __dirname + "/dist",
        filename: `bundle.${entryName(package)}.js`,
        library: createLibrary(package),
        libraryTarget: "umd",
        umdNamedDefine: true,
        globalObject: `(typeof self !== 'undefined' ? self : this)`,
      },
      externals: ALL_PACKAGES.filter((p) => p !== package).map(createLibrary),
      optimization: {
        minimize: env.production,
        minimizer: [
          new TerserPlugin({
            extractComments: false,
            terserOptions: {
              format: {
                comments: false,
              },
            },
          }),
        ],
      },
      plugins: [
        new webpack.ProvidePlugin({
          process: "process/browser",
          console: "console-browserify",
        }),
      ],
      resolve: {
        extensions: [".js"],
        fallback: {
          net: false,
          child_process: false,
          buffer: require.resolve("buffer"),
          crypto: require.resolve("crypto-browserify"),
          os: require.resolve("os-browserify/browser"),
          path: require.resolve("path-browserify"),
          fs: require.resolve("memfs"),
          stream: require.resolve("stream-browserify"),
          util: require.resolve("util"),
          assert: require.resolve("assert"),
          url: require.resolve("url"),
        },
      },
    };

    return config;
  }
);

module.exports = ALL_PACKAGES.map(createConfig);
