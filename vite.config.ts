/// <reference types="vitest" />

import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import swc from 'unplugin-swc';
import checker from 'vite-plugin-checker';
import path from 'path';
import hq from 'alias-hq';

const isTest = process.env.NODE_ENV === 'test';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact({
      include: '{test/,}src/**/*.{ts,tsx}',
    }),
    isTest && swc.vite(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./**/*.{ts,tsx}"',
      },
    }),
  ],
  root: path.join(__dirname, 'src'),
  resolve: {
    alias: hq.get('rollup'),
  },
  build: {
    outDir: path.join(__dirname, 'dist/public'),
    emptyOutDir: true,
  },
  test: {
    root: process.cwd(),
    environment: 'jsdom',
    globals: true,
  },
});
