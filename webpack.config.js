const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index.js",
    login: "./src/login.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    // publicPath: "/todoList/", // 對應你的 repo 名稱(暫時註解，開發模式再打開)
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
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      chunks: ["index"], // 只引入 index.js
    }),
    new HtmlWebpackPlugin({
      template: "./src/login.html",
      filename: "login.html",
      chunks: ["login"], // 只引入 login.js
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    hot: true,
    compress: true,
    port: 9000,
    open: true,
  },
};
