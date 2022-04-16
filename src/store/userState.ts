import { StatusCodes } from 'http-status-codes';
import { atom, selector } from 'recoil';

import { httpClient } from '@src/api/httpClient';
import { HttpError } from '@src/api/httpError';
import { promiser } from '@src/api/promiser';
import { User } from '@src/interfaces/model/User';

export const userInfoQuery = selector<User | null>({
  key: 'UserInfo/Default',
  get: async () => {
    const [data, error] = await promiser(httpClient.get<User>('/api/v1/users'));

    if (error instanceof HttpError && error.code === StatusCodes.UNAUTHORIZED) {
      console.error(error);
    } else if (error) {
      throw error;
    }

    if (data) return data.data;

    return data;
  },
});

export const userInfoState = atom<User | null>({
  key: 'UserInfo',
  default: userInfoQuery,
});
