import { readFile, writeFile } from 'fs/promises';

const { imports } = JSON.parse(
  (await readFile(new URL('../package.json', import.meta.url))).toString(),
);

await writeFile(
  new URL('../dist/package.json', import.meta.url),
  JSON.stringify({ imports, type: 'module' }),
);
