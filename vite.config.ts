/// <reference types="vitest" />

import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import path from 'path';
import hq from 'alias-hq';
import { RollupPluginSwc } from './rollup-plugin-swc';

const isTest = process.env.NODE_ENV === 'test';

// https://vitejs.dev/config/
export default defineConfig({
  ...(isTest && { esbuild: false }),
  plugins: [
    preact({
      include: '{test/,}src/**/*.{ts,tsx}',
    }),
    isTest && RollupPluginSwc(),
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
