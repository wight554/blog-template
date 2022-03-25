import rollupTypescript, { RollupTypescriptOptions } from '@rollup/plugin-typescript';
import { Plugin } from 'vite';

export function typescript(options?: RollupTypescriptOptions): Plugin {
  return {
    ...rollupTypescript(options),
    name: 'vite-plugin-typescript',
    options(): undefined {
      this.meta.watchMode = process.env.NODE_ENV !== 'test';

      return;
    },
    config: () => ({
      esbuild: false,
    }),
  };
}
