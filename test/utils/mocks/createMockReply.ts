import { FastifyReply } from 'fastify';

export const createMockReply = (): FastifyReply => {
  const res = <FastifyReply>{};

  res.header = vi.fn();
  res.status = vi.fn();
  res.send = vi.fn();

  return res;
};
