import { useQuery } from '@tanstack/react-query';

import { httpClient } from '#src/api/httpClient.js';
import { User } from '#src/interfaces/model/User.js';

export enum UserRoutes {
  LOGIN = '/api/v1/auth/login',
  LOGOUT = '/api/v1/auth/logout',
  GET = '/api/v1/users',
  SIGN_UP = '/api/v1/users',
}

export const useUser = () => {
  return useQuery(['user'], () => httpClient.get<User>(UserRoutes.GET).then((res) => res.data), {
    retry: 0,
    initialData: null,
  });
};
