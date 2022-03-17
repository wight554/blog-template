/// <reference types="vitest" />

import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import checker from 'vite-plugin-checker';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import typescript from 'rollup-plugin-typescript2';

const isTest = process.env.NODE_ENV === 'test';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact({
      include: '{test/,}src/**/*.{ts,tsx}',
    }),
    tsconfigPaths({ root: __dirname }),
    !isTest &&
      checker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint "./**/*.{ts,tsx}"',
        },
      }),
    isTest &&
      typescript({
        tsconfigOverride: { compilerOptions: { module: 'ESNext' } },
      }),
  ],
  ...(isTest && { esbuild: false }),
  root: path.join(__dirname, 'src'),
  build: {
    outDir: path.join(__dirname, 'dist/public'),
    emptyOutDir: true,
  },
  test: {
    root: process.cwd(),
    environment: 'happy-dom',
    globals: true,
  },
});
