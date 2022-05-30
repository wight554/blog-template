import { httpClient } from '@src/api/httpClient';
import { promiser } from '@src/api/promiser';
import { User } from '@src/interfaces/model/User';
import { LoginPayload } from '@src/interfaces/payload/LoginPayload';
import { SignUpPayload } from '@src/interfaces/payload/SignUpPayload';
import { handlePromiserResult } from '@src/utils/api';

enum UserRoutes {
  LOGIN = '/api/v1/auth/login',
  LOGOUT = '/api/v1/auth/logout',
  GET = '/api/v1/users',
  SIGN_UP = '/api/v1/users',
}

export const loginUser = async (payload: LoginPayload) => {
  const result = await promiser(httpClient.post<User>(UserRoutes.LOGIN, payload));

  return handlePromiserResult(result);
};

export const logoutUser = async () => {
  const result = await promiser(httpClient.post(UserRoutes.LOGOUT));

  return handlePromiserResult(result);
};

export const signUpUser = async (payload: SignUpPayload) => {
  const result = await promiser(httpClient.post<User>(UserRoutes.SIGN_UP, payload));

  return handlePromiserResult(result);
};

export const getUser = async () => {
  const result = await promiser(httpClient.get<User>(UserRoutes.GET));

  return handlePromiserResult(result);
};
