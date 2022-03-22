import { MongoErrorCode } from '@server/enums/MongoErrorCode';

export class MockMongoError extends Error {
  public readonly code: MongoErrorCode;

  constructor(readonly errorCode: MongoErrorCode) {
    super();
    this.code = errorCode;
  }
}
