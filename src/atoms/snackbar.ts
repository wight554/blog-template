import { AlertColor } from '@mui/material';
import { atom } from 'jotai';

interface SnackbarState {
  open: boolean;
  message?: string;
  severity?: AlertColor;
}

export const snackbarInitialValue = { open: false };

export const snackbarAtom = atom<SnackbarState>(snackbarInitialValue);
