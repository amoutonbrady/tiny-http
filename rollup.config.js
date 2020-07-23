import esbuild from "rollup-plugin-esbuild";
import resolve from "@rollup/plugin-node-resolve";
import pkg from "./package.json";

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: pkg.source,
  output: [
    {
      file: pkg.main,
      format: "commonjs",
      name: "http",
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: "esm",
      name: "http",
      sourcemap: true,
    },
    {
      file: pkg.browser,
      format: "iife",
      name: "http",
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({ extensions: [".ts"] }),
    esbuild({
      include: /\.[jt]sx?$/,
      exclude: /node_modules/,
      minify: true,
      target: "esnext",
    }),
  ],
};

export default config;
