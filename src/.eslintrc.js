module.exports = {
  extends: ['preact', '../.eslintrc.js'],
  // no-op: workaround for eslint-config-preact
  settings: { jest: { version: 27 } },
};
