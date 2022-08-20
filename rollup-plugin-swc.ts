import { createFilter } from '@rollup/pluginutils';
import type { Options, Output, Program } from '@swc/core';
import type { Plugin } from 'vite';

export const queryRE = /\?.*$/;
export const hashRE = /#.*$/;

export const cleanUrl = (url: string) => url.replace(hashRE, '').replace(queryRE, '');

export function RollupPluginSwc(): Plugin {
  let transform: (src: string | Program, options?: Options) => Promise<Output>;
  // todo: load swc/tsconfig from config files
  const config: Options = {
    module: {
      type: 'es6',
    },
    jsc: {
      target: 'es2019',
      parser: {
        syntax: 'typescript',
        decorators: true,
      },
      transform: {
        legacyDecorator: true,
        decoratorMetadata: true,
      },
    },
  };

  const filter = createFilter(/\.(tsx?|jsx)$/, /\.js$/);

  return {
    name: 'rollup-plugin-swc',
    async transform(code, id) {
      if (filter(id) || filter(cleanUrl(id))) {
        if (!transform) transform = (await import('@swc/core')).transform;

        const result = await transform(code, {
          ...config,
          filename: id,
        });
        return {
          code: result.code,
          map: result.map,
        };
      }
    },
  };
}
