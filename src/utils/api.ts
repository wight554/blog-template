import { HttpClientResponse } from '@src/api/httpClient.js';
import { HttpError } from '@src/api/httpError.js';

export const handlePromiserResult = <T>([data, error]: [
  data: HttpClientResponse<T> | null,
  error: unknown,
]): [T, null] | [null, HttpError] => {
  if (data === null) {
    if (error instanceof HttpError) {
      return [null, error];
    } else if (error instanceof Error) {
      throw error;
    }

    throw new Error();
  }

  return [data.data, null];
};
