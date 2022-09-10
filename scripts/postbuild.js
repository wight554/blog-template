import { readFile, writeFile } from 'fs/promises';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const { imports } = JSON.parse(await readFile(new URL('../package.json', import.meta.url)));

await writeFile(
  new URL('../dist/package.json', import.meta.url),
  JSON.stringify({ imports, type: 'module' }),
);
