const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/todoList/", // 對應你的 repo 名稱
  },
  module: {
    rules: [
      {
        test: /\.css$/, // 處理 CSS 檔案
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i, //處理 SCSS SASS 檔案
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
    open: true,
  },
};
