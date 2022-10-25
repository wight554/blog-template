import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { StatusCodes } from 'http-status-codes';
import { useAtom } from 'jotai';

import { httpClient } from '#src/api/httpClient.js';
import { HttpError } from '#src/api/httpError.js';
import { promiser } from '#src/api/promiser.js';
import { User } from '#src/interfaces/model/User.js';
import { LoginPayload } from '#src/interfaces/payload/LoginPayload.js';
import { SignUpPayload } from '#src/interfaces/payload/SignUpPayload.js';

import { snackbarAtom } from '../atoms/snackbar.js';

enum UserRoutes {
  LOGIN = '/api/v1/auth/login',
  LOGOUT = '/api/v1/auth/logout',
  GET = '/api/v1/users',
  SIGN_UP = '/api/v1/users',
}

export const loginUser = async (payload: LoginPayload) => {
  return httpClient.post<User>(UserRoutes.LOGIN, payload);
};

export const signUpUser = async (payload: SignUpPayload) => {
  return httpClient.post<User>(UserRoutes.SIGN_UP, payload);
};

export const logoutUser = async () => {
  return httpClient.post(UserRoutes.LOGOUT);
};

const getUser = async () => {
  const [response, error] = await promiser(httpClient.get<User>(UserRoutes.GET));

  if (response) {
    return response.data;
  }

  if (error instanceof HttpError && error.code === StatusCodes.UNAUTHORIZED) {
    return null;
  }
};

export const userQuery = {
  queryKey: ['user'],
  queryFn: () => getUser(),
};

export const useUser = () => {
  return useQuery(userQuery);
};

export const useUserLogoutMutation = (onSettledCallback: () => void) => {
  const queryClient = useQueryClient();
  const [, setSnackbar] = useAtom(snackbarAtom);

  return useMutation(logoutUser, {
    onSuccess: async () => {
      queryClient.setQueryData(userQuery.queryKey, null);
    },
    onError: (error) => {
      if (error instanceof HttpError) {
        setSnackbar({ open: true, message: error.message, severity: 'error' });
      }
    },
    onSettled: onSettledCallback,
  });
};
