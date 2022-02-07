import { Response } from 'express';

export const createMockResponse = (): Response => {
  const res = <Response>{};

  res.setHeader = vi.fn();
  res.status = vi.fn();
  res.json = vi.fn();

  return res;
};
