import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { mockUser } from '../mocks/index.js';

const handlers = [
  rest.get('*/users', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockUser));
  }),
  rest.post('*/api/v1/users', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockUser));
  }),
  rest.post('*/api/v1/auth/logout', (_req, res, ctx) => {
    return res(ctx.status(200));
  }),
];

export const server = setupServer(...handlers);
