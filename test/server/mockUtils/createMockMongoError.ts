import { MongoError } from 'mongodb';

export const createMockMongoError = (code: string | number): MongoError => {
  const error = new MongoError('MockMongoError');

  error.code = code;

  return error;
};
