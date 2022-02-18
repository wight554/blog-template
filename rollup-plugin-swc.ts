import { createFilter } from '@rollup/pluginutils';
import { transform } from '@swc/core';
import { Plugin } from 'vite';

const queryRE = /\?.*$/;
const hashRE = /#.*$/;
const cleanUrl = (url: string) => url.replace(hashRE, '').replace(queryRE, '');

export function RollupPluginSwc(): Plugin {
  const filter = createFilter(/\.(tsx?|jsx)$/, /\.js$/);

  return {
    name: 'rollup-plugin-swc',
    async transform(code, id) {
      if (filter(id) || filter(cleanUrl(id))) {
        const result = await transform(code, {
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
