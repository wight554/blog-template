import { createRequire } from 'module';

try {
  const require = createRequire(import.meta.url);

  require('husky').install();
} catch (e) {
  if (e.code !== 'MODULE_NOT_FOUND') throw e;
}
