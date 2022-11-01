import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { mockPost, mockUser } from '#test/src/mocks/index.js';

import { delay } from './helpers.js';

const handlers = [
  rest.get('*/api/v1/users', async (_req, res, ctx) => {
    return delay(res(ctx.status(200), ctx.json(mockUser)), 10);
  }),
  rest.post('*/api/v1/users', async (_req, res, ctx) => {
    return delay(res(ctx.status(200), ctx.json(mockUser)), 10);
  }),
  rest.post('*/api/v1/auth/login', async (_req, res, ctx) => {
    return delay(res(ctx.status(200), ctx.json(mockUser)), 10);
  }),
  rest.post('*/api/v1/auth/logout', async (_req, res, ctx) => {
    return delay(res(ctx.status(200)), 10);
  }),
  rest.get('*/api/v1/posts', async (_req, res, ctx) => {
    return delay(res(ctx.status(200), ctx.json([mockPost, { ...mockPost, id: '2' }])), 10);
  }),
];

export const server = setupServer(...handlers);
