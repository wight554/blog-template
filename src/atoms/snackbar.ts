import { AlertColor } from '@mui/material';
import { atom } from 'jotai';

interface SnackbarState {
  open: boolean;
  message?: string;
  severity?: AlertColor;
}

export const snackbarAtom = atom<SnackbarState>({ open: false });
