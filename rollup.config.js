const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const typescript = require("@rollup/plugin-typescript");
const postcss = require("rollup-plugin-postcss");

module.exports = {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "esm",
        sourcemap: true
      }
    ],
    external: ["react", "react-dom"],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      postcss({
        inject: true,
        minimize: true,
        use: ["sass"]
      })
    ]
  };