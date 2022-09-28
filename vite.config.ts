/// <reference types="vitest" />

import { preact } from '@preact/preset-vite';
import { default as typescript } from '@rollup/plugin-typescript';
import { readFile } from 'fs/promises';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { AliasOptions, defineConfig } from 'vite';
import { checker } from 'vite-plugin-checker';
import { configDefaults } from 'vitest/config';

const { imports }: { imports: Record<string, string> } = JSON.parse(
  (await readFile(new URL('./package.json', import.meta.url))).toString(),
);

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

const vitePathAlias: AliasOptions = Object.entries(imports).map(([key, value]) => ({
  find: new RegExp(key),
  replacement: fileURLToPath(new URL(value.replace('*', ''), import.meta.url)),
}));

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
    outDir: fileURLToPath(new URL('./dist/public', import.meta.url)),
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
    alias: vitePathAlias,
  },
});
