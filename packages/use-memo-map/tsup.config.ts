import { defineConfig } from 'tsup';

export default defineConfig([
  {
    dts: true,
    entry: {
      'use-memo-map': './src/index.ts'
    },
    format: ['cjs', 'esm'],
    sourcemap: true
  }
]);
