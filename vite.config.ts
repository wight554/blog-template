/// <reference types="vitest" />

import path from 'path';

import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';
import { default as checker } from 'vite-plugin-checker';
import { default as typescript } from 'vite-plugin-typescript';
import { configDefaults } from 'vitest/config';

const isTest = process.env.NODE_ENV === 'test';

const {
  coverage: { exclude: coverageExclude = [] },
} = configDefaults;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact({
      include: '{test/,}src/**/*.{ts,tsx}',
    }),
    // !isTest && tsconfigPaths(),
    !isTest &&
      checker({
        typescript: { tsconfigPath: 'src/tsconfig.json' },
        eslint: {
          lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
        },
      }),
    isTest && typescript(),
  ],
  build: {
    outDir: path.join(__dirname, 'dist/public'),
    emptyOutDir: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      exclude: [...coverageExclude, '**/schemas/**'],
    },
    setupFiles: ['test/testSetup.ts', 'test/recoilTestSetup.ts'],
  },
  resolve: {
    alias: [
      {
        find: /#((src|server|test).*)/,
        replacement: path.resolve(__dirname, '$1'),
      },
    ],
  },
});
