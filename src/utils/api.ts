import { StatusCodes } from 'http-status-codes';

import { HttpError } from '#src/api/httpError.js';
import { queryClient } from '#src/api/queryClient.js';
import { userQuery } from '#src/services/user.js';

export const handleApiError = (error: unknown) => {
  if (error instanceof HttpError && error.code === StatusCodes.UNAUTHORIZED) {
    queryClient.setQueryData(userQuery.queryKey, null);

    return null;
  }

  throw error;
};
