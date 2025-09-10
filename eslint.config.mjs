import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    // 告訴 ESLint 不要檢查的資料夾和檔案
    ignores: ["dist/**", "package-lock.json"],
  },
  {
    files: ["webpack.config.js"],
    languageOptions: {
      sourceType: "commonjs", // webpack.config.js 用 CommonJS
      globals: {
        ...globals.node, // Node 環境
      },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "module" } },
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
  },
]);
