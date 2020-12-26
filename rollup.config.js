import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { babel } from '@rollup/plugin-babel';
import pkg from './package.json';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.unpkg,
      format: 'iife',
      name: 'TinyHttp',
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [
    nodeResolve({ extensions: ['.ts'] }),
    babel({
      extensions: ['.ts'],
      presets: ['@babel/preset-typescript'],
      babelHelpers: 'bundled',
    }),
  ],
};

export default config;
