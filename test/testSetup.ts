import '@testing-library/jest-dom';

import { server } from '#test/src/testUtils/index.js';

import { queryClient } from './src/testUtils/queryClient.js';

// Establish API mocking before all tests.
beforeAll(() => server.listen());
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
  server.resetHandlers();
  queryClient.clear();
});
// Clean up after the tests are finished.
afterAll(() => server.close());
