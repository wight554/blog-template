import { Document } from 'mongoose';

export const createMockDocument = (json?: unknown) => {
  const response = Object.create(Document.prototype);

  response.toJSON = vi.fn().mockReturnValueOnce(json);

  return response;
};
