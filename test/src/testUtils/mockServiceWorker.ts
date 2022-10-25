import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { mockPost, mockUser } from '#test/src/mocks/index.js';

const handlers = [
  rest.get('*/api/v1/users', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockUser));
  }),
  rest.post('*/api/v1/users', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockUser));
  }),
  rest.post('*/api/v1/auth/login', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockUser));
  }),
  rest.post('*/api/v1/auth/logout', (_req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get('*/api/v1/posts', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json([mockPost, { ...mockPost, id: '2' }]));
  }),
];

export const server = setupServer(...handlers);
