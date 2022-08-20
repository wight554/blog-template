/// <reference types="vitest" />

import { createRequire } from 'module';
import path from 'path';

import preact from '@preact/preset-vite';
import swc from 'unplugin-swc';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import { configDefaults } from 'vitest/config';

const isTest = process.env.NODE_ENV === 'test';

const {
  coverage: { exclude: coverageExclude = [] },
} = configDefaults;

const generateCjsAlias = (packages: Array<string>) => {
  const require = createRequire(import.meta.url);

  return packages.map((p) => ({
    find: p,
    replacement: require.resolve(p),
  }));
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact({
      include: '{test/,}src/**/*.{ts,tsx}',
    }),
    !isTest &&
      checker({
        typescript: { tsconfigPath: 'src/tsconfig.json' },
        eslint: {
          lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
        },
      }),
    isTest && swc.vite(),
  ],
  build: {
    outDir: path.join(__dirname, 'dist/public'),
    emptyOutDir: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'istanbul',
      exclude: [...coverageExclude, '**/schemas/**'],
    },
    setupFiles: ['test/testSetup.ts', 'test/recoilTestSetup.ts'],
    alias: [...generateCjsAlias(['preact/hooks', '@testing-library/preact'])],
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
