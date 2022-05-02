import { atom, selector } from 'recoil';

import { User } from '@src/interfaces/model/User';
import { getUser } from '@src/services/user';

const userInfoQuery = selector<User | null>({
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
