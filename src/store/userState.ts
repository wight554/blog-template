import { atom } from 'recoil';

import { User } from '@src/interfaces/model/User';

export const userState = atom<User | null>({
  key: 'User',
  default: null,
});
