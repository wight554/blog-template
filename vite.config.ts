/// <reference types="vitest" />

import path from 'path';

import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import typescript from 'vite-plugin-typescript';
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
    deps: {
      inline: [
        '@mui/material',
        '@mui/system',
        '@mui/private-theming',
        '@mui/styled-engine',
        '@mui/utils',
        '@mui/base',
        '@emotion/react',
        '@emotion/styled',
      ],
    },
    alias: [
      {
        find: 'recoil',
        replacement: path.resolve(__dirname, './node_modules/recoil/es/index.mjs'),
      },
      {
        find: 'react-router-dom',
        replacement: path.resolve(__dirname, './node_modules/react-router-dom/index.js'),
      },
      {
        find: 'react-router',
        replacement: path.resolve(__dirname, './node_modules/react-router/index.js'),
      },
      {
        find: /@mui\/material\/node/,
        replacement: '@mui/material',
      },
      {
        find: /@mui\/private-theming\/node/,
        replacement: '@mui/private-theming',
      },
      {
        find: /@mui\/styled-engine\/node/,
        replacement: '@mui/styled-engine',
      },
      {
        find: /@mui\/base\/node/,
        replacement: '@mui/base',
      },
      {
        find: /@mui\/system\/index.js/,
        replacement: '@mui/system/esm/index.js',
      },
      {
        find: /@mui\/utils\/index.js/,
        replacement: '@mui/utils/esm/index.js',
      },
    ],
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
