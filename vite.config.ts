/// <reference types="vitest" />

import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import swc from 'unplugin-swc';
import checker from 'vite-plugin-checker';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

const isTest = process.env.NODE_ENV === 'test';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact({
      include: '{test/,}src/**/*.{ts,tsx}',
    }),
    tsconfigPaths({ root: __dirname }),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./**/*.{ts,tsx}"',
      },
    }),
    isTest && swc.vite(),
  ],
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
