import { FastifyReply } from 'fastify';

export const createMockReply = (): FastifyReply => {
  const reply = <FastifyReply>{};

  reply.header = vi.fn();
  reply.status = vi.fn();
  reply.send = vi.fn();

  return reply;
};
