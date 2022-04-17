import { atom, selector } from 'recoil';

import { getUser } from '@src/api/user';
import { User } from '@src/interfaces/model/User';

export const userInfoQuery = selector<User | null>({
  key: 'UserInfo/Default',
  get: async () => {
    const [user, error] = await getUser();

    if (error) throw error;

    return user;
  },
});

export const userInfoState = atom<User | null>({
  key: 'UserInfo',
  default: userInfoQuery,
});
