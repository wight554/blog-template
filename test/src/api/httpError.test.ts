import { createHttpError, HttpError } from '#src/api/httpError.js';

vi.mock('http-status-codes', () => ({
  getReasonPhrase: vi.fn().mockReturnValue('Test Exception'),
}));

describe('httpError', () => {
  describe('createHttpError', () => {
    it('should return http error instance', () => {
      const error = createHttpError(1);

      expect(error).toBeInstanceOf(HttpError);
    });

    it('should return http error with generated name', () => {
      const error = createHttpError(1);

      expect(error.name).toBe('TestExceptionError');
    });

    it('should return http error with given code', () => {
      const error = createHttpError(1);

      expect(error.code).toBe(1);
    });

    it('should return http error with given message', () => {
      const error = createHttpError(1, 'message');

      expect(error.message).toBe('message');
    });
  });
});
