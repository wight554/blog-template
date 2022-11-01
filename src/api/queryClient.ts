import { QueryClient } from '@tanstack/react-query';
import { StatusCodes } from 'http-status-codes';

import { HttpError } from '#src/api/httpError.js';

const MAX_RETRY_COUNT = 3;

const handleApiRetry = (failureCount: number, error: unknown) => {
  if (error instanceof HttpError && error.code === StatusCodes.UNAUTHORIZED) {
    return false;
  }

  return failureCount < MAX_RETRY_COUNT;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 3600, // 1h
      retry: handleApiRetry,
    },
  },
});
