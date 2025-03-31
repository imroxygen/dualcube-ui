const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const typescript = require("@rollup/plugin-typescript");
const postcss = require("rollup-plugin-postcss");
const sass = require("sass");
const peerDepsExternal = require("rollup-plugin-peer-deps-external");
const json = require("@rollup/plugin-json");

module.exports = {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "esm",
        sourcemap: true,
        generatedCode: {
          preserveThis: true, // Prevents Rollup from rewriting this to undefined
        },
      }
    ],
    context: "this",
    external: ["react", "react-dom", "react-router-dom"],
    plugins: [
      json(),
      peerDepsExternal(),
      resolve({
        browser: true,
        preferBuiltins: false // Ensure that built-in Node modules aren't prioritized
      }),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      postcss({
        inject: true,
        minimize: true,
        extensions: [".scss", ".sass", ".css"],
        implementation: sass,
      })
    ],

    onwarn(warning, warn) {
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;  // Ignore "use client" warnings
      }
      warn(warning);  // Log other warnings normally
    }
  };