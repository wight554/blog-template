import { MongoError } from '@server/enums/MongoError';

export class MongoErrorException extends Error {
  public readonly code: MongoError;

  constructor(readonly errorCode: MongoError) {
    super();
    this.code = errorCode;
  }
}
