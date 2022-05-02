import { HttpClientResponse } from '@src/api/httpClient';
import { HttpError } from '@src/api/httpError';
import { handlePromiserResult } from '@src/utils/api';

describe('api', () => {
  describe('handlePromiserResult', () => {
    describe('result data is null', () => {
      describe('error is instance of HttpError', () => {
        it('should return rejected response', () => {
          const error = new HttpError();

          expect(handlePromiserResult([null, error])).toEqual([null, error]);
        });
      });

      describe('error is instance of Error', () => {
        it('should throw error', () => {
          const error = new Error();

          expect(() => {
            handlePromiserResult([null, error]);
          }).toThrowError(error);
        });
      });

      describe('error is not instance of Error', () => {
        it('should throw error', () => {
          const error = 'error';

          expect(() => {
            handlePromiserResult([null, error]);
          }).toThrow(Error);
        });
      });
    });

    describe('result data is not null', () => {
      it('should return fulfilled response', () => {
        const data = <HttpClientResponse<string>>{ data: 'data' };

        expect(handlePromiserResult([data, null])).toEqual(['data', null]);
      });
    });
  });
});
