import { useQuery } from '@tanstack/react-query';

import { httpClient } from '#src/api/httpClient.js';
import { User } from '#src/interfaces/model/User.js';

import { promiser } from '../api/promiser.js';
import { handleApiError } from '../utils/api.js';

export enum UserRoutes {
  LOGIN = '/api/v1/auth/login',
  LOGOUT = '/api/v1/auth/logout',
  GET = '/api/v1/users',
  SIGN_UP = '/api/v1/users',
}

const getUser = async () => {
  const [response, error] = await promiser(httpClient.get<User>(UserRoutes.GET));

  if (response) {
    return response.data;
  }

  if (error) {
    return handleApiError(error);
  }
};

export const userQuery = {
  queryKey: ['user'],
  queryFn: () => getUser(),
  retry: 0,
};

export const useUser = () => {
  return useQuery(userQuery);
};
