import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import esbuild from 'rollup-plugin-esbuild'
import pkg from './package.json';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/http.ts',
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
    esbuild({ target: 'esnext' })
  ],
};

export default config;
