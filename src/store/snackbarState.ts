import { AlertColor } from '@mui/material';
import { atom } from 'recoil';

interface SnackbarState {
  open: boolean;
  message?: string;
  severity?: AlertColor;
}

export const snackbarState = atom<SnackbarState>({
  key: 'Snackbar',
  default: { open: false },
});
