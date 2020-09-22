import { nodeResolve } from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import pkg from "./package.json";

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: "src/index.ts",
  output: [
    {
      file: pkg.module,
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    nodeResolve({ extensions: [".ts"] }),
    babel({
      extensions: [".ts"],
      presets: ["@babel/typescript"],
      babelHelpers: "bundled",
    }),
  ],
};

export default config;
