const path = require("path");

/** @type {import("webpack").Configuration} */
module.exports = {
    entry: "./src/index.ts",
    devtool: "inline-source-map",
    mode: "development",
    module: { rules: [{ test: /\.ts$/, use: "ts-loader", exclude: [path.resolve(__dirname, "node_modules")] }] },
    resolve: { extensions: [".ts"] },
    output: { filename: "index.js", path: path.resolve(__dirname, "dist"), asyncChunks: false },
    experiments: { topLevelAwait: true },
};
