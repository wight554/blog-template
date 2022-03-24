/// <reference types="vitest" />

import path from 'path';

import preact from '@preact/preset-vite';
import typescript from '@rollup/plugin-typescript';
import swc from 'unplugin-swc';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults } from 'vitest/config';

const isTest = process.env.NODE_ENV === 'test';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact({
      include: '{test/,}src/**/*.{ts,tsx}',
    }),
    tsconfigPaths(),
    !isTest &&
      checker({
        typescript: { tsconfigPath: 'tsconfig.client.json' },
        eslint: {
          lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
        },
      }),
    isTest && swc.vite(),
  ],
  ...(isTest && { esbuild: false }),
  build: {
    outDir: path.join(__dirname, 'dist/public'),
    emptyOutDir: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      exclude: [...configDefaults.coverage.exclude, '**/schemas/**'],
    },
    setupFiles: ['test/testSetup.ts'],
  },
});
