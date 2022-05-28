import tlp = require('@testing-library/preact');

export const { screen, waitFor, fireEvent, cleanup } = tlp;

export { renderWithProviders as render } from './renderWithProviders.js';

export * from './components/index.js';
