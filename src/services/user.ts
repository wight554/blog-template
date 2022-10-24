import { useQuery } from '@tanstack/react-query';

import { httpClient } from '#src/api/httpClient.js';
import { User } from '#src/interfaces/model/User.js';

export enum UserRoutes {
  LOGIN = '/api/v1/auth/login',
  LOGOUT = '/api/v1/auth/logout',
  GET = '/api/v1/users',
  SIGN_UP = '/api/v1/users',
}

const getUser = () => httpClient.get<User>(UserRoutes.GET).then((res) => res.data);

export const userQuery = {
  queryKey: ['user'],
  queryFn: () => getUser(),
  retry: 0,
};

export const useUser = () => {
  return useQuery(userQuery);
};
