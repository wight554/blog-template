import { atom } from 'recoil';

export const loadingState = atom<boolean>({
  key: 'GlobalLoading',
  default: false,
});
