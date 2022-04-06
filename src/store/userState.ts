import { atom } from 'recoil';

import { User } from '@src/interfaces/User';

export const userState = atom<User | null>({
  key: 'User',
  default: null,
});
